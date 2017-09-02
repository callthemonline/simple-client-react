import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import styled from 'styled-components';
import Paper from 'material-ui/Paper';
import { compose, getContext, withHandlers, withPropsOnChange } from 'recompose';
import { CALL_STATUS_IDLE } from 'react-sip';
import { connect } from 'react-redux';

import List, { ListItem, ListItemText, ListSubheader } from 'material-ui/List';

const Wrapper = styled(Paper).attrs({
  elevation: 0,
})`
  flex-grow: 1;
  display: flex;
`;

const DialLog = ({ entries, onListItemClick, allowListItemClicks }) =>
  (<Wrapper>
    <List dense subheader={<ListSubheader>Your Call Log</ListSubheader>}>
      {_.map(entries, (entry, i) =>
        (<ListItem
          button={allowListItemClicks}
          key={i}
          data-phonenumber={entry.phoneNumber}
          onClick={onListItemClick}
        >
          <ListItemText primary={entry.phoneNumber} />
        </ListItem>),
      )}
    </List>
  </Wrapper>);

export default compose(
  getContext({
    callStatus: PropTypes.string,
  }),
  withPropsOnChange(['callStatus'], ({ callStatus }) => ({
    allowListItemClicks: callStatus === CALL_STATUS_IDLE,
  })),
  connect((state) => state.callLog),
  withHandlers({
    onListItemClick: ({ dispatch }) => (e) => {
      dispatch({
        type: 'dialer/SET_PHONE_NUMBER',
        value: e.currentTarget.dataset['phonenumber'],
      });
    },
  }),
)(DialLog);
