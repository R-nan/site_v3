import React from 'react';
import {Route, Switch} from 'react-router';
import { RoutePath } from './RoutePath';
import Home from '../pages/Home';
import BreathingDots from '../pages/BreathingDots';
import CcmExercises from '../pages/CcmExercises';

export default (
  <Switch>
    <Route path={RoutePath.Home} exact component={Home} />
    <Route path={RoutePath.BreathingDots} exact component={BreathingDots} />
    <Route path={RoutePath.CcmExercises} component={CcmExercises} />
  </Switch>
);