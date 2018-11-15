import { RelationshipMap } from './dag';
import { ForceDirect, Forces } from './force_direct';
import { NodePositions } from './node';

describe("ForceDirect", () => {
  test("calc", () => {
    const rm: RelationshipMap = {
      d1: ["rs1"],
      rs1: ["p1"]
    };

    const positions: NodePositions = {
      rs1: { offsetX: 300, offsetY: 400 },
      d1: { offsetX: 600, offsetY: 300 },
      p1: { offsetX: 130, offsetY: 130 }
    };

    const fd = new ForceDirect(rm, positions);

    const forces = fd.forces();

    const expected: Forces = {
      d1: {
        angle: 51.67104071167778,
        magnitude: -291782601566.8205
      },
      p1: {
        angle: 11.936190536767953,
        magnitude: 284187188111.182
      },
      rs1: {
        angle: 20.335953517202114,
        magnitude: -489509728243.4763
      }
    };
    expect(forces).toEqual(expected);
  });
});
