import * as React from 'react';

import { NodePosition, Rect, ResourceNode } from './node';

export interface DAGProps {
  dag: { [key: string]: Array<string> };
}

interface DAGState {
  childrenPositions: { [key: string]: { [key: string]: Rect } };
  nodes: { [key: string]: Rect };
}

export class DAG extends React.Component<DAGProps, DAGState> {
  private _nodeEdges: { [key: string]: { [key: string]: Rect } } = {};

  constructor(props: DAGProps) {
    super(props);

    this.state = {
      childrenPositions: {},
      nodes: {}
    };

    for (var key in props.dag) {
      this._nodeEdges[key] = {};
    }
  }

  updatePosition = (label: string, rect: Rect): void => {
    this.setState(state => {
      return { nodes: { ...state.nodes, [label]: rect } };
    });
  };

  render() {
    const nodePos: { [key: string]: NodePosition } = {};
    const nodeSpacing = 0;

    let xPos = 100;

    for (var key in this.props.dag) {
      if (!nodePos[key]) {
        nodePos[key] = { x: xPos, y: 100 };
        xPos += nodeSpacing;
      }

      const children = this.props.dag[key];
      for (let child of children) {
        if (!nodePos[child]) {
          nodePos[child] = { x: xPos, y: 100 };
          xPos += nodeSpacing;
        }
      }

      this.state.childrenPositions[key] = {};
    }

    const nodes = [];
    for (var key in nodePos) {
      const x = nodePos[key].x;
      const y = nodePos[key].y;

      let edges: NodePosition[] = [];

      if (this.props.dag[key]) {
        for (var edge of this.props.dag[key]) {
          edges.push(nodePos[edge]);
        }
      }

      nodes.push(
        <ResourceNode
          key={key}
          label={key}
          pos={{ x: x, y: y }}
          edges={edges}
          updatePosition={this.updatePosition}
          connections={this.props.dag[key]}
          nodes={this.state.nodes}
        />
      );
    }

    return <div id="dag">{nodes}</div>;
  }
}
