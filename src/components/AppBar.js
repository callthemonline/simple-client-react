import React from 'react';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';

const App = () =>
  (<div>
    <AppBar position="static">
      <Toolbar>
        <IconButton color="contrast" aria-label="Menu">
          <MenuIcon />
        </IconButton>
        <Typography type="title" color="inherit">
          callthem.online
        </Typography>
      </Toolbar>
    </AppBar>
  </div>);

export default App;
