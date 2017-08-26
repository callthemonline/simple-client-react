import React from 'react';
import { SipProvider } from 'react-sip';
import styled from 'styled-components';

import AppBar from './AppBar';
import CallArea from './CallArea';

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
`;

const App = () =>
  (<SipProvider
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
      <CallArea />
    </Wrapper>
  </SipProvider>);

export default App;
