import { Model } from "@/models/Base.js";

export class Quantity extends Model {
  // eslint-disable-next-line no-unused-vars
  constructor(value, _unit, { type, unit, precision, ...properties } = {}) {
    if (arguments[0] instanceof Quantity) return arguments[0];
    else {
      super(properties);

      if (_unit) this.unit = _unit;
      else this._unit = undefined;

      if (value || value === 0) this.value = value;
      else {
        this._value = undefined;
        this.precision = undefined;
      }

      if (precision) this.precision = precision;

      if (unit) this.unit = unit;
    }
  }

  get value() {
    return this.constructor.significantValue(
      this._to(this._value),
      this.precision
    );
  }

  set value(val) {
    let f = Number(val);
    if (Number.isNaN(f)) throw `\`${val}\` could not be coerced to a number`;
    else {
      this._value = this._from(f);
      this.precision = Math.max(3, this.constructor.significantFigures(val));
    }
  }

  get unit() {
    return this._unit || this.constructor.baseUnit;
  }

  set unit(val) {
    if (!this.constructor.units[val]) throw `'${val}' is not an available unit`;
    else this._unit = val;
  }

  get factor() {
    return this.constructor.units[this.unit];
  }

  _from(val, unit = this.unit) {
    return Number(val) / this._factor(unit);
  }

  _to(val, unit = this.unit) {
    return Number(val) * this._factor(unit);
  }

  _factor(unit) {
    if (this.constructor.units[unit]) return this.constructor.units[unit];
    else throw `'${unit}' is not an available unit`;
  }

  to(unit) {
    return this._to(this.value, unit);
  }

  as(unit, precision) {
    return Object.assign(this.constructor.from(this), { unit, precision });
  }

  add(other, props) {
    if (typeof other == "number" || other instanceof this.constructor)
      return new this.constructor(this + other, undefined, {
        precision: Math.min(this.precision, other.precision),
        unit: this._unit,
        ...props
      });
    else throw "operands should be of the same type";
  }

  // FIXME : prod with quantity should not return the type from this nor other.
  prod(other, props) {
    return new this.constructor(this * other, undefined, {
      precision: Math.min(
        this.precision,
        other.precision || this.constructor.significantFigures(other)
      ),
      unit: this._unit,
      ...props
    });
  }

  valueOf() {
    return this._value;
  }

  toString() {
    let sf = Math.max(1, Math.min(this.precision, 21));
    return `${
      isNaN(this.value)
        ? "-"
        : this.value.toLocaleString(undefined, {
            minimumSignificantDigits: sf,
            maximumSignificantDigits: sf
          })
    } ${this.unit}`;
  }

  toJSON() {
    // eslint-disable-next-line no-unused-vars
    let { _value, _unit, ...properties } = this;
    return {
      ...properties,
      value: this.value,
      unit: this.unit,
      type: this.constructor.name
    };
  }

  static significantFigures(n) {
    let s;
    if (n === 0) {
      return 0;
    } else if (typeof n === "number") {
      s = Math.abs(n).toExponential();
    } else if (typeof n === "string" && !Number.isNaN(Number(n))) {
      s = n.replace(/^\+|-/, "").replace(/^0+/, "");
    } else return;

    s = s.replace(".", "");
    const i = s.lastIndexOf("e");
    return i > 0 ? i : s.length;
  }

  static significantValue(val, precision = 1) {
    if (val === 0) return 0;
    const fact = Math.pow(
      10,
      precision - Math.floor(Math.log(val < 0 ? -val : val) / Math.LN10) - 1
    );
    return Math.round(val * fact) / fact;
  }

  static get units() {
    throw "list of available units should be set on constructor.";
  }

  static get baseUnit() {
    return Object.keys(this.units)[Object.values(this.units).indexOf(1)];
  }

  static from({ type, value, unit, ...properties } = {}) {
    if (!type || this.name == type) return new this(value, unit, properties);
  }
}

export class Distance extends Quantity {
  static get units() {
    return {
      m: 1,
      Km: 0.001,
      ft: 3.28084,
      NM: 0.000539957,
      mi: 0.000621371,
      yd: 1.09361
    };
  }
}

export class Altitude extends Distance {
  constructor(value, unit, { reference, ...properties } = {}) {
    if (unit == "FL") reference = "QNE";
    else if (unit && !reference)
      throw `property 'reference' should be given, got '${reference}'`;

    super(value, unit, { ...properties, reference });
  }

  // densityAltitude(temp) {
  //   return new this.constructor(
  //     this.value + 36.576 * (temp - 15),
  //     "m",
  //     "MSL"
  //   );
  // }

  get value() {
    if (this.unit == "FL")
      return this.constructor.significantValue(this._to(this._value), 2);
    else return this._to(this._value);
  }

  set value(val) {
    super.value = val;
  }

  toString() {
    if (this.unit == "FL") {
      return `FL${String(this.value).padStart(3, "0")}`;
    } else if (this.value && this.reference) {
      return `${super.toString()} ${this.reference}`;
    }
  }

  static get references() {
    return ["MSL", "AGL", "QNH", "QNE", "QFE", "WGS84"];
  }

  static get units() {
    return {
      m: 1,
      ft: 3.28084,
      FL: 0.0328084
    };
  }
}

export class Speed extends Quantity {
  static get units() {
    return {
      "m/s": 1,
      "km/h": 3.6,
      "ft/min": 196.85,
      kt: 1.94384,
      mph: 2.23694
    };
  }

  // TAS(altitude, temperature) {}
}

export class Volume extends Quantity {
  static get units() {
    return {
      m3: 1,
      L: 1000,
      "gal US": 264.172,
      "gal Imp": 219.969
    };
  }
}

export class Consumption extends Volume {
  static get references() {
    return ["h", "1000ft", "u"];
  }

  toString(precision) {
    return `${super.toString(precision)}/${this.reference}`;
  }
}

export class Weight extends Quantity {
  static get units() {
    return {
      kg: 1,
      lb: 2.20462,
      t: 0.001,
      "L-avgas": 1 / 0.721,
      "L-JetA1": 1 / 0.8
    };
  }
}

export class Angle extends Quantity {
  static get units() {
    return {
      rad: 1,
      "°": 180 / Math.PI,
      gon: 200 / Math.PI,
      rev: 1 / 2 / Math.PI,
      "₥": 6400 / 2 / Math.PI
    };
  }
}

export class Azimuth extends Angle {
  get value() {
    //FIXME: 0 should give 360
    return this._to((this._value + 2 * Math.PI) % (2 * Math.PI));
  }

  set value(val) {
    super.value = val;
  }
}

export class Bearing extends Angle {
  get value() {
    //FIXME: 180 % should give 180
    return this._to(((this._value + 3 * Math.PI) % (2 * Math.PI)) - Math.PI);
  }

  set value(val) {
    super.value = val;
  }
}

export class Pressure extends Quantity {
  static get units() {
    return {
      Pa: 1,
      hPa: 0.01,
      Psi: 1 / 6894.76,
      atm: 1 / 101325,
      bar: 0.00001,
      inHg: 1 / 3386.389
    };
  }
}

// TODO Spec it !
export class Temperature extends Quantity {
  static get units() {
    return {
      "°C": [1, 0],
      K: [1, 273.15],
      "°F": [9 / 5.32]
    };
  }

  _from(val, unit = this.unit) {
    return Number(val) / this._factor(unit)[0] + this._factor(unit)[1];
  }

  _to(val, unit = this.unit) {
    return (Number(val) - this._factor(unit)[1]) * this._factor(unit)[0];
  }
}
export class Frequency extends Quantity {
  static get units() {
    return {
      Hz: 1,
      KHz: 0.001,
      MHz: 0.00001,
      GHz: 0.00000001
    };
  }
}
