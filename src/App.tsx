import React from 'react';
import {BrowserRouter as Router } from 'react-router-dom';
import routes from './router/routes';
import './App.css';

function App() {
  return (
    <Router>
      {routes}
    </Router>
  );
}

export default App;
