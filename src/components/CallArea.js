import React from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import styled from 'styled-components';
import { trim } from 'lodash';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { withState, compose, pure, withPropsOnChange, withHandlers, getContext } from 'recompose';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import CallIcon from 'material-ui-icons/Call';

const phoneUtil = PhoneNumberUtil.getInstance();
const conferencePhoneNumber = '3500';

const Wrapper = styled(Paper)`
  flex-grow: 1;
  display: flex;
  padding-top: 80px;
  align-items: center;
  justify-content: center;
`;
const CallForm = styled.div`
  max-width: 600px;
  display: flex;
  align-items: center;
`;
const ActionButtonWrapper = styled.div``;

const CallArea = ({ phoneNumber, phoneNumberIsValid, phoneNumberIsEmpty, onPhoneNumberChange }) =>
  (<Wrapper>
    <CallForm>
      <TextField
        label="Who shall we call?"
        placeholder="e.g. +44 000 000-00-00"
        error={!phoneNumberIsEmpty && !phoneNumberIsValid}
        helperText=" "
        value={phoneNumber}
        InputProps={{
          onChange: onPhoneNumberChange,
        }}
      />
      <ActionButtonWrapper>
        <IconButton color="primary" disabled={phoneNumberIsEmpty || !phoneNumberIsValid}>
          <CallIcon />
        </IconButton>
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
  withState('phoneNumber', 'setPhoneNumber', conferencePhoneNumber),
  withHandlers({
    onPhoneNumberChange: ({ setPhoneNumber }) => (e) => {
      setPhoneNumber(e.target.value);
    },
  }),
  withPropsOnChange(['phoneNumber'], ({ phoneNumber }) => {
    const phoneNumberIsEmpty = trim(phoneNumber) === '';
    let phoneNumberIsValid = false;
    if (phoneNumber.replace(/\s/g, '') === conferencePhoneNumber) {
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
  pure,
)(CallArea);
