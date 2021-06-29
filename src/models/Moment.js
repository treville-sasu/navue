import { Model } from "@/models/Base.js";
import { Weight, Distance } from "@/models/Quantities.js";

export class Moment extends Model {
  constructor(mass, lever, properties = {}) {
    super({
      mass: new Weight(mass),
      lever: new Distance(lever),
      ...properties
    });
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

  get unit() {
    return `${this.mass.unit}.${this.lever.unit}`;
  }

  toJSON() {
    return {
      ...this,
      type: this.constructor.name
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

  static linearCoG(...moments) {
    let result = moments.flat().reduce((acc, { mass, lever }) => {
      acc.mass = acc.mass.add(mass);
      acc.lever = acc.lever.add(mass * lever);
      return acc;
    }, new Moment(0, 0));

    result.lever = result.lever.prod(1 / result.mass);
    return result;
  }
}
