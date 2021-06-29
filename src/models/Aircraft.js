import { Model, Store } from "@/models/Base.js";
import { Speed, Consumption } from "@/models/Quantities.js";
import { Moment } from "@/models/Moment.js";

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
    balance.keep(i => (i instanceof Moment ? i : undefined));
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
      if (balance) balance = Store.from(balance, Moment);
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
