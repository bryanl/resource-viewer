import './App.css';

import React, { Component } from 'react';

import { ResourceNode } from './components/node';

class App extends Component {
  render() {
    return (
      <div className="App">
        <ResourceNode label="node1" />
        <ResourceNode label="node2" />
      </div>
    );
  }
}

export default App;
