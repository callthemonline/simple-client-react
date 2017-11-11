import React from 'react';
import { SipProvider } from 'react-sip';

export default ({ config, children }) => (
  <SipProvider
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
    autoRegister={false}
    extraHeaders={config && config.extraHeaders}
  >
    {children}
  </SipProvider>
);
