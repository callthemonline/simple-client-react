import gql from 'graphql-tag';

export const DialerInfo = gql`
  query DialerInfo {
    dialer @client {
      phoneNumber
    }
  }
`;
