export class Aircraft {
  constructor() {
    this.type = "aircraft";
    this.registration = undefined;
    this.manufacturer = undefined;
    this.model = undefined;
    this.paces = [];
    this.balance = [];
    this.envelopes = [];
    this.consumptions = [];
    this.checklists = [];
  }
  addPace(name, value, unit) {
    const item = Pace.import({ name, unit, value });
    this.paces.push(item);
    return item;
  }
  // addWeight
  // addConsumption
  static import(object) {
    if (object.type == "aircraft") {
      return Object.assign(new this(), object);
    } else throw "Invalid data";
  }
}
export class Pace {
  constructor() {
    this.name = undefined;
    this.unit = "kt";
    this.value = undefined;
  }
  static import(object) {
    return Object.assign(new this(), object);
  }
}

// TODO:
// class Envelope
// class Checklist
