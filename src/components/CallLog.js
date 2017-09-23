import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import styled from 'styled-components';
import Paper from 'material-ui/Paper';
import { compose, getContext, withHandlers, withPropsOnChange, lifecycle } from 'recompose';
import { CALL_STATUS_IDLE } from 'react-sip';
import { connect } from 'react-redux';
import List, {
  ListItem,
  ListItemText,
  ListSubheader,
  ListItemSecondaryAction,
} from 'material-ui/List';
import ThumbUpIcon from 'material-ui-icons/ThumbUp';
import ThumbDownIcon from 'material-ui-icons/ThumbDown';
import IconButton from 'material-ui/IconButton';

const timeago = require('timeago.js');

const timeagoDictionary = (number, index) => {
  return [
    ['just now', 'a while'],
    ['less than a minute ago', 'in less than a minute'],
    ['1 minute ago', 'in 1 minute'],
    ['%s minutes ago', 'in %s minutes'],
    ['1 hour ago', 'in 1 hour'],
    ['%s hours ago', 'in %s hours'],
    ['1 day ago', 'in 1 day'],
    ['%s days ago', 'in %s days'],
    ['1 week ago', 'in 1 week'],
    ['%s weeks ago', 'in %s weeks'],
    ['1 month ago', 'in 1 month'],
    ['%s months ago', 'in %s months'],
    ['1 year ago', 'in 1 year'],
    ['%s years ago', 'in %s years'],
  ][index];
};
timeago.register('custom', timeagoDictionary);

const timeagoInstance = timeago();

const Wrapper = styled(Paper).attrs({
  elevation: 0,
})`
  flex-grow: 1;
  display: flex;
`;

const DialLog = ({ entries, onListItemClick, allowListItemClicks, onFeedbackButtonClick }) => (
  <Wrapper>
    <List subheader={<ListSubheader>Your Call Log</ListSubheader>}>
      {_.map(entries, (entry, i) => (
        <ListItem
          button={allowListItemClicks}
          key={i}
          data-phonenumber={entry.phoneNumber}
          onClick={onListItemClick}
        >
          <ListItemText
            primary={entry.phoneNumber}
            secondary={timeagoInstance.format(entry.startTimestamp, 'custom')}
          />
          <ListItemSecondaryAction>
            <IconButton
              data-value={entry.feedback === 'positive' ? undefined : 'positive'}
              data-itemindex={i}
              color={entry.feedback === 'positive' ? 'primary' : undefined}
              onClick={onFeedbackButtonClick}
            >
              <ThumbUpIcon />
            </IconButton>
            <IconButton
              data-value={entry.feedback === 'negative' ? undefined : 'negative'}
              data-itemindex={i}
              color={entry.feedback === 'negative' ? 'accent' : undefined}
              onClick={onFeedbackButtonClick}
            >
              <ThumbDownIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  </Wrapper>
);

export default compose(
  getContext({
    callStatus: PropTypes.string,
  }),
  connect((state) => state.callLog),
  withPropsOnChange(['callStatus'], ({ callStatus }) => ({
    allowListItemClicks: callStatus === CALL_STATUS_IDLE,
  })),
  lifecycle({
    state: {
      ticksElapsed: 0,
    },
    componentDidMount() {
      this.ticker = setInterval(
        () =>
          this.setState((state) => ({
            ticksElapsed: state.ticksElapsed + 1,
          })),
        5000,
      );
    },
    componentWillUnmount() {
      clearInterval(this.ticker);
    },
  }),
  withHandlers({
    onListItemClick: ({ dispatch }) => (e) => {
      dispatch({
        type: 'dialer/SET_PHONE_NUMBER',
        value: e.currentTarget.dataset['phonenumber'],
      });
    },
    onFeedbackButtonClick: ({ dispatch }) => (e) => {
      dispatch({
        type: 'callLog/SET_FEEDBACK',
        itemIndex: e.currentTarget.dataset['itemindex'] * 1,
        value: e.currentTarget.dataset['value'],
      });
    },
  }),
)(DialLog);
