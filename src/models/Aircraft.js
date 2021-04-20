import { Model, Store } from "@/models/Base.js";
import { Speed, Consumption, Weight, Distance } from "@/models/Quantities.js";

export class Aircraft extends Model {
  constructor({
    registration,
    manufacturer,
    model,
    paces = new Store(),
    consumptions = new Store(),
    balance = new Store({ date: undefined }),
    envelopes = new Store(),
    checklists = new Store()
  } = {}) {
    paces.keep(i => (i instanceof Speed ? i : undefined));
    consumptions.keep(i => (i instanceof Consumption ? i : undefined));
    balance.keep(i => (i instanceof Weight ? i : undefined));
    envelopes.keep(i => (i instanceof Store ? i : undefined));
    // envelopes = envelopes.keep(i => {
    //   return i.keep(j => (j instanceof Weight ? j : undefined));
    // });
    checklists.keep(i => (i instanceof Store ? i : undefined));

    super({
      registration,
      manufacturer,
      model,
      paces,
      consumptions,
      balance,
      envelopes,
      checklists
    });
  }

  static from({
    _id,
    _rev,
    type,
    registration,
    manufacturer,
    model,
    paces,
    consumptions,
    balance,
    envelopes,
    checklists
  } = {}) {
    if (arguments[0] instanceof this) return arguments[0];
    else if (type != this.name)
      throw `Invalid data : 'type' should be '${this.name}' got '${type}'`;
    else {
      if (paces) paces = Store.from(paces, Speed);
      if (consumptions) consumptions = Store.from(consumptions, Consumption);
      if (balance) balance = Store.from(balance, Weight);
      if (envelopes) envelopes = Store.from(envelopes, Store, Moment);
      if (checklists) checklists = Store.from(checklists, Store);

      let imported = new this({
        registration,
        manufacturer,
        model,
        paces,
        consumptions,
        balance,
        envelopes,
        checklists
      });
      if (_id && _rev) Object.assign(imported, { _id, _rev });

      return imported;
    }
  }
}

export class Moment extends Model {
  constructor(mass, lever, properties) {
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

  get unit() {
    return `${this.mass.unit}.${this.lever.unit}`;
  }

  valueOf() {
    return this._value;
  }

  toJSON() {
    return {
      ...this,
      value: this.value,
      unit: this.unit,
      type: this.constructor.name
    };
  }
  toCoords() {
    return {
      x: this.lever.value,
      y: this.mass.value
    };
  }

  static from({ type, mass, lever } = {}) {
    if (arguments[0] instanceof this) return arguments[0];
    else if (type == this.name) {
      if (mass) mass = Weight.from(mass);
      if (lever) lever = Distance.from(lever);
      return new this(mass, lever, { type });
    } else throw `Supplied object is no ${this.name}`;
  }
}
