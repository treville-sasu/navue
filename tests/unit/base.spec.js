/* eslint-disable jest/no-hooks */
import { Model, Collection } from "@/models/Base.js";

describe("model", () => {
  it("return first argument if it's an instance of Model", () => {
    const argModel = new Model();
    expect(new Model(argModel)).toBe(argModel);
    expect(new Model(argModel)).not.toBe(new Model());
  });
  it("create Model with any properties", () => {
    expect(new Model({ a: 1, b: 2 })).toMatchObject({ a: 1, b: 2 });
  });

  it("parse in Model with any properties", () => {
    expect(Model.parse('{"a":1,"b":2}')).toMatchObject({ a: 1, b: 2 });
  });

  it("import Object in Model with any properties or return Object if already Model", () => {
    expect(Model.from({ a: 1, b: 2 })).toEqual(new Model({ a: 1, b: 2 }));

    let model = new Model({ a: 1, b: 2 });
    expect(Model.from(model)).toBe(model);
    expect(Model.from(model)).not.toBe(new Model({ a: 1, b: 2 }));
  });

  // TODO: code and spec toJSON() if needed...
  it("export Model with any properties", () => {
    expect(JSON.stringify(new Model({ a: 1, b: 2 }))).toMatch('{"a":1,"b":2}');
  });
});

describe("collection", () => {
  it("extends Array", () => {
    expect(Collection.prototype).toBeInstanceOf(Array);
  });

  it("built as an Array", () => {
    expect(new Collection(1, 2, 3, 4)).toEqual([1, 2, 3, 4]);
    expect(new Collection(...[1, 2, 3, 4])).toEqual([1, 2, 3, 4]);
    expect(new Collection([1, 2, 3, 4])).toEqual([[1, 2, 3, 4]]);
  });

  it("returns the first item", () => {
    expect(new Collection(1, 2, 3, 4).first()).toBe(1);
  });

  it("returns the last item", () => {
    expect(new Collection(1, 2, 3, 4).last()).toBe(4);
  });

  it("insert a given item at a given position", () => {
    const collection = new Collection(1, 2, 3, 4);
    expect(collection.insert(3, 99)).toBe(99);
    expect(collection[3]).toBe(99);
  });

  it("remove an item", () => {
    const collection = new Collection(1, 2, 3, 4);
    collection.remove(3);
    expect(collection).toEqual(new Collection(1, 2, 4));
  });

  it("throw an exception if create is not set", () => {
    expect(() => new Collection().create(1)).toThrow(
      "Collection.create() should be defined in Collection definition"
    );
  });

  describe("with create() set to new String", () => {
    let mockCreate;

    beforeEach(() => {
      mockCreate = jest
        .spyOn(Collection.prototype, "create")
        .mockImplementation(x => new String(x));
    });

    afterEach(() => {
      mockCreate.mockRestore();
    });

    it("creates a new item", () => {
      expect(() => new Collection().create(1)).not.toThrow(
        "Collection.create() should be defined in Collection definition"
      );
      expect(new Collection().create(1)).toEqual("1");
    });

    it("append a new item", () => {
      const collection = new Collection(1, 2, 3, 4);
      expect(collection.append(1)).toEqual("1");
      expect(collection.create).toHaveBeenCalledWith(1);
      expect(collection[collection.length - 1]).toEqual("1");
    });

    it("prepend a new item", () => {
      const collection = new Collection(1, 2, 3, 4);
      expect(collection.prepend(1)).toEqual("1");
      expect(collection.create).toHaveBeenCalledWith(1);
      expect(collection[0]).toEqual("1");
    });

    it("add a new item before given index", () => {
      const collection = new Collection(1, 2, 3, 4);
      expect(collection.before(1, 99)).toEqual("99");
      expect(collection.create).toHaveBeenCalledWith(99);
      expect(collection[1]).toEqual("99");
    });
  });

  it("build a Collection from Enumerable", () => {
    class NewCollection extends Collection {
      create(x) {
        return x * x;
      }
    }
    expect(NewCollection.from([1, 2])).toEqual(new NewCollection(1, 4));
  });
  it("build a Collection from nested Enumerables", () => {
    class ParentCollection extends Collection {
      create(x) {
        return ChildCollection.from(x);
      }
    }
    class ChildCollection extends Collection {
      create(x) {
        return x * x;
      }
    }
    expect(
      ParentCollection.from([
        [2, 3],
        [2, 3]
      ])
    ).toStrictEqual(
      new ParentCollection(new ChildCollection(4, 9), new ChildCollection(4, 9))
    );
  });
});
