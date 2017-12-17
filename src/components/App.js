import React from 'react';
import { ApolloProvider } from 'react-apollo';
import styled from 'styled-components';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import { blue } from 'material-ui/colors';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import client from '../graphql/client';

import DynamicSipProvider from './DynamicSipProvider';
import AppBar from './AppBar';
import MainAreaWithDialer from './MainAreaWithDialer';
import MainAreaWith404 from './MainAreaWith404';

const theme = createMuiTheme({
  palette: {
    type: 'light', // default. can be: dark
    primary: blue,
    text: {
      divider: '#7E7', // green-ish ListItem background
    },
  },
});

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
`;

const App = () => (
  <Router>
    <ApolloProvider client={client}>
      <DynamicSipProvider>
        <MuiThemeProvider theme={theme}>
          <Wrapper>
            <AppBar />
            <Switch>
              <Route exact path="/" component={MainAreaWithDialer} />
              <Route component={MainAreaWith404} />
            </Switch>
          </Wrapper>
        </MuiThemeProvider>
      </DynamicSipProvider>
    </ApolloProvider>
  </Router>
);

export default App;
