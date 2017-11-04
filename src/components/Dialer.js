import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import Paper from 'material-ui/Paper';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { trim, get } from 'lodash';
import { PhoneNumberUtil, PhoneNumberFormat } from 'google-libphonenumber';
import { compose, pure, withPropsOnChange, withHandlers, getContext } from 'recompose';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import CallIcon from 'material-ui-icons/Call';
import CallEndIcon from 'material-ui-icons/CallEnd';
import PhoneInTalkIcon from 'material-ui-icons/PhoneInTalk';
import { CALL_STATUS_IDLE, CALL_STATUS_STARTING, CALL_STATUS_ACTIVE } from 'react-sip';
import { CONFERENCE_PHONE_NUMBER } from './../../src/redux/dialer/constants';
import { GenerateSipConfig } from '../graphql/mutations';

const phoneUtil = PhoneNumberUtil.getInstance();

const Wrapper = styled(Paper).attrs({
  elevation: 0,
})`
  display: flex;
  flex-grow: 1;
  align-items: center;
  justify-content: center;
  padding-top: 10px;
`;
const CallForm = styled.div`
  max-width: 600px;
  display: flex;
  align-items: center;
`;
const ActionButtonWrapper = styled.div`
  width: 40px;
`;

const Dialer = ({
  phoneNumber,
  phoneNumberIsValid,
  phoneNumberIsEmpty,
  onPhoneNumberChange,
  onPhoneNumberFocus,
  onPhoneNumberKeyDown,
  onStartButtonClick,
  onStopButtonClick,
  callStatus,
  helperText,
}) => (
  <Wrapper>
    <CallForm>
      <TextField
        label={callStatus === CALL_STATUS_IDLE ? 'Who shall we call?' : ' '}
        placeholder="e.g. +44 000 000-00-00"
        error={!phoneNumberIsEmpty && !phoneNumberIsValid}
        helperText={helperText}
        value={phoneNumber}
        disabled={callStatus !== CALL_STATUS_IDLE}
        InputProps={{
          onChange: onPhoneNumberChange,
          onFocus: onPhoneNumberFocus,
          onKeyDown: onPhoneNumberKeyDown,
        }}
      />
      <ActionButtonWrapper>
        {callStatus === CALL_STATUS_IDLE ? (
          <IconButton
            color={phoneNumberIsEmpty || !phoneNumberIsValid ? undefined : 'primary'}
            disabled={phoneNumberIsEmpty || !phoneNumberIsValid}
            onClick={onStartButtonClick}
          >
            <CallIcon />
          </IconButton>
        ) : null}
        {callStatus === CALL_STATUS_ACTIVE ? (
          <IconButton color="primary" onClick={onStopButtonClick}>
            <CallEndIcon />
          </IconButton>
        ) : null}
        {callStatus === CALL_STATUS_STARTING ? (
          <IconButton color="primary" onClick={onStopButtonClick}>
            <PhoneInTalkIcon />
          </IconButton>
        ) : null}
      </ActionButtonWrapper>
    </CallForm>
  </Wrapper>
);

export default compose(
  graphql(GenerateSipConfig, { name: 'generateSipConfig' }),
  getContext({
    sipStart: PropTypes.func,
    sipAnswer: PropTypes.func,
    sipStop: PropTypes.func,
    callStatus: PropTypes.string,
    updateSipConfig: PropTypes.func,
  }),
  connect(
    (state) => state.dialer,
    (dispatch) => ({
      requireLogin: () =>
        dispatch({
          type: 'user/REQUIRE_LOGIN',
          timestamp: +new Date(),
        }),
      setPhoneNumber: (value) =>
        dispatch({
          type: 'dialer/SET_PHONE_NUMBER',
          value,
        }),
      addToCallLog: (entry) =>
        dispatch({
          type: 'callLog/ADD',
          entry,
        }),
    }),
  ),
  withPropsOnChange(['phoneNumber'], ({ phoneNumber }) => {
    const phoneNumberIsEmpty = trim(phoneNumber) === '';
    let phoneNumberIsValid = false;
    if (phoneNumber.replace(/\s/g, '') === CONFERENCE_PHONE_NUMBER) {
      phoneNumberIsValid = true;
    } else if (!phoneNumberIsEmpty) {
      try {
        const phoneNumberProto = phoneUtil.parse(phoneNumber, 'UK');
        phoneNumberIsValid = phoneUtil.isValidNumber(phoneNumberProto);
      } catch (e) {
        /* eslint-disable-line no-empty */
      }
    }
    return {
      phoneNumberIsValid,
      phoneNumberIsEmpty,
    };
  }),
  withPropsOnChange(['callStatus'], ({ callStatus }) => {
    let helperText = ' ';
    if (callStatus === CALL_STATUS_STARTING) {
      helperText = 'dialing...';
    }
    if (callStatus === CALL_STATUS_ACTIVE) {
      helperText = 'on air!';
    }
    return {
      helperText,
      callStatus: callStatus || CALL_STATUS_IDLE,
    };
  }),
  withHandlers({
    startCallIfNeeded: ({
      callStatus,
      phoneNumberIsValid,
      phoneNumber,
      setPhoneNumber,
      sipStart,
      addToCallLog,
      generateSipConfig,
      requireLogin,
      updateSipConfig,
    }) => async () => {
      if (callStatus === CALL_STATUS_IDLE && phoneNumberIsValid) {
        let phoneNumberForSip;
        let phoneNumberForLog;
        if (phoneNumber.replace(/\s/g, '') === CONFERENCE_PHONE_NUMBER) {
          phoneNumberForSip = CONFERENCE_PHONE_NUMBER;
          phoneNumberForLog = CONFERENCE_PHONE_NUMBER;
        } else {
          phoneNumberForSip = phoneUtil.format(
            phoneUtil.parse(phoneNumber, 'UK'),
            PhoneNumberFormat.E164,
          );
          phoneNumberForLog = phoneUtil.format(
            phoneUtil.parse(phoneNumber, 'UK'),
            PhoneNumberFormat.INTERNATIONAL,
          );
        }
        setPhoneNumber(phoneNumberForLog);
        const phoneNumberWithNoSpaces = phoneNumberForLog.replace(/\s+/g, '');
        try {
          const response = await generateSipConfig({
            variables: {
              phoneNumber: phoneNumberWithNoSpaces,
            },
          });
          const config = get(response, ['data', 'generateSipConfig', 'config']);
          updateSipConfig(config);
          sipStart(phoneNumberForSip);
          addToCallLog({
            phoneNumber: phoneNumberForLog,
            startTimestamp: +new Date(),
          });
        } catch (e) {
          requireLogin();
        }
      }
    },
  }),
  withHandlers({
    onPhoneNumberChange: ({ setPhoneNumber }) => (e) => {
      setPhoneNumber(e.target.value);
    },
    onPhoneNumberFocus: ({ callStatus }) => (e) => {
      const { target } = e;
      setTimeout(() => {
        if (callStatus === CALL_STATUS_IDLE && target) {
          target.select();
        }
      }, 50);
    },
    onPhoneNumberKeyDown: ({ startCallIfNeeded }) => (e) => {
      if (e.which === 13) {
        // enter
        startCallIfNeeded();
      }
    },
    onStartButtonClick: ({ startCallIfNeeded }) => () => {
      startCallIfNeeded();
    },
    onStopButtonClick: ({ sipStop, callStatus }) => () => {
      if (callStatus === CALL_STATUS_ACTIVE) {
        sipStop();
      }
    },
  }),
  pure,
)(Dialer);
