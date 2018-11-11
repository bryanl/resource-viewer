import './App.css';

import React, { Component } from 'react';

import { ResourceNode } from './components/node';

class App extends Component {
  render() {
    return (
      <div className="App">
        <ResourceNode />
      </div>
    );
  }
}

export default App;
