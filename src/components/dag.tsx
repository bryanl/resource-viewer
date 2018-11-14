import './dag.scss';

import * as React from 'react';

import { ForceDirect } from './force_direct';
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
  private _nodeEdge: { [key: string]: NodePosition } = {};
  private _dag = React.createRef<HTMLDivElement>();

  constructor(props: DAGProps) {
    super(props);

    this.state = {
      childrenPositions: {},
      nodes: {},
      positions: {}
    };
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
      offsetY: 220 + getRandomInt(0, rect.height - 250)
    };
  };

  initNodePos = (key: string, bounds: Rect) => {
    let nodePos: NodePosition;

    if (!this._nodeEdge[key]) {
      nodePos = this.randomPositionInRect(bounds);
    } else {
      nodePos = this._nodeEdge[key];
    }

    return nodePos;
  };

  componentDidMount() {
    const nodePos: { [key: string]: NodePosition } = {};
    const bounds = this.bounds();

    if (bounds) {
      console.log("dag bounds", bounds);

      for (var key in this.props.dag) {
        nodePos[key] = this.initNodePos(key, bounds);

        const children = this.props.dag[key];
        for (let child of children) {
          nodePos[child] = this.initNodePos(child, bounds);
        }
      }

      const cd = new ForceDirect(nodePos);
      const forces = cd.forces();

      console.log(`forces:`, forces);

      for (const key in forces) {
        const f = forces[key];

        if (f.magnitude < 0.05) {
          continue;
        }

        const newX = f.magnitude * Math.sin(f.direction);
        const newY = f.magnitude * Math.cos(f.direction);

        if (newX < 0 || newY < 0) {
          continue;
        }

        nodePos[key].offsetX = newX;
        nodePos[key].offsetY = newY;
      }

      this.setState({ positions: nodePos });
    }
  }

  render() {
    const nodes = [];
    for (var key in this.state.positions) {
      const x = this.state.positions[key].offsetX;
      const y = this.state.positions[key].offsetY;

      nodes.push(
        <ResourceNode
          key={key}
          label={key}
          pos={{ offsetX: x, offsetY: y }}
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
