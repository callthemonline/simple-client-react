import localForage from 'localforage';
import { withClientState } from 'apollo-link-state';
import { DialerInfo } from './queries';
import { CONFERENCE_PHONE_NUMBER } from '../config';

let defaultPhoneNumber;
(async () => {
  defaultPhoneNumber =
    (await localForage.getItem('dialer/CONFERENCE_PHONE_NUMBER')) || CONFERENCE_PHONE_NUMBER;
})();

export default withClientState({
  Query: {
    dialer: () => ({
      __typename: 'Dialer',
      phoneNumber: defaultPhoneNumber,
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
      localForage.setItem('dialer/CONFERENCE_PHONE_NUMBER', phoneNumber);
      return updatedDialer;
    },
  },
});
