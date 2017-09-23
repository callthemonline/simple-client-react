import React from 'react';
import { compose, withState, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import Menu, { MenuItem } from 'material-ui/Menu';

import MenuIcon from 'material-ui-icons/Menu';

const CustomAppBar = ({
  menuAnchorEl,
  menuIsOpen,
  onMenuIconButtonClick,
  onMenuRequestClose,
  onResetClick,
}) => (
  <AppBar>
    <Toolbar>
      <IconButton onClick={onMenuIconButtonClick} color="contrast" aria-label="Menu">
        <MenuIcon />
      </IconButton>
      <Menu
        id="app-bar-menu"
        anchorEl={menuAnchorEl}
        open={menuIsOpen}
        onRequestClose={onMenuRequestClose}
      >
        <MenuItem onClick={onResetClick}>Reset</MenuItem>
      </Menu>
      <Typography type="title" color="inherit">
        callthem.online
      </Typography>
    </Toolbar>
  </AppBar>
);

export default compose(
  connect(),
  withState('menuAnchorEl', 'setMenuAnchorEl'),
  withState('menuIsOpen', 'setMenuIsOpen'),
  withHandlers({
    onMenuIconButtonClick: ({ setMenuIsOpen, setMenuAnchorEl }) => (e) => {
      setMenuAnchorEl(e.currentTarget);
      setMenuIsOpen(true);
    },
    onMenuRequestClose: ({ setMenuIsOpen }) => () => {
      setMenuIsOpen(undefined);
    },
    onResetClick: ({ setMenuIsOpen, dispatch }) => () => {
      dispatch({ type: 'RESET' });
      setMenuIsOpen(undefined);
    },
  }),
)(CustomAppBar);
