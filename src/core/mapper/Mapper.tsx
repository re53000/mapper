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
}, {
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
    ROUTE.map(({ name, position, markerColor: color }) => {
      new Marker({
        color,
        draggable: true
      })
        .setLngLat(position)
        .setPopup(new Popup({ closeOnClick: false }).setHTML(`<h3>${name}</h3>`))
        .addTo(map);
    })
  }, [map])

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
      transformRequest: (url) => ({
        url,
        headers: { "Accept-Language": "en-US,en;q=0.5", }
      })
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

  const [currentPosition, setCurrentPosition] = useState<GeolocationPosition>()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!currentPosition?.coords || !map) {
      return
    }

    const { latitude, longitude } = currentPosition.coords
    const position = new LngLat(...[longitude, latitude])
    
    map.setCenter(position)
    new Marker()
      .setLngLat(position)
      .addTo(map)

  }, [currentPosition?.coords, map])

  const successPositionCallback = (e: GeolocationPosition) => {
    setCurrentPosition(e)
    setIsLoading(false)
  }

  const errorPositionCallback = (e: GeolocationPositionError) => {
    console.error('Failed to find you', e.message);
    setIsLoading(false)
  }

  const onGetCurrentPositionClick = () => {
    setIsLoading(true)
    navigator.geolocation.getCurrentPosition(successPositionCallback, errorPositionCallback)
  }

  return (
    <section className="map-section">
      <div className="map-container" ref={mapContainer}></div>
      <button onClick={onGetCurrentPositionClick}>{isLoading ? `Finding you ...` : `Find me`}</button>
    </section>
  )
}
