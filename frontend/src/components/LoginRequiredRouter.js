// Special router for pages which need login

import React from 'react';
import { Route } from 'react-router-dom';
import { withAuthenticationRequired } from '@auth0/auth0-react';

const LoginRequiredRouter = ({ component, ...args }) => (
  <Route
    component={withAuthenticationRequired(component)}
    {...args}
  />
);

export default LoginRequiredRouter;
