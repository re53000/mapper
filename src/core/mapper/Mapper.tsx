import { Map as MapLibreMap, NavigationControl, StyleSpecification, Marker, Popup, LngLat } from "maplibre-gl";
import { useEffect, useRef, useState } from "react";
import 'maplibre-gl/dist/maplibre-gl.css';
import './Mapper.css'

type Point = {
  name: string,
  position: LngLat
  markerColor?: string
}

const OSM_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: "raster",
      tiles: ["https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution: "",
    }
  },
  layers: [
    {
      id: "osm",
      type: "raster",
      source: "osm" // This must match the source key above
    }
  ]
};

const INITIAL_STATE = {
  lng: 37.55,
  lat: 55.71,
  zoom: 11,
};

const ROUTE: Point[] = [{
  name: 'start',
  position: new LngLat(...[37.553589367657935, 55.715773776860885])
},{
  name: 'finish',
  position: new LngLat(...[37.60036171391039, 55.72761426861828]),
  markerColor: '#ff6347'
}]

export const Mapper = () => {
  const mapContainer = useRef(null);
  const [map, setMap] = useState<MapLibreMap>()

  useEffect(() => {
    // draw the route
    if (!map) {
      return
    }
    ROUTE.map(({name, position, markerColor: color}) => {
      new Marker({
        color,
        draggable: true
      })
      .setLngLat(position)
      .setPopup(new Popup({closeOnClick: false}).setHTML(`<h3>${name}</h3>`))
      .addTo(map);
    })
  },[map])

  useEffect(() => {
    // mount map to the container
    if (!mapContainer.current) {
      return
    }

    const libreMap = new MapLibreMap({
      container: mapContainer.current,
      center: [INITIAL_STATE.lng, INITIAL_STATE.lat],
      zoom: INITIAL_STATE.zoom,
      style: OSM_STYLE,
    });

    const nav = new NavigationControl({
      visualizePitch: true
    });

    libreMap.addControl(nav, "top-left");
    setMap(libreMap)
  }, []);

  const listenPosition = () => {
    map?.on("click", (e) => {
      console.log(e);
      console.log([e.lngLat.lng, e.lngLat.lat]);
    });
  }

  useEffect(() => {
    // register position listener
    map?.on('load', listenPosition)
    return () => {
      map?.off('load', listenPosition)
    }
  })
  
  return <div className="map-container" ref={mapContainer}></div>;
}
