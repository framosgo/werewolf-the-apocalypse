import React from 'react'
import { Route, IndexRoute } from 'react-router'
import Layout from './components/Layout';
import Tabletop from './components/Tabletop';
import NotFoundPage from './components/NotFoundPage'

const routes = (
  <Route path="/" component={Layout}>
    <IndexRoute component={Tabletop}/>
    <Route path="*" component={NotFoundPage}/>
  </Route>
);

export default routes;
