import { Journey, Branch } from "@/models/Journey";
import { Location } from "@/models/Location";

export class Flight extends Journey {
  constructor(
    { name, notes, checked = [], milestones = [] } = {},
    ...locations
  ) {
    let branches = locations;
    super({ name, notes, checked, milestones }, ...branches);
  }

  addBranch(locations, properties) {
    this.branches.push(new Branch(Location, properties, ...locations));
    return this;
  }

  get duration() {
    return (
      this.branches.reduce((total, b) => {
        return (total +=
          b.last().properties.timestamp - b.first().properties.timestamp);
      }, 0) / 1000
    );
  }

  // toGeoJSON(type) {
  //   switch (type) {
  //     case "Feature":
  //     case "LineString":
  //       return featureCollection(
  //         this.branches.flatMap(b => b.toGeoJSON("LineString"), {
  //           bbox: this.bbox
  //         })
  //       );
  //     case "MultiLineString":
  //       return featureCollection(
  //         this.branches.flatMap(b => b.toGeoJSON("MultiLineString").features, {
  //           bbox: this.bbox
  //         })
  //       );
  //     case "FeatureCollection":
  //     default:
  //       return featureCollection(
  //         this.branches.flatMap(b => b.toGeoJSON("FeatureCollection").features),
  //         { bbox: this.bbox }
  //       );
  //   }
  // }
}
