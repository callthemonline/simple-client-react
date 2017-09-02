import React from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { trim } from 'lodash';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { compose, pure, withPropsOnChange, withHandlers, getContext } from 'recompose';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import CallIcon from 'material-ui-icons/Call';
import CallEndIcon from 'material-ui-icons/CallEnd';
import { CALL_STATUS_IDLE, CALL_STATUS_STARTING, CALL_STATUS_ACTIVE } from 'react-sip';
import { CONFERENCE_PHONE_NUMBER } from './../../src/redux/dialer/constants';

const phoneUtil = PhoneNumberUtil.getInstance();

const Wrapper = styled(Paper).attrs({
  elevation: 0,
})`
  display: flex;
  flex-grow: 1;
  align-items: center;
  justify-content: center;
  min-height: 120px;
  padding-top: 10px;
`;
const CallForm = styled.div`
  max-width: 600px;
  display: flex;
  align-items: center;
`;
const ActionButtonWrapper = styled.div`width: 40px;`;

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
}) =>
  (<Wrapper>
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
        {callStatus === CALL_STATUS_IDLE
          ? <IconButton
            color={phoneNumberIsEmpty || !phoneNumberIsValid ? undefined : 'primary'}
            disabled={phoneNumberIsEmpty || !phoneNumberIsValid}
            onClick={onStartButtonClick}
          >
            <CallIcon />
          </IconButton>
          : null}
        {callStatus === CALL_STATUS_ACTIVE
          ? <IconButton color="primary" onClick={onStopButtonClick}>
            <CallEndIcon />
          </IconButton>
          : null}
      </ActionButtonWrapper>
    </CallForm>
  </Wrapper>);

export default compose(
  getContext({
    sipStart: PropTypes.func,
    sipAnswer: PropTypes.func,
    sipStop: PropTypes.func,
    callStatus: PropTypes.string,
  }),
  connect(
    (state) => state.dialer,
    (dispatch) => ({
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
    };
  }),
  withHandlers({
    onPhoneNumberChange: ({ setPhoneNumber }) => (e) => {
      setPhoneNumber(e.target.value);
    },
    onPhoneNumberFocus: ({ callStatus }) => (e) => {
      const target = e.target;
      setTimeout(() => {
        if (callStatus === CALL_STATUS_IDLE && target) {
          target.select();
        }
      }, 50);
    },
    onPhoneNumberKeyDown: ({
      callStatus,
      phoneNumberIsValid,
      phoneNumber,
      sipStart,
      addToCallLog,
    }) => (e) => {
      if (e.which === 13) {
        // enter
        if (callStatus === CALL_STATUS_IDLE && phoneNumberIsValid) {
          sipStart(phoneNumber);
          addToCallLog({ phoneNumber, startTimestamp: +new Date() });
        }
      }
    },
    onStartButtonClick: ({
      sipStart,
      callStatus,
      phoneNumberIsValid,
      phoneNumber,
      addToCallLog,
    }) => () => {
      if (callStatus === CALL_STATUS_IDLE && phoneNumberIsValid) {
        sipStart(phoneNumber);
        addToCallLog({ phoneNumber, startTimestamp: +new Date() });
      }
    },
    onStopButtonClick: ({ sipStop, callStatus }) => () => {
      if (callStatus === CALL_STATUS_ACTIVE) {
        sipStop();
      }
    },
  }),
  pure,
)(Dialer);
