import gql from 'graphql-tag';

export const GenerateSipConfig = gql`
  mutation GenerateSipConfig($phoneNumber: String!) {
    generateSipConfig(input: { phoneNumber: $phoneNumber }) {
      config
    }
  }
`;

export const UpdateDialer = gql`
  mutation updateDialer($phoneNumber: String!) {
    updateDialer(input: { phoneNumber: $phoneNumber }) @client {
      phoneNumber
    }
  }
`;
