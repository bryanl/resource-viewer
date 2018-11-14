import './node.scss';

import * as React from 'react';
import Draggable, { DraggableData } from 'react-draggable';

export interface NodePosition {
  offsetX: number;
  offsetY: number;
}

export interface ResourceNodeProps {
  label: string;
  pos: NodePosition;
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

      rect.top = data.y + this.props.pos.offsetY;
      rect.left = data.x + this.props.pos.offsetX;
      this.props.updatePosition(this.props.label, rect);
    }
  };

  onStop = (e: Event, data: DraggableData): void | false => {
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

  render() {
    let cardStyle = {
      top: this.props.pos.offsetY,
      left: this.props.pos.offsetX
    };

    var edges: JSX.Element[] = [];
    if (this.props.connections && !this.isEmpty(this.props.nodes)) {
      for (let connection of this.props.connections) {
        const r1 = this.props.nodes[this.props.label];
        const r2 = this.props.nodes[connection];

        const connector = new Connector(r1, r2);
        const boundingBox = connector.boundingBox();
        const connectorStyle = connector.style()

        edges.push(
          <div key={connection} className="edge" style={connectorStyle}>
            <svg viewBox={`0 0 ${boundingBox.width} ${boundingBox.height}`}>
              <path
                d={connector.line()}
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
        <Draggable bounds="parent" onDrag={this.onDrag} onStop={this.onStop}>
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

export class Connector {
  constructor(private r1: Rect, private r2: Rect) {}

  boundingBox(): Rect {
    const r1 = this.r1;
    const r2 = this.r2;

    const c1CenterY = r1.top + r1.height / 2;

    let top = c1CenterY;
    let left = r1.left;
    let width = r1.width + r2.width + (r2.left - (r1.left + r1.width));
    let height =
      r2.height / 2 + r1.height / 2 + (r2.top - (r1.top + r1.height));

    if (r2.top < r1.top) {
      top = r2.top + r2.height / 2;
      height = r1.top + r1.height / 2 - top;
    }

    if (r2.left < r1.left) {
      left = r2.left;
      width = r2.width + r1.width + (r1.left - (r2.left + r2.width));
    }

    return {
      top: top,
      left: left,
      width: width,
      height: height
    };
  }

  line(): string {
    const boundingBox = this.boundingBox();

    let x1 = this.r1.width / 2 + 8;
    let y1 = 0;
    let x2 = boundingBox.width - this.r2.width / 2;
    let y2 = boundingBox.height;

    if (this.r2.left < this.r1.left) {
      let temp = x1;
      x1 = x2;
      x2 = temp;
    }

    if (this.r2.top < this.r1.top) {
      let temp = y1;
      y1 = y2;
      y2 = temp;
    }

    return `M${x1},${y1} C${x1},${y2} ${x2},${y1} ${x2},${y2}`;
  }

  style(): any {
    const boundingBox = this.boundingBox();
    return {
      top: boundingBox.top,
      left: boundingBox.left,
      width: `${boundingBox.width}px`,
      height: `${boundingBox.height}px`
    };
  }
}
