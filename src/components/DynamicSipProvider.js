import React from 'react';
import PropTypes from 'prop-types';
import { SipProvider } from 'react-sip';
import { compose, withContext, withState } from 'recompose';

const DynamicSipProvider = ({ sipConfig, children }) => (
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
    extraHeaders={sipConfig && sipConfig.extraHeaders}
  >
    {children}
  </SipProvider>
);

export default compose(
  withState('sipConfig', 'updateSipConfig'),
  withContext(
    {
      updateSipConfig: PropTypes.func,
    },
    ({ updateSipConfig }) => ({ updateSipConfig }),
  ),
)(DynamicSipProvider);
