import { Model } from "@/models/Base.js";

export class Quantity extends Model {
  constructor(value = 0, unit, properties = {}) {
    if (isNaN(value)) throw `first argument should be a Number got ${value}`;
    else value = Number(value);

    super({ value, unit, ...properties });

    if (unit && !this._factor(unit))
      throw `'${unit}' is not an available units`;
    else if (unit) this.displayValue = value;
  }

  _factor(unit) {
    return this.constructor.units[unit];
  }

  _convertFrom(val, unit) {
    if (this._factor(unit)) return Number(val) / this._factor(unit);
    return this;
  }

  _convertTo(val, unit) {
    if (this._factor(unit)) return val * this._factor(unit);
  }

  get displayValue() {
    return this._convertTo(this.value, this.unit);
  }

  set displayValue(val) {
    this.value = this._convertFrom(val, this.unit);
  }

  as(newUnit) {
    return this.constructor.from({ ...this, unit: newUnit });
  }

  toString(precision = 2) {
    let roundedValue;
    if (precision < 0) {
      const fact = 10 ** precision;
      roundedValue =
        Math.round(
          this._convertTo(this.value, this.unit) * fact + Number.EPSILON
        ) / fact;
    }
    if (
      (roundedValue || this.displayValue || this.displayValue === 0) &&
      this.unit
    )
      // TODO : merge default with method options
      return `${(roundedValue || this.displayValue).toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: Math.max(precision, 0)
      })} ${this.unit}`;
  }

  static get units() {
    throw "list of available units should be set on class.";
  }

  static from(object) {
    return Object.assign(new this(), object);
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
      kg: 1000,
      lb: 0.453592,
      t: 1000
    };
  }
}

export class Altitude extends Distance {
  constructor(value = 0, unit, reference) {
    if (unit == "FL") reference = "QNE";
    else if (unit && !reference)
      throw `third argument 'reference' should be given, got '${reference}'`;

    super(value, unit, { reference });
  }

  // densityAltitude(temp) {
  //   return new this.constructor(
  //     this.value + 36.576 * (temp - 15),
  //     "m",
  //     "MSL"
  //   );
  // }

  toString(precision) {
    if (this.unit == "FL") {
      const value = Math.round(this.displayValue * 0.1 + Number.EPSILON) / 0.1;
      return `FL${value.toString().padStart(3, "0")}`;
    } else if (this.value && this.unit && this.reference) {
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

  static from(object = {}) {
    let imported = new this(object.value, undefined, object.reference);
    imported.unit = object.unit;
    return imported;
  }
}
