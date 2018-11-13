import './node.scss';

import * as React from 'react';
import Draggable, { DraggableData } from 'react-draggable';

export interface NodePosition {
  x: number;
  y: number;
}

export interface ResourceNodeProps {
  label: string;
  pos: NodePosition;
  edges: NodePosition[];
  updatePosition(label: string, pos: Rect | undefined): void;
  nodes: { [key: string]: Rect };
  connections: string[];
}

export interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface ResourceNodeState {
  edges: Rect[];
}

export class ResourceNode extends React.Component<
  ResourceNodeProps,
  ResourceNodeState
> {
  private _card = React.createRef<HTMLDivElement>();

  currentRect = (): Rect | undefined => {
    if (!this._card.current) {
      return undefined;
    }
    const current = this._card.current;
    const rect = current.getBoundingClientRect();
    const scrollLeft =
      window.pageXOffset ||
      (document.documentElement ? document.documentElement.scrollLeft : 0);
    const scrollTop =
      window.pageYOffset ||
      (document.documentElement ? document.documentElement.scrollTop : 0);

    return {
      top: rect.top + scrollTop,
      left: rect.left + scrollLeft,
      height: rect.height,
      width: rect.width
    };
  };

  onDrag = (e: Event, data: DraggableData): void | false => {
    if (this.props) {
      let rect = this.currentRect();
      if (!rect) {
        return false;
      }

      rect.top = data.y;
      rect.left = data.x;
      this.props.updatePosition(this.props.label, rect);
    }
  };

  onStop = (e: Event, data: DraggableData): void | false => {
    console.log(`moved ${this.props.label} to ${data.x},${data.y}`);

    this.onDrag(e, data);
  };

  componentDidMount() {
    if (this._card.current) {
      const current = this._card.current;

      const boundingRect = current.getBoundingClientRect();

      const rect: Rect = {
        top: boundingRect.top,
        left: boundingRect.left,
        height: boundingRect.height,
        width: boundingRect.width
      };

      this.props.updatePosition(this.props.label, rect);
    }
  }

  isEmpty = (obj: Object): boolean => {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) return false;
    }
    return true;
  };

  genEdgeBox = (r1: Rect, r2: Rect): Rect => {
    const c1CenterY = r1.top + r1.height / 2;
    const c2CenterY = r2.top + r2.height / 2;

    console.log("rects", r1, r2);

    const edgeRect: Rect = {
      top: c1CenterY,
      left: r1.left,
      width: r2.left - r1.left + r2.width - r1.left + r2.width,
      height: r2.height / 2 + r1.height / 2 + (r2.top - (r1.top + r1.height))
    };

    return edgeRect;
  };

  render() {
    let cardStyle = {
      top: this.props.pos.y,
      left: this.props.pos.x
    };

    var edges: JSX.Element[] = [];
    if (this.props.connections && !this.isEmpty(this.props.nodes)) {
      for (let connection of this.props.connections) {
        const r1 = this.props.nodes[this.props.label];
        const r2 = this.props.nodes[connection];
        const edgeRect = this.genEdgeBox(r1, r2);

        console.log("generated", edgeRect);
        const edgeBoxStyle = {
          top: edgeRect.top,
          left: edgeRect.left,
          width: `${edgeRect.width}px`,
          height: `${edgeRect.height}px`,
          // backgroundColor: "#efefef",
          // opacity: 0.5,
        };

        const x1 = r1.width / 2 + 8;
        const y1 = 0;
        const x2 = edgeRect.width - r2.width / 2;
        const y2 = edgeRect.height;

        edges.push(
          <div key={connection} className="edge" style={edgeBoxStyle}>
            <svg viewBox={`0 0 ${edgeRect.width} ${edgeRect.height}`}>
              <path
                d={`M${x1},${y1} C${x1},${y2} ${x2},${y1} ${x2},${y2}`}
                fill="transparent"
                stroke="grey"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
          </div>
        );
      }
    }

    let e;
    const d = document.getElementById("dag");
    if (d) {
      e = d;
    }

    return (
      <React.Fragment>
        <Draggable  onDrag={this.onDrag} onStop={this.onStop}>
          <div ref={this._card} className="card" style={cardStyle}>
            <div className="header">
              <h2>*</h2>
            </div>

            <div className="container">
              <p>{this.props.label}</p>
            </div>
          </div>
        </Draggable>
        {edges}
      </React.Fragment>
    );
  }
}
