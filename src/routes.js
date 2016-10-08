import React from 'react'
import { Route, IndexRoute } from 'react-router'
import Layout from './components/Layout';
import Canvas from './components/Canvas';
import NotFoundPage from './components/NotFoundPage'

const routes = (
  <Route path="/" component={Layout}>
    <IndexRoute component={Canvas}/>
    <Route path="*" component={NotFoundPage}/>
  </Route>
);

export default routes;
