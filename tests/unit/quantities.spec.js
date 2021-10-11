/* eslint-disable jest/no-hooks */

import { Model } from "@/models/Base.js";
import {
  Quantity,
  Distance,
  Speed,
  Volume,
  Altitude,
  Weight,
  Consumption,
  Angle,
  Azimuth,
  Bearing
} from "@/models/Quantities.js";

describe("quantity", () => {
  class QuantityWithUnits extends Quantity {
    static get units() {
      return { m: 1, mm: 1000, km: 0.001 };
    }
  }

  it("extends Quantity", () => {
    expect(Quantity.prototype).toBeInstanceOf(Model);
  });

  it.each([
    2342342,
    "2000000",
    232.3423,
    "2.323000",
    "00002.323000",
    2.565432e5,
    "2.500000e+5",

    -2342342,
    "-2000000",
    -232.3423,
    "-2.323000",
    "-00002.323000",
    -2.565432e5,
    "-2.500000e+5",

    +2342342,
    "+2000000",
    +232.3423,
    "+2.323000",
    "+00002.323000",
    +2.565432e5,
    "+2.500000e+5"
  ])("significant figures for %#", f => {
    expect(Quantity.significantFigures(f)).toBe(7);
  });

  it("returns significant value with precision", () => {
    expect(Quantity.significantValue(1111.11)).toBe(1000);
    expect(Quantity.significantValue(1111.11, 1)).toBe(1000);
    expect(Quantity.significantValue(1111.11, 4)).toBe(1111);
    expect(Quantity.significantValue(1111.15, 5)).toBe(1111.2);
    expect(Quantity.significantValue(10.0000001, 2)).toBe(10);
    expect(Quantity.significantValue(0.000000000000000000000001, 4)).toBe(
      0.000000000000000000000001
    );
  });

  describe("constructor creates while", () => {
    it("accepts undefined arguments", () => {
      expect(new Quantity()).toMatchObject({
        _value: undefined,
        _unit: undefined,
        precision: undefined
      });
    });

    it("returns given instance", () => {
      let q = new Quantity();
      expect(new Quantity(q)).toBe(q);
    });

    it("throw an exception if `value` is NaN", () => {
      expect(() => new Quantity("1qsdqsd2")).toThrow(
        "`1qsdqsd2` could not be coerced to a number"
      );
      expect(() => new Quantity("1.2")).not.toThrow(
        "`1qsdqsd2` could not be coerced to a number"
      );
    });

    it("allows any property as third argument", () => {
      expect(new Quantity(null, null, { accuracy: 1 }).accuracy).toBe(1);
    });

    describe("when `units` is not set", () => {
      it("throw an exception if `units` is not set", () => {
        expect(() => Quantity.units).toThrow(
          "list of available units should be set on constructor."
        );
      });

      it("cannot set value nor unit", () => {
        expect(() => new Quantity(1)).toThrow(
          "list of available units should be set on constructor."
        );
        expect(() => (new Quantity().value = 1)).toThrow(
          "list of available units should be set on constructor."
        );
        expect(() => new Quantity(undefined, "u")).toThrow(
          "list of available units should be set on constructor."
        );
        expect(() => (new Quantity().unit = "u")).toThrow(
          "list of available units should be set on constructor."
        );
      });

      it("methods cannot work", () => {
        expect(() => new Quantity().factor).toThrow(
          "list of available units should be set on constructor."
        );
        expect(() => new Quantity().to("u")).toThrow(
          "list of available units should be set on constructor."
        );
        expect(() => new Quantity().toString()).toThrow(
          "list of available units should be set on constructor."
        );
        expect(() => new Quantity().toJSON()).toThrow(
          "list of available units should be set on constructor."
        );
      });
    });
    describe("when `units` set", () => {
      it("access `units` on Quantity", () => {
        expect(QuantityWithUnits.units).toMatchObject({
          m: 1,
          mm: 1000,
          km: 0.001
        });
      });

      it("returns the baseUnit (SI)", () => {
        expect(QuantityWithUnits.baseUnit).toBe("m");
      });

      it("creates a Quantity with value as baseUnit", () => {
        expect(new QuantityWithUnits(10)).toMatchObject({
          _value: 10,
          _unit: undefined,
          precision: 1
        });
      });

      it("do not creates a Quantity with wrong unit", () => {
        expect(() => new QuantityWithUnits(10, "not listed")).toThrow(
          "'not listed' is not an available unit"
        );
      });
      it("do creates a Quantity with existing unit", () => {
        expect(new QuantityWithUnits(10, "m")).toMatchObject({
          _value: 10,
          _unit: "m",
          precision: 1
        });
        expect(new QuantityWithUnits("1000", "mm")).toMatchObject({
          _value: 1,
          _unit: "mm",
          precision: 4
        });
      });
    });
  });
  describe("instances", () => {
    it("returns value & unit properties", () => {
      let w = new QuantityWithUnits(10);
      expect(w.value).toBe(10);
      expect(w.unit).toBe("m");
      expect(w.factor).toBe(1);
      expect(w.precision).toBe(1);

      let wmm = new QuantityWithUnits(10.1, "mm");
      expect(wmm.value).toBe(10.1);
      expect(wmm.unit).toBe("mm");
      expect(wmm.precision).toBe(3);
      expect(wmm.factor).toBe(1000);
    });

    it("returns value with desired precision", () => {
      let w = new QuantityWithUnits(10);
      expect(w.precision).toBe(1);
      expect(w.value).toBe(10);
      w.precision = 2;
      expect(w.value).toBe(10);

      let wmm = new QuantityWithUnits(123.123456789);
      expect(wmm.value).toBe(123.123456789);
      expect(wmm.precision).toBe(12);
      wmm.precision = 2;
      expect(wmm.value).toBe(120);
      wmm.precision = 8;
      expect(wmm.value).toBe(123.12346);
    });

    it("adds up two quantities", () => {
      class WithUnitsOtherType extends Quantity {
        static get units() {
          return { l: 1, ml: 1000, hl: 0.001 };
        }
      }
      expect(() => {
        new QuantityWithUnits(1).add(new WithUnitsOtherType("10"));
      }).toThrow("operands should be of the same type");
      expect(
        new QuantityWithUnits("1.0").add(new QuantityWithUnits("10"))
      ).toStrictEqual(new QuantityWithUnits(11));
      expect(
        new QuantityWithUnits(1, "mm").add(new QuantityWithUnits("10"))
      ).toStrictEqual(new QuantityWithUnits(10001, "mm", { precision: 1 }));
      expect(
        new QuantityWithUnits(1).add(new QuantityWithUnits(10), { unit: "mm" })
      ).toStrictEqual(new QuantityWithUnits(11000, "mm", { precision: 1 }));
      expect(new QuantityWithUnits(1, "m").add(10)).toStrictEqual(
        new QuantityWithUnits(11, "m")
      );
    });

    it("prod() multiply by a scalar", () => {
      expect(new QuantityWithUnits(1).prod(2)).toStrictEqual(
        new QuantityWithUnits(2)
      );
      expect(new QuantityWithUnits(1).prod(0)).toStrictEqual(
        new QuantityWithUnits(0)
      );
      expect(new QuantityWithUnits(1, "mm").prod(1 / 10)).toStrictEqual(
        new QuantityWithUnits(0.1, "mm")
      );
      expect(new QuantityWithUnits(2).prod(10, { unit: "mm" })).toStrictEqual(
        new QuantityWithUnits(20000, "mm", { precision: 1 })
      );
    });

    it("coerc to Number", () => {
      let q = new QuantityWithUnits(10, "mm");
      expect(q.valueOf()).toBe(q._value);
      expect(Number(q)).toBe(0.01);
      expect(q + q).toBe(0.02);
      expect(q + 1).toBe(1.01);
      expect(q * q).toBe(0.0001);
    });

    it("toString() coerc to String", () => {
      //TODO check for locale or set one
      expect(new QuantityWithUnits().toString()).toBe("- m");
      expect(String(new QuantityWithUnits())).toBe("- m");
      expect(String(new QuantityWithUnits(0, "m"))).toBe("0 m");
      expect(String(new QuantityWithUnits(123, "mm"))).toBe("123 mm");
      expect(String(new QuantityWithUnits(123.123456789, "km"))).toBe(
        "123.123456789 km"
      );
      expect(
        String(new QuantityWithUnits(123.123456789, "km", { precision: 6 }))
      ).toBe("123.123 km");
      expect(
        String(new QuantityWithUnits(123.123456789, "km", { precision: 1 }))
      ).toBe("100 km");
      expect(
        String(new QuantityWithUnits(123.123456789, "km", { precision: 2 }))
      ).toBe("120 km");
    });
    it("toJSON() coerc to JSON notation", () => {
      expect(
        new QuantityWithUnits(10, "km", { prop: "prop" }).toJSON()
      ).toStrictEqual({
        value: 10,
        unit: "km",
        precision: 1,
        prop: "prop",
        type: "QuantityWithUnits"
      });
    });

    it("creates a new Quantity from Object", () => {
      expect(
        QuantityWithUnits.from({ value: 1, unit: "km", name: "name" })
      ).toMatchObject({
        _value: 1000,
        _unit: "km",
        name: "name"
      });
      expect(() =>
        QuantityWithUnits.from({ value: 100, unit: "dam" })
      ).not.toThrow("'not listed' is not an available unit");
    });

    it("create a new Quantity from original as`newUnit`", () => {
      expect(new QuantityWithUnits(10, "m").as("mm")).toMatchObject({
        _value: 10,
        _unit: "mm"
      });
    });
  });
});
describe("distance", () => {
  it("extends Quantity", () => {
    expect(Distance.prototype).toBeInstanceOf(Quantity);
  });

  it("holds units", () => {
    expect(Distance.units).toMatchObject({
      m: 1,
      Km: 0.001,
      ft: 3.28084,
      NM: 0.000539957,
      mi: 0.000621371,
      yd: 1.09361
    });
  });

  it("holds a base units", () => {
    expect(Distance.baseUnit).toBe("m");
  });

  it("consume m", () => {
    expect(new Distance(1, "m")._value).toBeCloseTo(1);
    expect(new Distance(1, "Km")._value).toBeCloseTo(1000);
    expect(new Distance(1, "ft")._value).toBeCloseTo(0.3048);
    expect(new Distance(1, "NM")._value).toBeCloseTo(1852);
    expect(new Distance(1, "mi")._value).toBeCloseTo(1609.34);
    expect(new Distance(1, "yd")._value).toBeCloseTo(0.9144);
  });
});

describe("speed", () => {
  it("extends Quantity", () => {
    expect(Speed.prototype).toBeInstanceOf(Quantity);
  });

  it("holds units", () => {
    expect(Speed.units).toMatchObject({
      "m/s": 1,
      "km/h": 3.6,
      "ft/min": 196.85,
      kt: 1.94384,
      mph: 2.23694
    });
  });

  it("holds a base units", () => {
    expect(Speed.baseUnit).toBe("m/s");
  });

  it("consume all units", () => {
    expect(new Speed(1, "m/s")._value).toBeCloseTo(1);
    expect(new Speed(1, "km/h")._value).toBeCloseTo(0.277777);
    expect(new Speed(1, "ft/min")._value).toBeCloseTo(0.00508);
    expect(new Speed(1, "kt")._value).toBeCloseTo(0.514444);
    expect(new Speed(1, "mph")._value).toBeCloseTo(0.44704);
  });
});

describe("volume", () => {
  it("extends Quantity", () => {
    expect(Volume.prototype).toBeInstanceOf(Quantity);
  });

  it("holds units", () => {
    expect(Volume.units).toMatchObject({
      m3: 1,
      L: 1000,
      "gal US": 264.172,
      "gal Imp": 219.969
    });
  });

  it("holds a base units", () => {
    expect(Volume.baseUnit).toBe("m3");
  });

  it("consumes all units", () => {
    expect(new Volume(1, "m3")._value).toBeCloseTo(1);
    expect(new Volume(1, "L")._value).toBeCloseTo(0.0001);
    expect(new Volume(1, "gal US")._value).toBeCloseTo(0.00378541);
    expect(new Volume(1, "gal Imp")._value).toBeCloseTo(0.00454609);
  });
});

describe("altitude", () => {
  it("extends Quantity", () => {
    expect(Altitude.prototype).toBeInstanceOf(Quantity);
  });

  it("holds units", () => {
    expect(Altitude.units).toMatchObject({
      m: 1,
      ft: 3.28084,
      FL: 0.0328084
    });
  });

  it("holds a base units", () => {
    expect(Altitude.baseUnit).toBe("m");
  });

  it("holds references", () => {
    expect(Altitude.references).toStrictEqual([
      "MSL",
      "AGL",
      "QNH",
      "QNE",
      "QFE",
      "WGS84"
    ]);
  });

  it("needs a reference except for FL", () => {
    expect(() => new Altitude(10, "m")).toThrow(
      "property 'reference' should be given, got 'undefined'"
    );
    expect(() => new Altitude(10, "FL")).not.toThrow(
      "property 'reference' should be given, got 'undefined'"
    );
  });

  it("consumes all units", () => {
    expect(new Altitude(1, "m", { reference: "AMSL" })._value).toBeCloseTo(1);
    expect(new Altitude(1, "ft", { reference: "QNH" })._value).toBeCloseTo(
      0.3048
    );
    expect(new Altitude(10, "FL")._value).toBeCloseTo(304.8);
    expect(new Altitude(330, "FL")._value).toBeCloseTo(10000, -2.1);
    expect(new Altitude(10, "FL").value).toBeCloseTo(10);
    expect(new Altitude(330, "FL").value).toBeCloseTo(330);
  });
  it("coerc to string with references", () => {
    expect(String(new Altitude(1, "m", { reference: "WGS84" }))).toBe(
      "1 m WGS84"
    );
    expect(String(new Altitude(10, "FL"))).toBe("FL010");
    expect(String(new Altitude(35, "FL"))).toBe("FL035");
    expect(String(new Altitude(110, "FL"))).toBe("FL110");
    expect(String(new Altitude(10, "FL").as("ft"))).toBe("1,000 ft QNE");
    expect(
      String(new Altitude(10000, "m", { reference: "QNE" }).as("FL"))
    ).toBe("FL330");
  });
  it.todo("spec from object");
  it.todo("convert between references");
  it.todo("gives densityAltitude");
});

describe("weight", () => {
  it("extends Quantity", () => {
    expect(Weight.prototype).toBeInstanceOf(Quantity);
  });

  it("holds units", () => {
    expect(Weight.units).toMatchObject({
      kg: 1,
      lb: 2.20462,
      t: 0.001
    });
  });

  it("holds a base units", () => {
    expect(Weight.baseUnit).toBe("kg");
  });

  it("consumes all units", () => {
    expect(new Weight(1, "kg")._value).toBeCloseTo(1);
    expect(new Weight(1, "lb")._value).toBeCloseTo(0.453592);
    expect(new Weight(1, "t")._value).toBeCloseTo(1000);
  });
});

describe("consumption", () => {
  it("extends Volume", () => {
    expect(Consumption.prototype).toBeInstanceOf(Volume);
  });

  it("holds references", () => {
    expect(Consumption.references).toStrictEqual(["h", "1000ft", "u"]);
  });

  it("consumes all units", () => {
    expect(new Consumption(1, "m3")._value).toBeCloseTo(1);
    expect(new Consumption(1, "L")._value).toBeCloseTo(0.001);
    expect(new Consumption(10, "gal US")._value).toBeCloseTo(0.037);
    expect(new Consumption(330, "gal Imp")._value).toBeCloseTo(1.50021);
  });
  it("coerc to string with references", () => {
    expect(String(new Consumption(1, "m3", { reference: "h" }))).toBe("1 m3/h");
    expect(String(new Consumption(10, "L", { reference: "1000ft" }))).toBe(
      "10 L/1000ft"
    );
    expect(String(new Consumption(10, "gal US", { reference: "u" }))).toBe(
      "10 gal US/u"
    );
    expect(String(new Consumption(10, "gal Imp", { reference: "h" }))).toBe(
      "10 gal Imp/h"
    );
  });
});

describe("angle", () => {
  it("extends Quantity", () => {
    expect(Angle.prototype).toBeInstanceOf(Quantity);
  });

  it("holds units", () => {
    expect(Angle.units).toMatchObject({
      rad: 1,
      "°": 180 / Math.PI,
      gon: 200 / Math.PI,
      rev: 1 / 2 / Math.PI,
      "₥": 6400 / 2 / Math.PI
    });
  });

  it("holds a base units", () => {
    expect(Angle.baseUnit).toBe("rad");
  });

  it("consume all units", () => {
    expect(new Angle(Math.PI, "rad")._value).toBeCloseTo(Math.PI);
    expect(new Angle(180, "°")._value).toBeCloseTo(Math.PI);
    expect(new Angle(200, "gon")._value).toBeCloseTo(Math.PI);
    expect(new Angle(0.5, "rev")._value).toBeCloseTo(Math.PI);
    expect(new Angle(3200, "₥")._value).toBeCloseTo(Math.PI);
  });
});

describe("azimuth", () => {
  it("extends Quantity", () => {
    expect(Azimuth.prototype).toBeInstanceOf(Angle);
  });

  it("returns the value modulo a circle", () => {
    expect(new Azimuth(270, "°").value).toBeCloseTo(270);
    expect(new Azimuth(540, "°").value).toBeCloseTo(180);
    expect(new Azimuth(-270, "°").value).toBeCloseTo(90);
    //TODO: 0 should give 360
    expect(new Azimuth(0, "°").value).toBeCloseTo(0);
  });
});

describe("bearing", () => {
  it("extends Quantity", () => {
    expect(Bearing.prototype).toBeInstanceOf(Angle);
  });
  it("return the value modulo a circle", () => {
    expect(new Bearing(270, "°").value).toBeCloseTo(-90);
    //TODO: 180 % should give 180
    expect(new Bearing(180, "°").value).toBeCloseTo(-180);
    expect(new Bearing(540, "°").value).toBeCloseTo(-180);
    expect(new Bearing(90, "°").value).toBeCloseTo(90);
    expect(new Bearing(0, "°").value).toBeCloseTo(0);
  });
});
