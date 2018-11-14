import './App.css';

import React, { Component } from 'react';

import { DAG } from './components/dag';

class App extends Component {
  render() {
    const dag = {
      "ingress": ["service1"],
      "service1": ["pod1"],
      "deployment1": ["rs1"],
      "rs1": ["pod1"],
    };

    return (
      <div className="App">
        <DAG dag={dag} />
      </div>
    );
  }
}

export default App;
