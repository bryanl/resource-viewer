import { RelationshipMap } from './dag';
import { NodePositions } from './node';

export type Vector = {
  magnitude: number;
  angle: number;
};

export type Forces = { [key: string]: Vector };

export class ForceDirect {
  constructor(
    public relationshipMap: RelationshipMap,
    public positions: NodePositions
  ) {}

  angle(n1: string, n2: string): number {
    const pos1 = this.positions[n1];
    const pos2 = this.positions[n2];

    const a =
      (Math.atan2(pos2.offsetY - pos1.offsetY, pos2.offsetX - pos1.offsetX) *
        180) /
      Math.PI;

    return a;
  }

  distance(n1: string, n2: string): number {
    const pos1 = this.positions[n1];
    const pos2 = this.positions[n2];

    const a = pos1.offsetX - pos2.offsetX;
    const b = pos1.offsetY - pos2.offsetY;

    return Math.sqrt(a * a + b * b);
  }

  forces(): Forces {
    const f: Forces = {};

    for (const k1 in this.positions) {
      f[k1] = this.force(k1);
    }

    return f;
  }

  force(k1: string): Vector {
    let y: number = 0;
    let x: number = 0;

    for (const k2 in this.positions) {
      if (k1 === k2) {
        continue;
      }

      const angle = this.angle(k1, k2);
      const distance = this.distance(k1, k2);

      const k = 1000000;
      const q = 2e5;
      const q1 = q;
      const q2 = this.isConnected(k1, k2) ? -q : q;
      const force = k * ((q1 * q2) / (distance * distance));

      // calculate triangle adjacent, opposite
      const adjacent = Math.sin((angle * Math.PI) / 180) * force;
      x -= adjacent;

      const opposite = Math.cos((angle * Math.PI) / 180) * force;
      y -= opposite;
    }

    const theta1 = (Math.atan(x / y) * 180) / Math.PI;
    const theta2 = 90 - Math.abs(theta1);

    let magnitude = Math.sqrt(x * x + y * y);
    if (theta1 < 0) {
      magnitude = -magnitude;
    }

    return {
      magnitude: magnitude,
      angle: theta2
    };
  }

  isConnected(k1: string, k2: string): boolean {
    if (hasNode(this.relationshipMap, k1)) {
      if (this.relationshipMap[k1].includes(k2)) {
        return true;
      }
    }

    if (hasNode(this.relationshipMap, k2)) {
      if (this.relationshipMap[k2].includes(k1)) {
        return true;
      }
    }

    return false;
  }
}

function hasNode(relationshipMap: RelationshipMap, node: string): boolean {
  for (const key in relationshipMap) {
    if (key == node) {
      return true;
    }
  }

  return false;
}
