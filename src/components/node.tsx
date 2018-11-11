import './node.scss';

import * as React from 'react';
import Draggable from 'react-draggable';

export interface ResourceNodeProps { label: string};

export class ResourceNode extends React.Component<ResourceNodeProps, {}> {
  render() {
    return (
      <Draggable>
        <div className="card">
          <div className="header">
            <h2>*</h2>
          </div>

          <div className="container">
            <p>{this.props.label}</p>
          </div>
        </div>
      </Draggable>
    );
  }
}
