import { Flight } from "@/models/Flight";
import { Branch, Journey } from "@/models/Journey";
import { Location } from "@/models/Location";

describe("flight", () => {
  let emptyflight, flight;
  beforeEach(() => {
    emptyflight = new Flight({
      name: "test flight",
      notes: "model",
      manufacturer: "not allowed",
      checked: [1, 2],
      milestones: ["a", "b"]
    });
    flight = new Flight(
      {
        name: "test flight"
      },
      new Branch(
        Location,
        {},
        new Location([-1, 0, 0], { timestamp: 1000 }),
        new Location([0, 1, 1], { timestamp: 2000 })
      ),
      new Branch(
        Location,
        {},
        new Location([0, -1, 1], { timestamp: 4000 }),
        new Location([1, 1, 0], { timestamp: 6000 })
      )
    );
  });

  it("extends Journey", () => {
    expect(Flight.prototype).toBeInstanceOf(Journey);
  });

  it("is instantiated", () => {
    expect(new Flight()).toHaveProperty("properties.name", undefined);
    expect(new Flight()).toHaveProperty("properties.notes", undefined);
    expect(new Flight()).toHaveProperty(
      "properties.checked",
      expect.any(Array)
    );
    expect(new Flight()).toHaveProperty(
      "properties.milestones",
      expect.any(Array)
    );

    expect(new Flight()).toHaveProperty("branches", expect.any(Array));

    expect(emptyflight).toHaveProperty("properties.name", "test flight");
    expect(emptyflight).toHaveProperty("properties.notes", "model");
    expect(emptyflight).toHaveProperty("properties.checked", [1, 2]);
    expect(emptyflight).toHaveProperty("properties.milestones", ["a", "b"]);
    expect(emptyflight).not.toHaveProperty("properties.manufacturer");

    expect(flight).toHaveProperty(
      "branches",
      expect.arrayContaining([expect.any(Branch), expect.any(Branch)])
    );
  });

  it.todo("test for call to super, in constructor");

  it("add a branch with locations and properties after last one", () => {
    expect(
      emptyflight.addBranch([new Location([0, 0]), new Location([1, 1])], {
        a: 1
      })
    ).toBe(emptyflight);
    expect(emptyflight.branches).toHaveLength(1);
    expect(emptyflight).toHaveProperty(
      "branches",
      expect.arrayContaining([expect.any(Branch)])
    );
  });

  it("return the cumulated duration of traces", () => {
    expect(flight.duration).toEqual(3);
  });
});
