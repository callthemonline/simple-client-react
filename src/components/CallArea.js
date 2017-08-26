import React from 'react';
import Paper from 'material-ui/Paper';
import styled from 'styled-components';
import { trim } from 'lodash';
import { withState, compose, pure, withPropsOnChange, withHandlers } from 'recompose';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import CallIcon from 'material-ui-icons/Call';

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

const CallArea = ({ phoneNumber, phoneNumberIsWrong, phoneNumberIsEmpty, onPhoneNumberChange }) =>
  (<Wrapper>
    <CallForm>
      <TextField
        label="Who shall we call?"
        placeholder="e.g. +44 000 000-00-00"
        error={phoneNumberIsWrong}
        helperText=" "
        value={phoneNumber}
        InputProps={{
          onChange: onPhoneNumberChange,
        }}
      />
      <ActionButtonWrapper>
        <IconButton color="primary" disabled={phoneNumberIsWrong || phoneNumberIsEmpty}>
          <CallIcon />
        </IconButton>
      </ActionButtonWrapper>
    </CallForm>
  </Wrapper>);

export default compose(
  withState('phoneNumber', 'setPhoneNumber', '3500'),
  withHandlers({
    onPhoneNumberChange: ({ setPhoneNumber }) => (e) => {
      setPhoneNumber(e.target.value);
    },
  }),
  withPropsOnChange(['phoneNumber'], ({ phoneNumber }) => {
    const phoneNumberIsWrong = phoneNumber === '123';
    const phoneNumberIsEmpty = trim(phoneNumber) === '';
    return {
      phoneNumberIsWrong,
      phoneNumberIsEmpty,
    };
  }),
  pure,
)(CallArea);
