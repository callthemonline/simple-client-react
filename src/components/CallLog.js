import React from 'react';
import _ from 'lodash';
import styled from 'styled-components';
import Paper from 'material-ui/Paper';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';

import List, { ListItem, ListItemText, ListSubheader } from 'material-ui/List';

const Wrapper = styled(Paper).attrs({
  elevation: 0,
})`
  flex-grow: 1;
  display: flex;
`;

const DialLog = ({ entries, onListItemClick }) =>
  (<Wrapper>
    <List dense subheader={<ListSubheader>Your Call Log</ListSubheader>}>
      {_.map(entries, (entry, i) =>
        (<ListItem button key={i} data-phonenumber={entry.phoneNumber} onClick={onListItemClick}>
          <ListItemText primary={entry.phoneNumber} />
        </ListItem>),
      )}
    </List>
  </Wrapper>);

export default compose(
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
