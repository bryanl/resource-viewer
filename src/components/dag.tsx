import './dag.scss';

import * as React from 'react';

import { NodePosition, Rect, ResourceNode } from './node';

export interface DAGProps {
  dag: { [key: string]: Array<string> };
}

interface DAGState {
  childrenPositions: { [key: string]: { [key: string]: Rect } };
  nodes: { [key: string]: Rect };
  positions: { [key: string]: NodePosition };
}

export class DAG extends React.Component<DAGProps, DAGState> {
  private _nodeEdges: { [key: string]: { [key: string]: Rect } } = {};
  private _dag = React.createRef<HTMLDivElement>();

  constructor(props: DAGProps) {
    super(props);

    this.state = {
      childrenPositions: {},
      nodes: {},
      positions: {}
    };

    for (var key in props.dag) {
      this._nodeEdges[key] = {};
    }
  }

  bounds = (): Rect | undefined => {
    if (!this._dag.current) {
      return;
    }

    const boundingRect = this._dag.current.getBoundingClientRect();

    const rect: Rect = {
      top: boundingRect.top,
      left: boundingRect.left,
      height: boundingRect.height,
      width: boundingRect.width
    };

    return rect;
  };

  updatePosition = (label: string, rect: Rect): void => {
    this.setState(state => {
      return { nodes: { ...state.nodes, [label]: rect } };
    });
  };

  randomPositionInRect = (rect: Rect): NodePosition => {
    return {
      offsetX: 200 + getRandomInt(0, rect.width - 200),
      offsetY: 250 + getRandomInt(0, rect.height - 250)
    };
  };

  componentDidMount() {
    const nodePos: { [key: string]: NodePosition } = {};
    const bounds = this.bounds();

    if (bounds) {
      console.log("dag bounds", bounds);

      for (var key in this.props.dag) {
        if (!nodePos[key]) {
          nodePos[key] = { offsetX: 100, offsetY: 100 };

          // if (bounds) {
          //   nodePos[key] = this.randomPositionInRect(bounds);
          // } else {
          //   nodePos[key] = { x: 0, y: 0 };
          // }
        }

        const children = this.props.dag[key];
        for (let child of children) {
          if (!nodePos[child]) {
            nodePos[child] = { offsetX: 0, offsetY: 0 };
            // if (bounds) {
            //   nodePos[key] = this.randomPositionInRect(bounds);
            // } else {
            //   nodePos[child] = { x: 0, y: 0 };
            // }
          }
        }
      }

      this.setState({ positions: nodePos });
    }
  }

  render() {
    const nodes = [];
    for (var key in this.state.positions) {
      const x = this.state.positions[key].offsetX;
      const y = this.state.positions[key].offsetY;

      let edges: NodePosition[] = [];

      if (this.props.dag[key]) {
        for (var edge of this.props.dag[key]) {
          edges.push({ offsetX: 0, offsetY: 0 });
        }
      }

      nodes.push(
        <ResourceNode
          key={key}
          label={key}
          pos={{ offsetX: x, offsetY: y }}
          edges={edges}
          updatePosition={this.updatePosition}
          connections={this.props.dag[key]}
          nodes={this.state.nodes}
        />
      );
    }

    return (
      <div ref={this._dag} className="dag">
        {nodes}
      </div>
    );
  }
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
