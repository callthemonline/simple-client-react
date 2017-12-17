import React from 'react';
import { Link } from 'react-router-dom';
import MainArea from './MainArea';

const MainAreaWith404 = () => (
  <MainArea>
    <h1>page not found</h1>
    <p>
      <Link to="/">home</Link>
    </p>
  </MainArea>
);

export default MainAreaWith404;
