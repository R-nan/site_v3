import React from 'react';
import {Route, Switch} from 'react-router';
import { RoutePath } from './RoutePath';
import Home from '../pages/Home';

export default (
  <Switch>
    <Route path={RoutePath.Home} exact component={Home} />
  </Switch>
);