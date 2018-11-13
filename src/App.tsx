import './App.css';

import React, { Component } from 'react';

import { DAG } from './components/dag';

class App extends Component {
  render() {
    // const dag = {
    //   a: ["b", "c"],
    //   b: ["d"]
    // };

    const dag = {
      a: ["b", "c"]
    };

    return (
      <div className="App">
        <DAG dag={dag} />
      </div>
    );
  }
}

export default App;
