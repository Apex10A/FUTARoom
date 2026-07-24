// Minimal ambient declaration for "leaflet" — no official @types package is
// installed (npm registry access is unavailable in this environment). This
// mirrors the shape of @types/leaflet closely enough for our usage: a
// default-exported value plus a same-named type namespace, so both
// `L.map(...)` (value) and `L.Map` (type) resolve without error.
declare module "leaflet" {
  const L: any;
  export = L;
}

declare namespace L {
  type Map = any;
  type Marker = any;
  type LayerGroup = any;
  type LeafletMouseEvent = any;
  type LatLngExpression = any;
  type LatLngTuple = any;
}
