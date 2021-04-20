/* eslint-disable jest/no-hooks */
import { Model, Store } from "@/models/Base.js";

describe("model", () => {
  it("create Model with any properties", () => {
    expect(new Model({ a: 1, b: 2 })).toMatchObject({ a: 1, b: 2 });
  });

  it("import Object in Model with any properties or return Object if already Model", () => {
    expect(Model.from({ type: "Model", a: 1, b: 2 })).toStrictEqual(
      new Model({ a: 1, b: 2 })
    );
    expect(() => Model.from({ a: 1, b: 2 })).toThrow(
      "Supplied object is no Model"
    );

    let model = new Model({ a: 1, b: 2 });
    expect(Model.from(model)).toBe(model);
    expect(Model.from(model)).not.toBe(new Model({ a: 1, b: 2 }));
  });

  it("export Model with any properties & type", () => {
    expect(new Model({ a: 1, b: 2 }).toJSON()).toMatchObject({
      type: "Model",
      a: 1,
      b: 2
    });
  });
});

describe("store", () => {
  describe("as an Array Subclass", () => {
    it("extends Array", () => {
      expect(Store.prototype).toBeInstanceOf(Array);
    });

    it("create a Store with values & properties", () => {
      expect(new Store()).toEqual(expect.arrayContaining([]));
      expect(new Store({ name: "name" })).toEqual(expect.arrayContaining([]));
      expect(new Store({ name: "name" }).name).toEqual("name");
      expect(new Store(undefined, 1, 2, 3)).toEqual(
        expect.arrayContaining([1, 2, 3])
      );
    });

    it("get items from store", () => {
      expect(new Store().items).toEqual([]);
      expect(new Store({ name: "name" }, 1, 2, 3).items).toEqual([1, 2, 3]);
    });

    it("get properties from store", () => {
      expect(new Store().properties).toEqual({});
      expect(new Store({ name: "name" }, 1, 2, 3).properties).toEqual({
        name: "name"
      });
    });

    it("set/get the properties of the store", () => {
      let store = new Store(undefined, 1, 2, 3);
      expect(store.name).toBeUndefined();
      store.name = "name";
      expect(store.name).toEqual("name");
    });

    // it("remove item from store by value", () => {
    //   let store = new Store(undefined, 3, 2, 1);
    //   expect(store.remove(3)).toBe(true);
    //   expect(store.remove(7)).toBe(false);
    //   expect(store).toStrictEqual(new Store(undefined, 2, 1));
    // });

    it("keep Store from wrong items", () => {
      let store = new Store(undefined, true, false, true, true, false, true);

      expect(store.keep(i => (i ? i : undefined))).toStrictEqual(
        new Store(undefined, true, true, true, true)
      );
      expect(store).toStrictEqual(new Store(undefined, true, true, true, true));
    });
    it("keep Store with corrected items", () => {
      let store = new Store(undefined, true, false, true, true, false, true);

      expect(store.keep(i => (i ? 1 : undefined))).toStrictEqual(
        new Store(undefined, 1, 1, 1, 1)
      );
      expect(store).toStrictEqual(new Store(undefined, 1, 1, 1, 1));
    });

    it("export Store with any properties & type", () => {
      expect(new Store({ prop: "value" }, 1, 2, 3).toJSON()).toMatchObject({
        type: "Store",
        prop: "value",
        items: [1, 2, 3]
      });
    });

    it("import a Store from literal", () => {
      let store = Store.from({ type: "Store", prop: "prop", items: [1, 2, 3] });
      expect(store).toEqual(expect.arrayContaining([1, 2, 3]));
      expect(store).toHaveProperty("prop", "prop");
    });

    it("import a Store from literal with builder callback", () => {
      let store = Store.from(
        {
          type: "Store",
          items: [
            { type: "Model", value: 1 },
            { type: "Model", value: 2 },
            { type: "Model", value: 3 }
          ]
        },
        Model
      );

      expect(store).toEqual(
        expect.arrayContaining([
          expect.any(Model),
          expect.any(Model),
          expect.any(Model)
        ])
      );
    });

    it("import a Store from literal with builder callback on two or more levels", () => {
      let store = Store.from(
        {
          type: "Store",
          items: [
            {
              type: "Store",
              items: [{ type: "Model", value: 1 }]
            },
            {
              type: "Store",
              items: [{ type: "Model", value: 2 }]
            }
          ]
        },
        Store,
        Model
      );

      expect(store).toEqual(
        expect.arrayContaining([
          expect.arrayContaining([expect.any(Model)]),
          expect.arrayContaining([expect.any(Model)])
        ])
      );
    });
  });
  describe.only("as an Object with items Array", () => {
    it("extends Array", () => {
      expect(Store.prototype).toBeInstanceOf(Object);
    });

    it("create a Store with values & properties", () => {
      expect(new Store().items).toEqual(expect.arrayContaining([]));
      expect(new Store({ name: "name" }).items).toEqual(
        expect.arrayContaining([])
      );
      expect(new Store({ name: "name" }).name).toEqual("name");
      expect(new Store(undefined, 1, 2, 3).items).toEqual(
        expect.arrayContaining([1, 2, 3])
      );
    });

    it("get items from store", () => {
      expect(new Store().items).toEqual([]);
      expect(new Store({ name: "name" }, 1, 2, 3).items).toEqual([1, 2, 3]);
    });

    it("get length from store items", () => {
      let store = new Store({ name: "name" }, 1, 2, 3);
      expect(store).toHaveLength(store.items.length);
    });

    it("get first and last items", () => {
      let store = new Store(undefined, 3, 2, 1);
      expect(store.first).toBe(3);
      expect(store.last).toBe(1);
    });

    it("get properties from store", () => {
      expect(new Store().properties).toEqual({});
      expect(new Store({ name: "name" }, 1, 2, 3).properties).toEqual({
        name: "name"
      });
    });

    it("set/get the properties of the store", () => {
      let store = new Store(undefined, 1, 2, 3);
      expect(store.name).toBeUndefined();
      store.name = "name";
      expect(store.name).toEqual("name");
    });

    it("add or insert item to store", () => {
      let store = new Store();
      expect(store).toHaveLength(0);
      expect(store.add(3)).toBe(1);
      expect(store.add(7)).toBe(2);
      expect(store.items).toStrictEqual([3, 7]);
      expect(store.add("inserted", 1)).toBe(3);
      expect(store.items).toStrictEqual([3, "inserted", 7]);
    });

    it("remove item from store by value or index", () => {
      let store = new Store(undefined, 3, 2, 1);
      expect(store.remove(3)).toBe(true);
      expect(store.remove(7)).toBe(false);
      expect(store).toStrictEqual(new Store(undefined, 2, 1));
      expect(store.remove(undefined, 4)).toBe(false);
      expect(store.remove(undefined, 1)).toBe(true);
      expect(store).toStrictEqual(new Store(undefined, 2));
      expect(store.remove(undefined, 0)).toBe(true);
      expect(store).toStrictEqual(new Store());
    });

    it("keep Store from wrong items", () => {
      let store = new Store(undefined, true, false, true, true, false, true);

      expect(store.keep(i => (i ? i : undefined))).toStrictEqual(
        new Store(undefined, true, true, true, true)
      );
      expect(store).toStrictEqual(new Store(undefined, true, true, true, true));
    });
    it("keep Store with corrected items", () => {
      let store = new Store(undefined, true, false, true, true, false, true);

      expect(store.keep(i => (i ? 1 : undefined))).toStrictEqual(
        new Store(undefined, 1, 1, 1, 1)
      );
      expect(store).toStrictEqual(new Store(undefined, 1, 1, 1, 1));
    });

    it("export Store with any properties & type", () => {
      expect(new Store({ prop: "value" }, 1, 2, 3).toJSON()).toMatchObject({
        type: "Store",
        prop: "value",
        items: [1, 2, 3]
      });
    });

    it("import a Store from literal", () => {
      let store = Store.from({ type: "Store", prop: "prop", items: [1, 2, 3] });
      expect(store).toHaveProperty("items", [1, 2, 3]);
      expect(store).toHaveProperty("prop", "prop");
    });

    it("import a Store from literal with builder callback", () => {
      let store = Store.from(
        {
          type: "Store",
          items: [
            { type: "Model", value: 1 },
            { type: "Model", value: 2 },
            { type: "Model", value: 3 }
          ]
        },
        Model
      );

      expect(store.items).toEqual(
        expect.arrayContaining([
          expect.any(Model),
          expect.any(Model),
          expect.any(Model)
        ])
      );
    });

    it("import a Store from literal with builder callback on two or more levels", () => {
      let store = Store.from(
        {
          type: "Store",
          items: [
            {
              type: "Store",
              items: [{ type: "Model", value: 1 }]
            },
            {
              type: "Store",
              items: [{ type: "Model", value: 2 }]
            }
          ]
        },
        Store,
        Model
      );

      expect(store.items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ items: [expect.any(Model)] }),
          expect.objectContaining({ items: [expect.any(Model)] })
        ])
      );
    });
  });
});
