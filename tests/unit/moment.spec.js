/* eslint-disable jest/no-hooks */
import { Model } from "@/models/Base.js";
import { Distance, Weight } from "@/models/Quantities.js";
import { Moment } from "@/models/Moment.js";

describe("moment", () => {
  let moment;
  beforeAll(() => {
    moment = new Moment(new Weight(1 / 2), new Distance(2));
  });

  it("extends Model", () => {
    expect(Moment.prototype).toBeInstanceOf(Model);
  });

  it("got a lever", () => {
    expect(moment.lever).toBeInstanceOf(Distance);
  });

  it("got a mass", () => {
    expect(moment.mass).toBeInstanceOf(Weight);
  });

  it("got a value", () => {
    expect(moment).toHaveProperty("value");
    expect(moment.value).toBeCloseTo(1);
    expect(Number(moment)).toBeCloseTo(1);
  });

  it("got a unit", () => {
    expect(moment).toHaveProperty("unit");
    expect(moment.unit).toMatch(moment.mass.unit);
    expect(moment.unit).toMatch(moment.lever.unit);
  });

  it("export toJSON", () => {
    expect(moment).toHaveProperty("toJSON");
    expect(moment.toJSON()).toMatchSnapshot();
  });

  it("import from literal", () => {
    expect(
      Moment.from({
        lever: {
          precision: 1,
          type: "Distance",
          unit: "m",
          value: 2
        },
        mass: {
          precision: 1,
          type: "Weight",
          unit: "kg",
          value: 0.5
        },
        type: "Moment"
      })
    ).toMatchSnapshot();
  });

  it("linearCoG(), creates moment from 1D lever & mass arrray", () => {
    expect(
      Moment.linearCoG({ mass: 1 / 2, lever: 2 }, { mass: 1 / 2, lever: -2 })
    ).toStrictEqual(new Moment(1, 0));
    expect(
      Moment.linearCoG({ mass: 3, lever: 2 }, { mass: 2, lever: -2 })
    ).toStrictEqual(new Moment(5, 0.4));
    expect(
      Moment.linearCoG({ mass: 1, lever: 1 }, { mass: 1, lever: -1 })
    ).toStrictEqual(new Moment(2, 0));
  });
});
