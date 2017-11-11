import gql from 'graphql-tag';

export const GenerateSipConfig = gql`
  mutation GenerateSipConfig($phoneNumber: String!) {
    generateSipConfig(input: { phoneNumber: $phoneNumber }) {
      config
    }
  }
`;
