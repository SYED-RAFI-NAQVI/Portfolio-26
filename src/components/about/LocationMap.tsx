import { useEffect, useRef, useState } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import styles from "./LocationMap.module.css";
import { locations } from "../../data/about";
import { sound } from "../../sounds";

type LocationKey = "current" | "born";

export function LocationMap() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);
  const [activeLoc, setActiveLoc] = useState<LocationKey>("current");

  // Initialize Map
  useEffect(() => {
    if (!mapContainer.current) return;
    if (mapRef.current) return; // Initialize once

    // Fix for Next.js Turbopack worker resolution
    maplibregl.setWorkerUrl("/maplibre-gl-worker.mjs");

    const loc = locations[activeLoc];

    mapRef.current = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://tiles.openfreemap.org/styles/dark",
      center: [loc.lng, loc.lat],
      zoom: loc.zoom,
      scrollZoom: false, // Do not trap About drawer scrolling
      dragRotate: false,
      touchPitch: false,
      pitchWithRotate: false,
      attributionControl: false,
    });

    mapRef.current.addControl(
      new maplibregl.NavigationControl({
        showCompass: false,
        showZoom: true,
      }),
      "top-right"
    );

    const el = document.createElement("div");
    el.className = styles.mapMarker;

    markerRef.current = new maplibregl.Marker({ 
      element: el
    })
      .setLngLat([loc.lng, loc.lat])
      .addTo(mapRef.current);

    updateMarkerDOM(loc);

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateMarkerDOM = (loc: any) => {
    if (!markerRef.current) return;
    const el = markerRef.current.getElement();
    el.innerHTML = `
      <div class="${styles.markerPin}">
        <span class="${styles.pinRing}"></span>
        <span class="${styles.pinDot}"></span>
      </div>
      <span class="${styles.markerLabel}">${loc.city}</span>
      <span class="${styles.markerCoordinates}">${loc.coordsStr}</span>
      ${loc.address ? `<span class="${styles.markerAddress}">${loc.address}</span>` : ""}
    `;
  };

  const handleSwitch = (locKey: LocationKey) => {
    if (activeLoc === locKey) return;
    
    sound.toggle(); 
    setActiveLoc(locKey);

    const loc = locations[locKey];
    
    if (mapRef.current && markerRef.current) {
      mapRef.current.flyTo({
        center: [loc.lng, loc.lat],
        zoom: loc.zoom,
        duration: 1400,
        essential: true,
      });

      markerRef.current.setLngLat([loc.lng, loc.lat]);
      updateMarkerDOM(loc);
    }
  };

  const loc = locations[activeLoc];

  return (
    <div className={styles.mapCard}>
      <div ref={mapContainer} className={styles.map} aria-label="Rafi location map" />
      <div className={styles.mapOverlay} />
      
      <div className={styles.bottomControls}>
        <div className={styles.locationTabs}>
          <button 
            className={`${styles.locationTab} ${activeLoc === "current" ? styles.active : ""}`}
            onClick={() => handleSwitch("current")}
            aria-pressed={activeLoc === "current"}
            data-hover-sound="ambient"
          >
            <span className={styles.countryCode}>US</span>
            <span>Current</span>
          </button>
          <button 
            className={`${styles.locationTab} ${activeLoc === "born" ? styles.active : ""}`}
            onClick={() => handleSwitch("born")}
            aria-pressed={activeLoc === "born"}
            data-hover-sound="ambient"
          >
            <span className={styles.countryCode}>IN</span>
            <span>Born</span>
          </button>
        </div>

        <a 
          href={loc.svUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className={styles.streetView}
          data-hover-sound="ambient"
        >
          <span className={styles.streetViewDot} />
          <span>Street View ↗</span>
        </a>
      </div>
    </div>
  );
}
