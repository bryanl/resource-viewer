import './dag.scss';

import * as React from 'react';

import { ForceDirect } from './force_direct';
import { NodePosition, NodePositions, Rect, ResourceNode } from './node';

export type RelationshipMap = { [key: string]: string[] };

export interface DAGProps {
  dag: RelationshipMap;
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

  isOverlap = (p1: NodePosition, p2: NodePosition): boolean => {
    return !(
      p2.offsetX > p1.offsetX + 150 ||
      p2.offsetX + 150 < p1.offsetX ||
      p2.offsetY > p1.offsetY + 260 ||
      p2.offsetY + 260 < p1.offsetY
    );
  };

  checkOverlap = (pos1: NodePosition, positions: NodePositions): boolean => {
    for (const key in positions) {
      const pos2 = positions[key];
      if (this.isOverlap(pos1, pos2)) {
        return true;
      }
    }

    return false;
  };

  componentDidMount() {
    const nodePos: NodePositions = {};
    const bounds = this.bounds();

    if (bounds) {
      console.log("dag bounds", bounds);

      for (var key in this.props.dag) {
        let newPos = this.initNodePos(key, bounds);
        while (this.checkOverlap(newPos, nodePos)) {
          newPos = this.initNodePos(key, bounds);
        }
        nodePos[key] = newPos;
        const children = this.props.dag[key];
        for (let child of children) {
          newPos = this.initNodePos(child, bounds);
          while (this.checkOverlap(newPos, nodePos)) {
            newPos = this.initNodePos(key, bounds);
          }
          nodePos[child] = newPos;
        }
      }

      let moves = 1e5;
      while (moves > 0) {
        moves--;
        const cd = new ForceDirect(this.props.dag, nodePos);
        const forces = cd.forces();

        for (const key in forces) {
          const f = forces[key];

          const deltaX = Math.cos((f.angle * Math.PI) / 180) / f.magnitude;
          const deltaY = Math.sin((f.angle * Math.PI) / 180) / f.magnitude;

          let newX = nodePos[key].offsetX - deltaX;
          let newY = nodePos[key].offsetY - deltaY;

          if (
            newX < bounds.left + 20 ||
            newX > bounds.left + bounds.width - 20
          ) {
            newX = -newX;
          }
          if (
            newY < bounds.top - 10 ||
            newY > bounds.top + bounds.height - 400
          ) {
            newY = -newY;
          }

          nodePos[key].offsetX = newX;
          nodePos[key].offsetY = newY;
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
