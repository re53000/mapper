import { Map as MapLibreMap, NavigationControl, StyleSpecification, Marker, Popup } from "maplibre-gl";
import { useEffect, useRef } from "react";
import 'maplibre-gl/dist/maplibre-gl.css';
import './Mapper.css'

const OSM_STYLE: StyleSpecification = {
  "version": 8,
  "sources": {
    "osm": {
      "type": "raster",
      "tiles": ["https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"],
      "tileSize": 256,
      "attribution": "",
    }
  },
  "layers": [
    {
      "id": "osm",
      "type": "raster",
      "source": "osm" // This must match the source key above
    }
  ]
};

// https://stackblitz.com/edit/react-maplibre-map-daapft?file=my-map%2FmyMap.tsx
// https://codepen.io/bothness/pen/ExgwzEG
// https://codesandbox.io/p/sandbox/maplibre-react-typescript-4e104s
export const Mapper = () => {
  const mapContainer = useRef(null);

  const initialState = {
    lng: 11,
    lat: 49,
    zoom: 4,
  };

  useEffect(() => {
    if (!mapContainer.current) {
      return
    }

    const map = new MapLibreMap({
      container: mapContainer.current,
      center: [initialState.lng, initialState.lat],
      zoom: initialState.zoom,
      style: OSM_STYLE,
    });

    const nav = new NavigationControl({
      visualizePitch: true
    });
    map.addControl(nav, "top-left");

    new Marker()
      .setLngLat([11, 49])
      .addTo(map);

    new Marker().setLngLat([2.349902, 48.852966]).addTo(map);


    const el = document.createElement("div");
    el.addEventListener("click", () => {
      window.alert("Eiffel Tower");
    });

    // add marker to map
    new Marker({
      className: "marker",
      element: el,
    })
      .setLngLat([2.294694, 48.858093])
      .addTo(map);


    // https://www.jawg.io/docs/integration/maplibre-gl-js/add-popup/
    // https://maplibre.org/maplibre-gl-js/docs/examples/custom-marker-icons/
    // Basic popup definition
    new Popup({
      closeOnClick: false,
    })
      .setLngLat([-61.572646, 16.273131])
      .setHTML("<b>Hello world!</b><br/> I am a popup.")
      .addTo(map);


    // const marker = new maptilersdk.Marker({
    //   color: "#FFFFFF",
    //   draggable: true
    // }).setLngLat([30.5, 50.5])
    // .addTo(map);

    // // @ts-expect-error for debugging
    // window.map = map;

    // map.on("click", (e) => {
    //   console.log(e);
    //   console.log([e.lngLat.lng, e.lngLat.lat]);
    // });
  }, [mapContainer.current]);

  const onLoad = () => {
    if (mapContainer.current) {
      console.log('HERE');

      new Marker()
        .setLngLat([11, 49])
        .addTo(mapContainer.current);

      // const pinImage = new Image();
      // pinImage.onload = () => {
      //   if (!mapContainer.current.hasImage('pin')) {
      //     mapContainer.current.addImage('pin', pinImage, { sdf: true });
      //   }
      // }
      // pinImage.src = pin; // pin is your svg import
    }
  }

  // NOTE: instead of ref we can just use id="central-map"
  return <div className="map-container" ref={mapContainer} onLoad={onLoad}></div>;
}
