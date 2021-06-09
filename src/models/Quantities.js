import { Model } from "@/models/Base.js";

export class Quantity extends Model {
  // eslint-disable-next-line no-unused-vars
  constructor(value, unit, { type, _precision, ...properties } = {}) {
    super(properties);

    if (unit) this.unit = unit;
    else this._unit = undefined;
    if (value || value === 0) this.value = value;
    else this._value = undefined;
    if (_precision) this.precision = _precision;
  }

  get value() {
    return this.constructor.significantValue(
      this._to(this._value),
      this._precision
    );
  }

  set value(val) {
    if (isNaN(val)) throw `${val} is not a number`;
    else {
      this._value = this._from(val);
      this.precision = this.constructor.getSignificativeDigits(val);
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

  get precision() {
    return this._precision;
  }

  set precision(val) {
    this._precision = Math.max(1, Math.min(21, parseInt(val)));
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

  as(_unit, _precision) {
    return Object.assign(this.constructor.from(this), { _unit, _precision });
  }

  valueOf() {
    return this._value;
  }

  toString() {
    return `${
      isNaN(this.value)
        ? "-"
        : this.value.toLocaleString(undefined, {
            minimumSignificantDigits: this.precision,
            maximumSignificantDigits: this.precision
          })
    } ${this.unit}`;
  }

  toJSON() {
    // eslint-disable-next-line no-unused-vars
    let { _value, _unit, _precision, ...properties } = this;
    return {
      ...properties,
      value: this.value,
      unit: this.unit,
      type: this.constructor.name
    };
  }

  static getSignificativeDigits(val) {
    // https://replit.com/@caub/significant-digits
    let x = Math.abs(val);
    if (x === 0) return 0;
    let p = Math.floor(Math.log10(x)) + 1;
    if (p > 0) x = x / 10 ** p;
    else if (p < 0) x = x * 10 ** -p;
    x = Math.round(x * 1e16) / 1e16; // remove floating points errors
    return String(x).length - 2;
  }

  static significantValue(val, precision = 1) {
    if (val === 0) return 0;
    const fact = Math.pow(
      10,
      precision - Math.floor(Math.log(val < 0 ? -val : val) / Math.LN10) - 1
    );
    return Math.round(val * fact) / fact;
  }

  // static getFractionDigits(val) {
  //   // from https://stackoverflow.com/questions/9539513/is-there-a-reliable-way-in-javascript-to-obtain-the-number-of-decimal-places-of
  //   let m;
  //   if (
  //     (m = Number(val)
  //       .toExponential()
  //       .match(/(?:\.(\d+))?(?:e([+-]?\d+))?$/))
  //   ) {
  //     return Math.max(0, (m[1] || "").length - m[2]);
  //   } else return 0;
  // }

  // static roundValue(val, precision = 0) {
  //   const fact = 10 ** precision;
  //   return Math.round(val * fact + Number.EPSILON) / fact;
  // }

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
      "L-avgas": 0.7,
      "L-JetA1": 0.8
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
      hPa: 100,
      Psi: 6894.76,
      atm: 101325,
      bar: 100000,
      mmHg: 101325 / 760 // ~133.322
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
      KHz: 1000,
      MHz: 100000,
      GHz: 100000000
    };
  }
}

export class Moment extends Model {
  constructor(mass, lever, properties = {}) {
    if (!mass) mass = new Weight();
    if (!lever) lever = new Distance();

    super({ mass, lever, ...properties });
  }

  get value() {
    return this.mass.value * this.lever.value;
  }

  get _value() {
    return this.mass * this.lever;
  }

  valueOf() {
    return this._value;
  }

  toJSON() {
    return {
      ...this,
      type: this.constructor.name
    };
  }
  toCoords() {
    return {
      x: this.lever.value,
      y: this.mass.value
    };
  }

  static from({ type, mass, lever, ...properties } = {}) {
    if (arguments[0] instanceof this) return arguments[0];
    else if (type == this.name) {
      if (mass) mass = Weight.from(mass);
      if (lever) lever = Distance.from(lever);
      return new this(mass, lever, properties);
    } else throw `Invalid data : 'type' should be '${this.name}' got '${type}'`;
  }
}
