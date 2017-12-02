// import _ from 'lodash';
import update from 'immutability-helper';

const MAX_ENTRIES = 50;

const initialState = {
  entries: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'RESET':
    case 'callLog/RESET':
      return initialState;

    case 'callLog/ADD': {
      return update(state, {
        entries: { $splice: [[0, 0, action.entry], [MAX_ENTRIES]] },
      });
    }

    case 'callLog/SET_FEEDBACK': {
      if (!action.value) {
        return update(state, {
          entries: {
            [action.itemIndex]: { $unset: ['feedback'] },
          },
        });
      }
      return update(state, {
        entries: {
          [action.itemIndex]: { feedback: { $set: action.value } },
        },
      });
    }

    default:
      return state;
  }
};
