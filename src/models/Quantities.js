import { Model } from "@/models/Base.js";

export class Quantity extends Model {
  constructor(value = 0, unit, properties = {}) {
    if (isNaN(value)) throw `first argument should be a Number got ${value}`;
    else value = Number(value);

    super({ value, unit, ...properties });

    if (unit) this.displayValue = value;
  }

  _factor(unit) {
    if (this.constructor.units[unit]) return this.constructor.units[unit];
    else throw `'${unit}' is not an available unit`;
  }

  _convertFrom(val, unit) {
    if (this._factor(unit)) return Number(val) / this._factor(unit);
    return val;
  }

  _convertTo(val, unit) {
    if (this._factor(unit)) return val * this._factor(unit);
  }

  get displayValue() {
    return this._convertTo(this.value, this.displayUnit);
  }

  set displayValue(val) {
    this.value = this._convertFrom(val, this.displayUnit);
  }

  get displayUnit() {
    return this.unit || this.constructor._baseUnit;
  }

  set displayUnit(val) {
    if (this.constructor.units[val]) this.unit = val;
    else throw `'${val}' is not an available unit`;
  }

  to(unit) {
    return this._convertTo(this.value, unit);
  }

  as(unit) {
    return this.constructor.from({ ...this, unit });
  }

  valueOf() {
    return this.value;
  }

  toString(precision = 2) {
    try {
      let roundedValue;
      if (precision < 0) {
        const fact = 10 ** precision;
        roundedValue =
          Math.round(this.displayValue * fact + Number.EPSILON) / fact;
      }
      if (
        (roundedValue || this.displayValue || this.displayValue === 0) &&
        this.displayUnit
      )
        // TODO : merge default with method options
        return `${(roundedValue || this.displayValue).toLocaleString(
          undefined,
          {
            minimumFractionDigits: 0,
            maximumFractionDigits: Math.max(precision, 0)
          }
        )} ${this.displayUnit}`;
      // eslint-disable-next-line no-empty
    } catch {}
  }

  static get units() {
    throw "list of available units should be set on class.";
  }

  static get _baseUnit() {
    return Object.keys(this.units)[Object.values(this.units).indexOf(1)];
  }

  static from({ value, ...properties }) {
    return new this(value, undefined, properties);
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
  constructor(value = 0, unit, reference, properties = {}) {
    if (unit == "FL") reference = "QNE";
    else if (unit && !reference)
      throw `third argument 'reference' should be given, got '${reference}'`;

    super(value, unit, { ...properties, reference });
  }

  // densityAltitude(temp) {
  //   return new this.constructor(
  //     this.value + 36.576 * (temp - 15),
  //     "m",
  //     "MSL"
  //   );
  // }

  toString(precision) {
    if (this.displayUnit == "FL") {
      const value = Math.round(this.displayValue * 0.1 + Number.EPSILON) / 0.1;
      return `FL${value.toString().padStart(3, "0")}`;
    } else if (this.value && this.reference) {
      return `${super.toString(precision)} ${this.reference}`;
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

  static from({ value, reference, ...properties }) {
    return new this(value, undefined, reference, properties);
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
  // Mach() {}
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
  constructor(value = 0, unit, reference) {
    super(value, unit);
    if (unit == "FL") this.reference = "QNE";
    else if (unit && !reference)
      throw `third argument 'reference' should be given, got '${reference}'`;
    else this.reference = reference;
  }
  static get references() {
    return ["h", "1000ft", "each"];
  }

  toString(precision) {
    return `${super.toString(precision)}/${this.reference}`;
  }
}

export class Weight extends Quantity {
  static get units() {
    return {
      kg: 1,
      lb: 0.453592,
      t: 1000
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
  get displayValue() {
    return this._convertTo(
      (this.value + 2 * Math.PI) % (2 * Math.PI),
      this.displayUnit
    );
  }
  set displayValue(val) {
    super.displayValue = val;
  }
}

export class Bearing extends Angle {
  get displayValue() {
    return this._convertTo(
      ((this.value + 3 * Math.PI) % (2 * Math.PI)) - Math.PI,
      this.displayUnit
    );
  }
  set displayValue(val) {
    super.displayValue = val;
  }
}
