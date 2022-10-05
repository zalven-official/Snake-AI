import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';

import Home from './pages/Home';
import NavigationBar from './components/NavigationBar';
import MessageMe from './components/MessageMe';

export function App() {
  return (
    <NavigationBar>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
      <MessageMe />
    </NavigationBar>
  );
}

export function WrappedApp() {
  return (
    <HashRouter>
      <App />
    </HashRouter>
  );
}
