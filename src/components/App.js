import React from 'react';
import { SipProvider } from 'react-sip';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import styled from 'styled-components';

import AppBar from './AppBar';
import Dialer from './Dialer';
import CallLog from './CallLog';

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
`;

const MainArea = styled.div`
  display: flex;
  padding-top: 65px;
  flex-direction: column;
  flex-grow: 1;
  flex-direction: column;
`;

const DialWrapper = styled.div`
  display: flex;
  flex-grow: ${(p) => (p['data-callLogIsEmpty'] ? 1 : 0)};
  position: relative;
  transition: all 0.5s ease-in-out;
  min-height: 120px;
`;
const CallLogWrapper = styled.div`
  display: flex;
  flex-grow: ${(p) => (p['data-callLogIsEmpty'] ? 0 : 1)};
  height: ${(p) => (p['data-callLogIsEmpty'] ? 0 : 'auto')};
  position: relative;
  transition: all 0.5s ease-in-out;
`;

const App = ({ callLogIsEmpty }) =>
  (<SipProvider
    autoRegister={false}
    host="dev.callthem.online"
    port="7443"
    user="1007"
    password="31337"
    iceServers={[
      {
        urls: 'turn:free.nikulin.website:5349?transport=tcp',
        username: 'free',
        credential: 'denis',
      },
    ]}
  >
    <Wrapper>
      <AppBar />
      <MainArea>
        <DialWrapper data-callLogIsEmpty={callLogIsEmpty}>
          <Dialer />
        </DialWrapper>
        <CallLogWrapper data-callLogIsEmpty={callLogIsEmpty}>
          <CallLog />
        </CallLogWrapper>
      </MainArea>
    </Wrapper>
  </SipProvider>);

export default compose(
  connect((state) => ({
    callLogIsEmpty: !state.callLog.entries.length,
  })),
)(App);
