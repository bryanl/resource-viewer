import { Connector, Rect } from './node';

describe("Connector", () => {
  test("r1 is to left and above r2", () => {
    const r1 = genRect(0, 0);
    const r2 = genRect(320, 534);

    const c = new Connector(r1, r2);
    const got = c.boundingBox();

    const expected = {
      top: 130.5,
      height: 320,
      left: 0,
      width: 734
    };

    expect(got).toEqual(expected);
  });

  test("r1 is to left and below r2", () => {
    const r1 = genRect(500, 0);
    const r2 = genRect(200, 320);

    const c = new Connector(r1, r2);
    const got = c.boundingBox();

    const expected = {
      top: 330.5,
      height: 300,
      left: 0,
      width: 520
    };

    expect(got).toEqual(expected);
  });

  test("r1 is to right of r2", () => {
    const r1 = genRect(333, 512);
    const r2 = genRect(469, 212);

    const c = new Connector(r1, r2);
    const got = c.boundingBox();

    const expected = {
      top: 463.5,
      height: 136,
      left: 212,
      width: 500
    };

    expect(got).toEqual(expected);
  });
});

let genRect = (top: number, left: number): Rect => {
  return {
    top: top,
    left: left,
    width: 200,
    height: 261
  };
};
