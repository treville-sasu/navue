export class Model {
  // eslint-disable-next-line no-unused-vars
  constructor({ type, ...properties } = {}) {
    Object.assign(this, properties);
  }

  toJSON() {
    return {
      ...this,
      type: this.constructor.name
    };
  }

  // TODO write specs
  clone() {
    return this.constructor.from(JSON.parse(JSON.stringify(this)));
  }

  static from({ type, ...properties } = {}) {
    if (arguments[0] instanceof this) return arguments[0];
    else if (type == this.name) return new this(properties);
    else throw `Invalid data : 'type' should be '${this.name}' got '${type}'`;
  }
}

// TODO : implementation for when Vuejs Suppots Array-like objects.
// export class Store extends Array {
export class Store {
  constructor(properties = {}, ...items) {
    this.items = items;
    Object.assign(this, properties);
  }

  // get items() {
  //   return [...this];
  // }

  [Symbol.iterator]() {
    return this.items[Symbol.iterator]();
  }

  get length() {
    return this.items.length;
  }

  valueOf() {
    return this.items;
  }

  get properties() {
    // eslint-disable-next-line no-unused-vars
    let { items, ...props } = { ...this };
    return props;
    // return Object.fromEntries(
    //   Object.entries(this).filter(([key]) => isNaN(key))
    // );
  }

  get first() {
    return this.items[0];
  }

  get last() {
    return this.items[this.length - 1];
  }

  add(item, index) {
    index ? this.items.splice(index, 0, item) : this.items.push(item);
    return this.length;
  }

  remove(item, index) {
    if (index === undefined) index = this.items.indexOf(item);
    return index >= 0 ? this.items.splice(index, 1).length == 1 : false;
  }

  keep(filter) {
    let i = this.items.length;
    while (i--) {
      let result = filter.call(this.items, this.items[i]);

      if (result == undefined) this.items.splice(i, 1);
      else if (!Object.is(result, this.items[i]))
        this.items.splice(i, 1, result);
    }
    return this;
  }

  toJSON() {
    return {
      ...this.properties,
      items: this.items,
      type: this.constructor.name
    };
  }

  static from({ type, items = [], ...properties }, ...constructors) {
    if (type != this.name)
      throw `Invalid data : 'type' should be '${this.name}' got '${type}'`;
    else {
      let constructor = constructors.shift();
      return new this(
        properties,
        ...items.map(i => {
          return constructor ? constructor.from(i, ...constructors) : i;
        })
      );
    }
  }
}
