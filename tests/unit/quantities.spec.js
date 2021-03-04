/* eslint-disable jest/no-hooks */
import {
  Quantity,
  Distance,
  Speed,
  Volume,
  Altitude
} from "@/models/Quantities.js";
import { Model } from "@/models/Base.js";

describe("quantity", () => {
  it("extends Model", () => {
    expect(Quantity.prototype).toBeInstanceOf(Model);
  });
  it("set `value` to 0 as a default", () => {
    expect(new Quantity().value).toBe(0);
    expect(new Quantity().unit).toBeUndefined();
  });
  it("set `value` to first argument", () => {
    expect(new Quantity(1).value).toBe(1);
  });
  it("set `properties` to third argument", () => {
    expect(new Quantity(null, null, { accuracy: 1 }).accuracy).toBe(1);
  });
  it("throw an exception if `value` is not a Number", () => {
    expect(() => new Quantity("1qsdqsd2")).toThrow(
      "first argument should be a Number"
    );
  });
  it("throw an exception if `units` is not set while setting `unit`", () => {
    expect(() => new Quantity(1, "anyString")).toThrow(
      "list of available units should be set on class."
    );
  });
  it("throw an exception if `units` is not set", () => {
    expect(() => Quantity.units).toThrow(
      "list of available units should be set on class."
    );
  });

  describe("with `units` set", () => {
    let WithUnits;

    beforeAll(() => {
      WithUnits = Quantity;
      Object.defineProperty(WithUnits, "units", {
        get: function() {
          return { m: 1, mm: 1000, km: 0.001 };
        }
      });
    });

    it("access `units` on Quantity", () => {
      expect(WithUnits.units).toMatchObject({
        m: 1,
        mm: 1000,
        km: 0.001
      });
    });
    it("create a Quantity with value & optional unit", () => {
      expect(new WithUnits(10)).toMatchObject({
        value: 10,
        unit: undefined
      });
      expect(() => new WithUnits(10, "not listed")).toThrow(
        "'not listed' is not an available unit"
      );
      expect(new WithUnits(10, "mm")).toMatchObject({
        value: 0.01,
        unit: "mm"
      });
      expect(new WithUnits(1000, "mm")).toMatchObject({
        value: 1,
        unit: "mm"
      });
    });
    it("create a new Quantity from original as`newUnit`", () => {
      let originalQuantity = new WithUnits(10, "m");

      expect(originalQuantity.as("mm")).toMatchObject({
        value: 10,
        unit: "mm"
      });
      expect(originalQuantity.as("km")).toMatchObject({
        value: 10,
        unit: "km"
      });
      // Do we need to check for existing newUnit in units ?
      expect(() => originalQuantity.as("not listed")).toThrow(
        "'not listed' is not an available unit"
      );
    });
    it("toString(precision)", () => {
      //TODO check for locale or set one
      expect(new WithUnits().toString()).toBeUndefined();
      expect(new WithUnits(0, "m").toString()).toBe("0 m");
      expect(new WithUnits(123, "mm").toString()).toBe("123 mm");
      expect(new WithUnits(123, "mm").as("m").toString(0)).toBe("0 m");
      expect(new WithUnits(123, "m").toString(-2)).toBe("100 m");
    });

    describe("when `unit` is unset", () => {
      let q;

      beforeEach(() => {
        q = new WithUnits(10);
      });

      it("set value as `display unit value`", () => {
        q.unit = "mm";
        q.displayValue = 0;
        expect(q.value).toBeCloseTo(0);
        q.displayValue = 100;
        expect(q.value).toBeCloseTo(0.1);
        q.displayValue = 1000;
        expect(q.value).toBeCloseTo(1);
      });

      it("return value as `display unit value`", () => {
        q.unit = "mm";
        expect(q.displayValue).toBeCloseTo(10000);
      });
    });
  });
});

describe("distance", () => {
  it("extends Quantity", () => {
    expect(Distance.prototype).toBeInstanceOf(Quantity);
  });
  it("consume m", () => {
    expect(new Distance(1, "m").value).toBeCloseTo(1);
  });
  it("consume Km", () => {
    expect(new Distance(1, "Km").value).toBeCloseTo(1000);
  });
  it("consume ft", () => {
    expect(new Distance(1, "ft").value).toBeCloseTo(0.3048);
  });
  it("consume NM", () => {
    expect(new Distance(1, "NM").value).toBeCloseTo(1852);
  });
  it("consume mi", () => {
    expect(new Distance(1, "mi").value).toBeCloseTo(1609.34);
  });
  it("consume yd", () => {
    expect(new Distance(1, "yd").value).toBeCloseTo(0.9144);
  });
});

describe("speed", () => {
  it("extends Quantity", () => {
    expect(Speed.prototype).toBeInstanceOf(Quantity);
  });
  it("consume m/s", () => {
    expect(new Speed(1, "m/s").value).toBeCloseTo(1);
    expect(new Speed(1, "m/s").toString()).toBe("1 m/s");
  });
  it("consume km/h", () => {
    expect(new Speed(1, "km/h").value).toBeCloseTo(0.277777);
    expect(new Speed(1, "km/h").toString()).toBe("1 km/h");
  });
  it("consume ft/min", () => {
    expect(new Speed(1, "ft/min").value).toBeCloseTo(0.00508);
    expect(new Speed(1, "ft/min").toString()).toBe("1 ft/min");
  });
  it("consume kt", () => {
    expect(new Speed(1, "kt").value).toBeCloseTo(0.514444);
    expect(new Speed(1, "kt").toString()).toBe("1 kt");
  });
  it("consume mph", () => {
    expect(new Speed(1, "mph").value).toBeCloseTo(0.44704);
    expect(new Speed(1, "mph").toString()).toBe("1 mph");
  });
  it.todo("gives the Mach number");
});
describe("volume", () => {
  it("extends Quantity", () => {
    expect(Volume.prototype).toBeInstanceOf(Quantity);
  });
  it("consume m3", () => {
    expect(new Volume(1, "m3").value).toBeCloseTo(1);
  });
  it("consume L", () => {
    expect(new Volume(1, "L").value).toBeCloseTo(0.0001);
  });
  it("consume gal US", () => {
    expect(new Volume(1, "gal US").value).toBeCloseTo(0.00378541);
  });
  it("consume gal Imp", () => {
    expect(new Volume(1, "gal Imp").value).toBeCloseTo(0.00454609);
  });
});

describe("altitude", () => {
  it("extends Quantity", () => {
    expect(Altitude.prototype).toBeInstanceOf(Quantity);
  });
  it("needs a reference except for FL", () => {
    expect(() => new Altitude(10, "m")).toThrow(
      "third argument 'reference' should be given, got 'undefined'"
    );
    expect(() => new Altitude(10, "FL")).not.toThrow(
      "third argument 'reference' should be given, got 'undefined'"
    );
  });
  it("consume m", () => {
    expect(new Altitude(1, "m", "AMSL").value).toBeCloseTo(1);
    expect(new Altitude(1, "m", "WGS84").toString()).toBe("1 m WGS84");
  });
  it("consume ft", () => {
    expect(new Altitude(1, "ft", "QNH").value).toBeCloseTo(0.3048);
  });
  it("consume FL", () => {
    expect(new Altitude(10, "FL").value).toBeCloseTo(304.8);
    expect(new Altitude(330, "FL").value).toBeCloseTo(10000, -2.1);
    expect(new Altitude(10, "FL").toString()).toBe("FL010");
    expect(new Altitude(10, "FL").as("ft").toString()).toBe("1,000 ft QNE");

    expect(new Altitude(10000, "m", "QNE").as("FL").toString()).toBe("FL330");
  });
  it.todo("convert between references");
  it.todo("gives densityAltitude");
});
