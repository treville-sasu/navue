export class Model {
  constructor(object) {
    if (arguments[0] instanceof this.constructor) return arguments[0];
    Object.assign(this, object);
  }
  // FIXME : bad clone !!
  clone() {
    return this.constructor.from(JSON.parse(JSON.stringify(this)));
  }
  static parse(string) {
    return this.from(JSON.parse(string));
  }
  static from(object) {
    return new this(object);
  }
}

export class Collection extends Array {
  first() {
    return this[0];
  }
  last() {
    return this[this.length - 1];
  }
  insert(index, obj) {
    this.splice(index, 0, obj);
    return this[index];
  }
  remove(obj) {
    return this.splice(this.indexOf(obj), 1);
  }
  create() {
    throw `${this.constructor.name}.create() should be defined in Collection definition`;
  }
  append(...args) {
    this.push(this.create(...args));
    return this.last();
  }
  prepend(...args) {
    this.unshift(this.create(...args));
    return this.first();
  }
  before(index, ...args) {
    return this.insert(index, this.create(...args));
  }
  static from(args) {
    return super.from(args, this.prototype.create);
  }
}
