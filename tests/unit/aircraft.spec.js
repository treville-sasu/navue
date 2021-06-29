import { Aircraft } from "@/models/Aircraft";
import { Model, Store } from "@/models/Base";
import { Consumption, Distance, Speed } from "@/models/Quantities";
import { Moment } from "@/models/Moment";

describe("aircraft", () => {
  it("extends Model", () => {
    expect(Aircraft.prototype).toBeInstanceOf(Model);
  });
  it("create with defaults", () => {
    expect(new Aircraft()).toHaveProperty("registration", undefined);
    expect(new Aircraft()).toHaveProperty("manufacturer", undefined);
    expect(new Aircraft()).toHaveProperty("model", undefined);

    expect(new Aircraft()).toHaveProperty("paces", expect.any(Store));
    expect(new Aircraft()).toHaveProperty(["balance"], expect.any(Store));
    expect(new Aircraft()).toHaveProperty(["balance", "date"], undefined);
    expect(new Aircraft()).toHaveProperty("envelopes", expect.any(Store));
    expect(new Aircraft()).toHaveProperty("consumptions", expect.any(Store));
    expect(new Aircraft()).toHaveProperty("checklists", expect.any(Store));
  });

  it("create with properties & rejects unvalid property", () => {
    const aircraft = new Aircraft({
      registration: "test aircraft",
      model: "model",
      manufacturer: "manufacturer",
      notes: "some text", //not allowed
      paces: new Store(undefined, new Speed(), new Distance()),
      consumptions: new Store(new Consumption(), new Distance()),
      balance: new Store({ date: "any date" }, new Moment()),
      envelopes: new Store(
        undefined,
        new Store({ name: "U" }, 1, 2, 3),
        new Store({ name: "N" }, 4, 5, 6)
      ),
      checklists: new Store()
    });
    expect(aircraft).toHaveProperty("registration", "test aircraft");
    expect(aircraft).toHaveProperty("model", "model");
    expect(aircraft).toHaveProperty("manufacturer", "manufacturer");

    expect(aircraft).not.toHaveProperty("notes", "some text");

    expect(aircraft).toHaveProperty("paces", new Store(undefined, new Speed()));
    expect(aircraft).toHaveProperty(
      "consumptions",
      new Store(new Consumption())
    );
    expect(aircraft).toHaveProperty(
      "balance",
      new Store({ date: "any date" }, new Moment())
    );
    expect(aircraft).toHaveProperty(
      "envelopes",
      new Store(
        undefined,
        new Store({ name: "U" }, 1, 2, 3),
        new Store({ name: "N" }, 4, 5, 6)
      )
    );
    expect(aircraft).toHaveProperty("checklists", expect.any(Store));
  });

  it("create an Aircraft from literal", () => {
    let anyAircraft = new Aircraft();
    expect(Aircraft.from(anyAircraft)).toBe(anyAircraft);

    expect(() => Aircraft.from({})).toThrow(
      "Invalid data : 'type' should be 'Aircraft' got 'undefined'"
    );

    let airLiteral = {
      type: "Aircraft",
      registration: "test aircraft",
      model: "model",
      manufacturer: "manufacturer",
      notes: "some text", //not allowed
      paces: {
        type: "Store",
        items: [
          { type: "Speed", value: undefined, unit: undefined },
          { type: "Distance", value: undefined, unit: undefined }
        ]
      },
      consumptions: {
        type: "Store",
        items: [
          { type: "Consumption", value: undefined, unit: undefined },
          { type: "Distance", value: undefined, unit: undefined }
        ]
      },
      balance: {
        type: "Store",
        date: "any date",
        items: [
          {
            type: "Moment",
            mass: { type: "Weight", value: undefined, unit: undefined },
            lever: { type: "Distance", value: undefined, unit: undefined }
          }
        ]
      },
      envelopes: {
        type: "Store",
        items: [
          {
            name: "U",
            type: "Store",
            items: [
              {
                type: "Moment",
                mass: { type: "Weight", value: undefined, unit: undefined },
                lever: { type: "Distance", value: undefined, unit: undefined }
              },
              {
                type: "Moment",
                mass: { type: "Weight", value: undefined, unit: undefined },
                lever: { type: "Distance", value: undefined, unit: undefined }
              }
            ]
          },
          {
            name: "N",
            type: "Store",
            items: [
              {
                type: "Moment",
                mass: { type: "Weight", value: undefined, unit: undefined },
                lever: { type: "Distance", value: undefined, unit: undefined }
              }
            ]
          }
        ]
      },
      checklists: {
        type: "Store",
        items: [
          { name: "CL1", type: "Store", items: [1, 2, 3] },
          { name: "CL2", type: "Store", items: [4, 5, 6] }
        ]
      }
    };

    expect(Aircraft.from(airLiteral)).toStrictEqual(
      new Aircraft({
        registration: "test aircraft",
        model: "model",
        manufacturer: "manufacturer",
        paces: new Store(undefined, new Speed()),
        consumptions: new Store({}, new Consumption()),
        balance: new Store({ date: "any date" }, new Moment()),
        envelopes: new Store(
          undefined,
          new Store({ name: "U" }, new Moment(), new Moment()),
          new Store({ name: "N" }, new Moment())
        ),
        checklists: new Store(
          undefined,
          new Store({ name: "CL1" }, 1, 2, 3),
          new Store({ name: "CL2" }, 4, 5, 6)
        )
      })
    );
  });
});
