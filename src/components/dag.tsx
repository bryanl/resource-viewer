import * as React from 'react';

import { ResourceNode } from './node';

export interface DAGProps {
  dag: { [key: string]: string[] };
}

export class DAG extends React.Component<DAGProps, {}> {
  render() {
    const drawn: { [key: string]: boolean } = {};
    const nodes = [];
    let childId = 0;

    for (var key in this.props.dag) {
      if (!drawn[key]) {
        childId++;
        nodes.push(<ResourceNode key={childId} label={key} />);
        drawn[key] = true;
      }

      for (var i in this.props.dag[key]) {
        var label = this.props.dag[key][i];
        if (!drawn[label]) {
          childId++;
          nodes.push(<ResourceNode key={childId} label={label} />);
          drawn[label] = true;
        }
      }
    }

    return nodes;
  }
}
