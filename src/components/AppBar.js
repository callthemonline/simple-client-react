import React from 'react';
import { compose, withState, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import Menu, { MenuItem } from 'material-ui/Menu';
import { translate } from 'react-i18next';

import MenuIcon from 'material-ui-icons/Menu';

const CustomAppBar = ({
  menuAnchorEl,
  menuIsOpen = false,
  onMenuIconButtonClick,
  onMenuRequestClose,
  onResetClick,
  t,
}) => (
  <AppBar>
    <Toolbar>
      <IconButton onClick={onMenuIconButtonClick} aria-label="Menu">
        <MenuIcon />
      </IconButton>
      <Menu
        id="app-bar-menu"
        anchorEl={menuAnchorEl}
        open={menuIsOpen}
        onClose={onMenuRequestClose}
      >
        <MenuItem onClick={onResetClick}>{t('appbar.reset')}</MenuItem>
      </Menu>
      <Typography type="title" color="inherit">
        {t('appbar.title')}
      </Typography>
    </Toolbar>
  </AppBar>
);

export default compose(
  translate('translations'),
  connect(),
  withState('menuAnchorEl', 'setMenuAnchorEl'),
  withState('menuIsOpen', 'setMenuIsOpen'),
  withHandlers({
    onMenuIconButtonClick: ({ setMenuIsOpen, setMenuAnchorEl }) => (e) => {
      setMenuAnchorEl(e.currentTarget);
      setMenuIsOpen(true);
    },
    onMenuRequestClose: ({ setMenuIsOpen }) => () => {
      setMenuIsOpen(false);
    },
    onResetClick: ({ setMenuIsOpen, dispatch }) => () => {
      dispatch({ type: 'RESET' });
      setMenuIsOpen(false);
    },
  }),
)(CustomAppBar);
