import React from 'react';
import PropTypes from 'prop-types';
import { SipProvider } from 'react-sip';
import { compose, withContext, withState } from 'recompose';

const DynamicSipProvider = ({ sipConfig, children }) => (
  <SipProvider {...sipConfig} debug>
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
