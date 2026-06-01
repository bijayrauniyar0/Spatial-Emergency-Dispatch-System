# Map Component

A flexible, composable map component built on top of MapLibre GL, providing a React-friendly interface for building interactive maps.

## Table of Contents

- [Overview](#overview)
- [Core Components](#core-components)
- [Basic Usage](#basic-usage)
- [Components](#components)
  - [Map](#map-1)
  - [VectorLayer](#vectorlayer)
  - [VectorTileLayer](#vectortilelayer)
  - [TileLayer](#tilelayer)
  - [Popup](#popup)
- [Patterns & Best Practices](#patterns--best-practices)
- [Examples](#examples)
- [Dos and Don'ts](#dos-and-donts)

---

## Overview

The Map component system follows a **composition pattern** where child components automatically receive `map` and `isMapLoaded` props. This allows you to build complex map interfaces by composing simple, focused components.

```tsx
<Map mapOptions={{ center: [lng, lat], zoom: 10 }}>
  <VectorLayer id="points" geojson={data} />
  <Popup layerId="points">
    {(data, actions) => <div>...</div>}
  </Popup>
</Map>
```

---

## Core Components

| Component | Purpose | Props Passed Automatically |
|-----------|---------|---------------------------|
| `Map` | Root container, initializes MapLibre | - |
| `VectorLayer` | GeoJSON data layer | `map`, `isMapLoaded` |
| `VectorTileLayer` | Vector tile layer | `map`, `isMapLoaded` |
| `TileLayer` | Raster tile layer | `map`, `isMapLoaded` |
| `Popup` | Interactive popup | `map`, `isMapLoaded` |

---

## Basic Usage

### Minimal Example

```tsx
import Map, { VectorLayer } from "@/components/common/Map";

export default function MapPage() {
  const geojson = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: { type: "Point", coordinates: [85.324, 27.7172] },
        properties: { name: "Kathmandu" },
      },
    ],
  };

  return (
    <Map mapOptions={{ center: [85.324, 27.7172], zoom: 10 }}>
      <VectorLayer id="cities" geojson={geojson} />
    </Map>
  );
}
```

---

## Components

### Map

The root component that initializes the MapLibre GL map instance.

#### Props

```tsx
interface MapProps {
  mapOptions?: Partial<MapOptions>;  // MapLibre GL options
  enable3D?: boolean;                // Enable 3D terrain
  fullscreen?: boolean;              // Start in fullscreen
  disableRotation?: boolean;         // Disable map rotation
  children?: React.ReactNode;
}
```

#### Example

```tsx
<Map
  mapOptions={{
    center: [85.324, 27.7172],
    zoom: 10,
    minZoom: 5,
    maxZoom: 18,
  }}
  enable3D={true}
  disableRotation={false}
>
  {/* Child components */}
</Map>
```

---

### VectorLayer

Renders GeoJSON data as a map layer.

#### Props

```tsx
interface VectorLayerProps {
  id: string;                        // Unique layer ID (required)
  geojson: FeatureCollection;        // GeoJSON data (required)
  visibleOnMap?: boolean;            // Show/hide layer (default: true)
  zoomToLayer?: boolean;             // Auto-fit bounds (default: false)
  layerOptions?: Partial<LayerSpecification>;  // MapLibre layer style
  onClickFeature?: (e: MapMouseEvent) => void;
  onMouseEnter?: (e: MapMouseEvent) => void;
  onMouseLeave?: (e: MapMouseEvent) => void;
}
```

#### Example

```tsx
<VectorLayer
  id="points"
  geojson={pointsData}
  zoomToLayer
  layerOptions={{
    type: "circle",
    paint: {
      "circle-radius": 8,
      "circle-color": "#3b82f6",
      "circle-stroke-width": 2,
      "circle-stroke-color": "#ffffff",
    },
  }}
/>
```

#### Supported Geometry Types

- `Point` → Use `type: "circle"` or `type: "symbol"`
- `LineString` → Use `type: "line"`
- `Polygon` → Use `type: "fill"`

---

### VectorTileLayer

Renders vector tiles from a tile server.

#### Props

```tsx
interface VectorTileLayerProps {
  id: string;                        // Unique layer ID (required)
  url: string;                       // Tile URL (required)
  sourceLayer?: string;              // Source layer name
  layerType?: LayerSpecification["type"];  // Layer type
  layerOptions?: Partial<LayerSpecification>;
}
```

#### Example

```tsx
<VectorTileLayer
  id="buildings"
  url="https://tiles.example.com/{z}/{x}/{y}.pbf"
  sourceLayer="building"
  layerType="fill"
  layerOptions={{
    paint: {
      "fill-color": "#888888",
      "fill-opacity": 0.7,
    },
  }}
/>
```

---

### TileLayer

Renders raster tiles (imagery, basemaps).

#### Props

```tsx
interface TileLayerProps {
  id: string;                        // Unique layer ID (required)
  url: string;                       // Tile URL (required)
  tileSize?: number;                 // Tile size (default: 256)
  minZoom?: number;
  maxZoom?: number;
  opacity?: number;                  // 0-1 (default: 1)
}
```

#### Example

```tsx
<TileLayer
  id="satellite"
  url="https://tiles.example.com/satellite/{z}/{x}/{y}.png"
  opacity={0.8}
  maxZoom={18}
/>
```

---

### Popup

Headless popup component that manages visibility and passes data to children.

#### Props

```tsx
interface PopupProps {
  layerId: string;                   // Layer to attach popup to (required)
  children: (data: PopupData, actions: PopupActions) => React.ReactNode;
  trigger?: "click" | "hover";       // Interaction type (default: "click")
  closeButton?: boolean;             // Show default close button
  closeOnClick?: boolean;            // Close when clicking outside
  offset?: number | [number, number];
  className?: string;
}

interface PopupData {
  coordinates: [number, number];     // Feature coordinates
  properties: Record<string, any>;   // Feature properties
  layerId: string;                   // Source layer ID
}

interface PopupActions {
  close: () => void;                 // Close the popup
}
```

#### Example: Basic Popup

```tsx
<Popup layerId="cities">
  {(data) => (
    <div className="p-4">
      <h3 className="font-bold">{data.properties.name}</h3>
      <p>Population: {data.properties.population}</p>
    </div>
  )}
</Popup>
```

#### Example: Custom Close Button

```tsx
<Popup layerId="cities" closeButton={false}>
  {(data, actions) => (
    <div className="relative p-4">
      <button
        onClick={actions.close}
        className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
      >
        ✕
      </button>
      <h3 className="font-bold">{data.properties.name}</h3>
    </div>
  )}
</Popup>
```

#### Example: Hover Tooltip

```tsx
<Popup layerId="buildings" trigger="hover">
  {(data) => (
    <div className="rounded bg-gray-900 px-3 py-2 text-white">
      <p className="text-sm">{data.properties.name}</p>
    </div>
  )}
</Popup>
```

---

## Patterns & Best Practices

### 1. Layer ID Naming Convention

Use descriptive, kebab-case IDs that indicate the data type:

```tsx
✅ Good
<VectorLayer id="city-points" />
<VectorLayer id="highway-lines" />
<VectorLayer id="national-parks-polygons" />

❌ Bad
<VectorLayer id="layer1" />
<VectorLayer id="data" />
<VectorLayer id="MyLayer" />
```

### 2. Layer Ordering

Layers are rendered in the order they appear. Place background layers first:

```tsx
<Map>
  {/* Background */}
  <TileLayer id="satellite" url="..." />
  
  {/* Mid-level */}
  <VectorLayer id="roads" geojson={roads} />
  
  {/* Top-level */}
  <VectorLayer id="markers" geojson={markers} />
  
  {/* Popups last */}
  <Popup layerId="markers">{...}</Popup>
</Map>
```

### 3. Popup Width Control

The popup width is controlled by the child content. Use Tailwind width utilities:

```tsx
<Popup layerId="cities">
  {(data) => (
    <div className="w-64"> {/* Fixed width */}
      <h3>{data.properties.name}</h3>
    </div>
  )}
</Popup>

<Popup layerId="cities">
  {(data) => (
    <div className="min-w-[200px] max-w-[400px]"> {/* Flexible width */}
      <h3>{data.properties.name}</h3>
    </div>
  )}
</Popup>
```

### 4. Multiple Popups

One popup per layer is recommended. If you need different popups for different features, use conditional rendering:

```tsx
<Popup layerId="locations">
  {(data) => {
    if (data.properties.type === "city") {
      return <CityPopup data={data} />;
    }
    if (data.properties.type === "airport") {
      return <AirportPopup data={data} />;
    }
    return <DefaultPopup data={data} />;
  }}
</Popup>
```

### 5. No Inline Object Creation ⚠️

**NEVER** create inline objects for props. Always extract to constants for reusability and maintainability.

**❌ Anti-Pattern (DON'T DO THIS):**
```tsx
<VectorLayer
  id="cities"
  geojson={CITIES}
  layerOptions={{
    type: "fill",
    paint: {
      "fill-color": "#10b981",
      "fill-opacity": 0.3,
    },
  }}
/>

<Map
  mapOptions={{
    center: [85.324, 27.7172],
    zoom: 10,
  }}
/>
```

**✅ Correct Pattern (DO THIS):**
```tsx
// Extract to constants file (e.g., styles/layer-styles.ts)
const CITY_LAYER_STYLE = {
  type: "circle" as const,
  paint: {
    "circle-radius": 8,
    "circle-color": "#3b82f6",
    "circle-stroke-width": 2,
    "circle-stroke-color": "#ffffff",
  },
};

const DEFAULT_MAP_OPTIONS = {
  center: [85.324, 27.7172],
  zoom: 10,
};

// Use in component
<Map mapOptions={DEFAULT_MAP_OPTIONS}>
  <VectorLayer
    id="cities"
    geojson={CITIES}
    layerOptions={CITY_LAYER_STYLE}
  />
</Map>
```

**Why?**
- **Reusability** - Use the same style across multiple components
- **Maintainability** - Update in one place
- **Readability** - Component code stays clean
- **Testing** - Easier to test styles independently
- **Performance** - Avoid creating new objects on each render

### 6. Conditional Layer Visibility

```tsx
const [showCities, setShowCities] = useState(true);

<VectorLayer
  id="cities"
  geojson={citiesData}
  visibleOnMap={showCities}
/>
```

---

## Examples

### Example 1: Points with Click Popup

```tsx
import Map, { VectorLayer, Popup } from "@/components/common/Map";

const CITIES = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [85.324, 27.7172] },
      properties: { name: "Kathmandu", population: "1.4M" },
    },
  ],
};

export default function CityMap() {
  return (
    <Map mapOptions={{ center: [85.324, 27.7172], zoom: 7 }}>
      <VectorLayer
        id="cities"
        geojson={CITIES}
        zoomToLayer
        layerOptions={{
          type: "circle",
          paint: {
            "circle-radius": 10,
            "circle-color": "#ef4444",
          },
        }}
      />
      
      <Popup layerId="cities">
        {(data) => (
          <div className="w-48 p-3">
            <h3 className="font-bold">{data.properties.name}</h3>
            <p className="text-sm text-gray-600">
              Population: {data.properties.population}
            </p>
          </div>
        )}
      </Popup>
    </Map>
  );
}
```

### Example 2: Lines with Hover Tooltip

```tsx
const HIGHWAYS = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [85.324, 27.7172],
          [84.4168, 27.6833],
        ],
      },
      properties: { name: "Prithvi Highway", length: "182 km" },
    },
  ],
};

export default function HighwayMap() {
  return (
    <Map mapOptions={{ center: [84.9, 27.7], zoom: 8 }}>
      <VectorLayer
        id="highways"
        geojson={HIGHWAYS}
        layerOptions={{
          type: "line",
          paint: {
            "line-color": "#3b82f6",
            "line-width": 3,
          },
        }}
      />
      
      <Popup layerId="highways" trigger="hover">
        {(data) => (
          <div className="rounded bg-gray-900 px-3 py-2 text-white">
            <p className="text-sm font-medium">{data.properties.name}</p>
            <p className="text-xs text-gray-300">{data.properties.length}</p>
          </div>
        )}
      </Popup>
    </Map>
  );
}
```

### Example 3: Polygons with Custom Close Button

```tsx
const PARKS = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [84.3, 28.4],
            [84.6, 28.4],
            [84.6, 28.7],
            [84.3, 28.7],
            [84.3, 28.4],
          ],
        ],
      },
      properties: {
        name: "Annapurna Conservation Area",
        area: "7,629 km²",
      },
    },
  ],
};

export default function ParksMap() {
  return (
    <Map mapOptions={{ center: [84.45, 28.55], zoom: 9 }}>
      <VectorLayer
        id="parks"
        geojson={PARKS}
        layerOptions={{
          type: "fill",
          paint: {
            "fill-color": "#10b981",
            "fill-opacity": 0.3,
          },
        }}
      />
      
      <Popup layerId="parks" closeButton={false}>
        {(data, actions) => (
          <div className="relative w-72 rounded-lg bg-white p-4 shadow-xl">
            <button
              onClick={actions.close}
              className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
            <h3 className="text-lg font-bold text-green-700">
              {data.properties.name}
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Area: {data.properties.area}
            </p>
          </div>
        )}
      </Popup>
    </Map>
  );
}
```

### Example 4: Multiple Layers with Layer Toggle

```tsx
// Extract styles to constants
const CITY_LAYER_STYLE = {
  type: "circle" as const,
  paint: { "circle-radius": 8, "circle-color": "#ef4444" },
};

const HIGHWAY_LAYER_STYLE = {
  type: "line" as const,
  paint: { "line-color": "#3b82f6", "line-width": 3 },
};

const MAP_OPTIONS = {
  center: [85.324, 27.7172] as [number, number],
  zoom: 7,
};

export default function MultiLayerMap() {
  const [showCities, setShowCities] = useState(true);
  const [showHighways, setShowHighways] = useState(true);

  return (
    <div className="relative h-screen">
      <Map mapOptions={MAP_OPTIONS}>
        <VectorLayer
          id="cities"
          geojson={CITIES}
          visibleOnMap={showCities}
          layerOptions={CITY_LAYER_STYLE}
        />
        
        <VectorLayer
          id="highways"
          geojson={HIGHWAYS}
          visibleOnMap={showHighways}
          layerOptions={HIGHWAY_LAYER_STYLE}
        />
        
        <Popup layerId="cities">
          {(data) => (
            <div className="p-3">
              <h3>{data.properties.name}</h3>
            </div>
          )}
        </Popup>
      </Map>
      
      {/* Layer controls */}
      <div className="absolute right-4 top-4 rounded bg-white p-3 shadow">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showCities}
            onChange={(e) => setShowCities(e.target.checked)}
          />
          Cities
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showHighways}
            onChange={(e) => setShowHighways(e.target.checked)}
          />
          Highways
        </label>
      </div>
    </div>
  );
}
```

---

## Dos and Don'ts

### ✅ DO

- **Use unique layer IDs** - Each layer must have a unique `id` prop
- **Control popup width via children** - Use Tailwind classes like `w-64`
- **Place popups after their layers** - Ensures proper rendering order
- **Use `zoomToLayer`** for initial view - Automatically fits bounds
- **Handle loading states** - Components check `isMapLoaded` internally
- **Use the `trigger` prop** - Choose `"click"` or `"hover"` for popups
- **Export layer styles as constants** - Makes them reusable
- **Use TypeScript** - All components are fully typed

### ❌ DON'T

- **Don't create inline objects** - Always extract to constants (see Pattern #5)
- **Don't use duplicate layer IDs** - Will cause conflicts
- **Don't access `map` instance directly** - Use props passed to children
- **Don't set `maxWidth` on popups** - Width is controlled by child content
- **Don't render map outside viewport** - Must have defined height
- **Don't mutate GeoJSON** - Create new objects for updates
- **Don't forget to clean up listeners** - Components handle this automatically
- **Don't nest maps** - One map instance per page

### Common Mistakes

```tsx
❌ Missing layer ID
<VectorLayer geojson={data} />

✅ Correct
<VectorLayer id="my-layer" geojson={data} />
```

```tsx
❌ Direct map access
const map = useMapLibreGLMap();
map.addLayer(...);

✅ Use VectorLayer component
<VectorLayer id="..." geojson={...} />
```

```tsx
❌ Setting popup maxWidth
<Popup maxWidth="400px" />

✅ Control width via children
<Popup layerId="...">
  {(data) => <div className="w-96">...</div>}
</Popup>
```

```tsx
❌ No height on map container
<div>
  <Map>...</Map>
</div>

✅ Define height
<div className="h-screen">
  <Map>...</Map>
</div>
```

```tsx
❌ Inline object creation
<VectorLayer
  layerOptions={{
    type: "circle",
    paint: { "circle-radius": 8 },
  }}
/>

✅ Extract to constant
const LAYER_STYLE = {
  type: "circle" as const,
  paint: { "circle-radius": 8 },
};
<VectorLayer layerOptions={LAYER_STYLE} />
```

---

## Performance Tips

1. **Memoize GeoJSON data** - Prevents unnecessary re-renders
   ```tsx
   const data = useMemo(() => generateGeoJSON(), []);
   ```

2. **Use `visibleOnMap` for toggling** - More efficient than conditional rendering
   ```tsx
   <VectorLayer visibleOnMap={show} />  // ✅ Good
   {show && <VectorLayer />}            // ❌ Recreates layer
   ```

3. **Limit popup content complexity** - Rendered as HTML string
4. **Use vector tiles for large datasets** - More efficient than GeoJSON

---

## TypeScript Support

All components are fully typed. Import types as needed:

```tsx
import type {
  PopupData,
  PopupActions,
  IVectorLayerProps,
  MapInstanceType,
} from "@/components/common/Map";
```

---

## Need Help?

- Check the [MapLibre GL JS documentation](https://maplibre.org/maplibre-gl-js/docs/)
- Review examples in `src/app/(main)/map/page.tsx`
- Refer to type definitions in `types.ts`
