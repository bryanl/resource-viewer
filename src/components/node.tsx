import './node.css';

import * as React from 'react';

export class ResourceNode extends React.Component {
  render() {
    return <div className="card">
      <div className="header">
        <h2>*</h2>
      </div>

      <div className="container">
        <p>I'm a resource</p>
      </div>
    </div>
  }
}
