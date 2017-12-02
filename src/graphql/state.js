import localForage from 'localforage';
import { withClientState } from 'apollo-link-state';
import { DialerInfo } from './queries';
import { CONFERENCE_PHONE_NUMBER } from '../config';

// TODO refactor after https://github.com/apollographql/apollo-link-state/issues/119 is resolved
let persistedPhoneNumber;
(async () => {
  persistedPhoneNumber = await localForage.getItem('dialer/PHONE_NUMBER');
})();

export default withClientState({
  Query: {
    dialer: () => ({
      __typename: 'Dialer',
      phoneNumber: persistedPhoneNumber || CONFERENCE_PHONE_NUMBER,
    }),
  },
  Mutation: {
    updateDialer: (_, { input: { phoneNumber } = {} }, { cache }) => {
      const currentDialerQuery = cache.readQuery({ query: DialerInfo, variables: {} });
      const updatedDialer = {
        ...currentDialerQuery.dialer,
        phoneNumber,
      };
      cache.writeQuery({
        query: DialerInfo,
        data: {
          dialer: updatedDialer,
        },
      });
      localForage.setItem('dialer/PHONE_NUMBER', phoneNumber);
      return updatedDialer;
    },
  },
});
