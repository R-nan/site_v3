import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router';
import { Link } from 'react-router-dom';
import { Iteration, IterString } from '../../components/ccmExercise';
import {StyledCCM, StyledCcmList} from './styled'

export const CcmExercises = () => {
  let {path} = useRouteMatch()

  return (
    <StyledCCM>
      <Switch>
        <Route exact path={path}>
          <StyledCcmList>
            CCM Exercises
            <ul>
              <Link to={`${path}/iteration`}>iteration</Link>
              <Link to={`${path}/iter-string`}>iteration string</Link>
            </ul>
          </StyledCcmList>
        </Route>
        <Route path={`${path}/iteration`} component={Iteration} />
        <Route path={`${path}/iter-string`} component={IterString} />
      </Switch>
    </StyledCCM>
  )
}