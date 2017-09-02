import update from 'immutability-helper';

import { CONFERENCE_PHONE_NUMBER } from './constants';

const initialState = {
  phoneNumber: CONFERENCE_PHONE_NUMBER,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'RESET':
    case 'dialer/RESET':
      return initialState;
    case 'dialer/SET_PHONE_NUMBER': {
      return update(state, { phoneNumber: { $set: action.value } });
    }
    default:
      return state;
  }
};
