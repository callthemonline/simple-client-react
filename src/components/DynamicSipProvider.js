import React from 'react';
import { SipProvider } from 'react-sip';

export default ({ config, children }) => {
  if (config) {
    return (
      <SipProvider key={config && JSON.stringify(config)} autoRegister={false} {...config}>
        {children}
      </SipProvider>
    );
  }
  return children;
};
