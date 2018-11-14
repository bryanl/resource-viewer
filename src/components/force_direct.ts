import { NodePosition } from './node';

type Vector = {
  magnitude: number;
  direction: number;
};

type Forces = { [key: string]: Vector };

export class ForceDirect {
  constructor(private positions: { [key: string]: NodePosition }) {
    console.log("force direct: ", positions);
  }

  angle(n1: string, n2: string): number {
    const pos1 = this.positions[n1];
    const pos2 = this.positions[n2];

    const a =
      (Math.atan2(pos2.offsetY - pos1.offsetY, pos2.offsetX - pos1.offsetX) *
        180) /
      Math.PI;

    return 180 - a;
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
      const force = 1 - distance / 500;

      // calculate triangle adjacent, opposite
      const adjacent = Math.sin(angle) * force;
      x += adjacent;

      const opposite = Math.cos(angle) * force;
      y += opposite;
    }

    const theta1 = Math.atan(x / y);
    const theta2 = 90 - theta1;

    const magnitude = Math.sqrt(x * x + y * y);

    // console.log(`force: ${magnitude}, direction: ${theta2}`);

    return {
      magnitude: magnitude,
      direction: theta2
    };
  }
}
