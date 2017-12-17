import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import MainArea from './MainArea';
import Dialer from './Dialer';
import CallLog from './CallLog';

const DialWrapper = styled.div`
  display: flex;
  flex-grow: ${(p) => (p['data-calllogisempty'] ? 1 : 0)};
  position: relative;
  transition: all 0.5s ease-in-out;
  min-height: 120px;
`;
const CallLogWrapper = styled.div`
  display: flex;
  flex-grow: ${(p) => (p['data-calllogisempty'] ? 0 : 1)};
  height: ${(p) => (p['data-calllogisempty'] ? 0 : 'auto')};
  position: relative;
  transition: all 0.5s ease-in-out;
  overflow: scroll;
`;

const MainAreaWithDialer = ({ callLogIsEmpty }) => (
  <MainArea>
    <DialWrapper data-calllogisempty={callLogIsEmpty}>
      <Dialer />
    </DialWrapper>
    <CallLogWrapper data-calllogisempty={callLogIsEmpty}>
      <CallLog />
    </CallLogWrapper>
  </MainArea>
);

export default connect((state) => ({
  callLogIsEmpty: !state.callLog.entries.length,
}))(MainAreaWithDialer);
