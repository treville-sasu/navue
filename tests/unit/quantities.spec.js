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
  it("extends Quantity", () => {
    expect(Quantity.prototype).toBeInstanceOf(Model);
  });

  // it("returns getFractionDigits of any number", () => {
  //   expect(Quantity.getFractionDigits(-1)).toBe(0);
  //   expect(Quantity.getFractionDigits(10)).toBe(0);
  //   expect(Quantity.getFractionDigits(10.1)).toBe(1);
  //   expect(Quantity.getFractionDigits(10.01)).toBe(2);
  //   expect(Quantity.getFractionDigits(10.0000001)).toBe(7);
  //   expect(Quantity.getFractionDigits(0.000000000000000000000001)).toBe(24);
  //   expect(Quantity.getFractionDigits(Number.MIN_VALUE)).toBe(324);
  //   expect(Quantity.getFractionDigits(Number.EPSILON)).toBe(31);
  //   expect(Quantity.getFractionDigits(Number.MAX_VALUE)).toBe(0);
  // });

  it("returns getSignificativeDigits of any number", () => {
    expect(Quantity.getSignificativeDigits(-1)).toBe(1);
    expect(Quantity.getSignificativeDigits(10)).toBe(1);
    expect(Quantity.getSignificativeDigits(10.1)).toBe(3);
    expect(Quantity.getSignificativeDigits(10.01)).toBe(4);
    expect(Quantity.getSignificativeDigits(10.0000001)).toBe(9);
    expect(Quantity.getSignificativeDigits(0.000000000000000000000001)).toBe(1);
  });

  // it("returns rounded value with precision", () => {
  //   expect(Quantity.roundValue(1111.11)).toBe(1111);
  //   expect(Quantity.roundValue(1111.11, 0)).toBe(1111);
  //   expect(Quantity.roundValue(1111.11, -2)).toBe(1100);
  //   expect(Quantity.roundValue(1111.15, 1)).toBe(1111.2);
  //   expect(Quantity.roundValue(10.0000001, 2)).toBe(10);
  //   expect(Quantity.roundValue(0.000000000000000000000001)).toBe(0);
  // });

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

  it("create an undefined Quantity", () => {
    expect(new Quantity()).toMatchObject({
      _value: undefined,
      _unit: undefined
    });
  });

  it("throw an exception if `value` is not a Number", () => {
    expect(() => new Quantity("1qsdqsd2")).toThrow("1qsdqsd2 is not a number");
  });

  it("set `properties` as third argument", () => {
    expect(new Quantity(null, null, { accuracy: 1 }).accuracy).toBe(1);
  });

  describe("without `units` set", () => {
    it("throw an exception if `units` is not set", () => {
      expect(() => Quantity.units).toThrow(
        "list of available units should be set on constructor."
      );
    });
    it("set value & unit", () => {
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

    it("returns the baseUnit (SI)", () => {
      expect(WithUnits.baseUnit).toBe("m");
    });

    it("creates a Quantity with value & optional unit", () => {
      expect(new WithUnits(10)).toMatchObject({
        _value: 10,
        _unit: undefined,
        _precision: 1
      });
      expect(() => new WithUnits(10, "not listed")).toThrow(
        "'not listed' is not an available unit"
      );
      expect(new WithUnits(10, "mm")).toMatchObject({
        _value: 0.01,
        _unit: "mm",
        _precision: 1
      });
      expect(new WithUnits(1000, "mm")).toMatchObject({
        _value: 1,
        _unit: "mm",
        _precision: 1
      });
    });

    it("returns value & unit properties", () => {
      let w = new WithUnits(10);
      expect(w.value).toBe(10);
      expect(w.unit).toBe("m");
      expect(w.factor).toBe(1);
      expect(w.precision).toBe(1);

      let wmm = new WithUnits(10.1, "mm");
      expect(wmm.value).toBe(10.1);
      expect(wmm.unit).toBe("mm");
      expect(wmm.factor).toBe(1000);
      expect(wmm.precision).toBe(3);
    });

    it("returns value with desired precision", () => {
      let w = new WithUnits(10);
      expect(w.value).toBe(10);
      expect(w.precision).toBe(1);
      w.precision = 2;
      expect(w.value).toBe(10);

      let wmm = new WithUnits(123.123456789);
      expect(wmm.value).toBe(123.123456789);
      expect(wmm.precision).toBe(12);
      wmm.precision = 2;
      expect(wmm.value).toBe(120);
      wmm.precision = 8;
      expect(wmm.value).toBe(123.12346);
    });

    it("coerc to Number", () => {
      let q = new WithUnits(10, "mm");
      expect(q.valueOf()).toBe(q._value);
      expect(Number(q)).toStrictEqual(0.01);
      expect(q + q).toStrictEqual(0.02);
      expect(q + 1).toStrictEqual(1.01);
      expect(q * q).toStrictEqual(0.0001);
    });

    it("toString() coerc to String", () => {
      //TODO check for locale or set one
      expect(new WithUnits().toString()).toBe("- m");
      expect(String(new WithUnits())).toBe("- m");
      expect(String(new WithUnits(0, "m"))).toBe("0 m");
      expect(String(new WithUnits(123, "mm"))).toBe("123 mm");
      expect(String(new WithUnits(123.123456789, "km"))).toBe(
        "123.123456789 km"
      );
      expect(
        String(new WithUnits(123.123456789, "km", { _precision: 6 }))
      ).toBe("123.123 km");
      expect(
        String(new WithUnits(123.123456789, "km", { _precision: 1 }))
      ).toBe("100 km");
      expect(
        String(new WithUnits(123.123456789, "km", { _precision: 2 }))
      ).toBe("120 km");
    });
    it("toJSON() coerc to JSON notation", () => {
      expect(new WithUnits(10, "km", { prop: "prop" }).toJSON()).toStrictEqual({
        value: 10,
        unit: "km",
        prop: "prop",
        type: "Quantity"
      });
    });

    it("creates a new Quantity from Object", () => {
      expect(
        Quantity.from({ value: 1, unit: "km", name: "name" })
      ).toMatchObject({
        _value: 1000,
        _unit: "km",
        name: "name"
      });
      expect(() => Quantity.from({ value: 100, unit: "dam" })).not.toThrow(
        "'not listed' is not an available unit"
      );
    });
    it.todo("method to...");

    it("create a new Quantity from original as`newUnit`", () => {
      expect(new WithUnits(10, "m").as("mm")).toMatchObject({
        value: 10000,
        unit: "mm"
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
