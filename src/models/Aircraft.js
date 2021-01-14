import { Model } from "@/models/Base.js";

export class Aircraft extends Model {
  constructor({
    registration,
    manufacturer,
    model,
    paces = [],
    balance = [],
    envelopes = [],
    consumptions = [],
    checklists = []
  } = {}) {
    super({
      registration,
      manufacturer,
      model,
      paces,
      balance,
      envelopes,
      consumptions,
      checklists
    });
    this.type = "aircraft";
  }

  get gotId() {
    return this._id && this._rev;
  }
  setId(id, rev) {
    this._id = id;
    this._rev = rev;
    return this;
  }

  addPace(name, value, unit) {
    return this.paces.push({ name, unit, value });
  }
  addWeight({ name, arm, value, min, max, density, tank } = { tank: false }) {
    return this.balance.weights.push({
      name,
      arm,
      value,
      min,
      max,
      density,
      tank
    });
  }
  addEnvelope({ name, values } = { values: [] }) {
    return this.envelopes.push({ name, values });
  }
  addEnvelopePoint({ x, y }, envelopesId) {
    return this.envelopes[envelopesId].push({ x, y });
  }
  addConsumption({ name, value, unit, part } = {}) {
    return this.consumptions.push({ name, value, unit, part });
  }
  addChecklist({ name, items } = { items: [] }) {
    return this.checklists.push({ name, items });
  }
  addChecklistItem(
    { name, expect, type, action } = { action: true },
    checklistId
  ) {
    return this.checklists[checklistId].push({
      name,
      expect,
      type,
      action
    });
  }

  static import(object) {
    if (object.type == "aircraft") {
      return new Aircraft(object).setId(object._id, object._rev);
    } else
      throw `Invalid data : 'type' should be 'aircraft' got '${object.type}'`;
  }
}