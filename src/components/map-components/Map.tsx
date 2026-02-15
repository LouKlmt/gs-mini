"use client";

import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import styles from './Map.module.css';
import Sidebar from './sidebar/Sidebar';
import { MapProps } from '@/interfaces/Map';

const Map = ({ mapConfig }: MapProps) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<maplibregl.Map | null>(null);
    const [showPoints, setShowPoints] = useState(true);
    const [showPolygons, setShowPolygons] = useState(true);


    useEffect(() => {
        if (mapRef.current || !mapContainerRef.current) return;

        mapRef.current = new maplibregl.Map({
            container: mapContainerRef.current,
            style: {
                version: 8,
                glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
                sources: {
                    'osm': {
                        type: 'raster',
                        tiles: ['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'],
                        tileSize: 256,
                        attribution: '&copy; OpenStreetMap'
                    }
                },
                layers: [{ id: 'osm-layer', type: 'raster', source: 'osm' }]
            },
            center: mapConfig.center,
            zoom: mapConfig.zoom,
            pitch: mapConfig.pitch,
            bearing: mapConfig.bearing
        });

        const map = mapRef.current;

        map.on('load', () => {
            map.addSource('points-source', {
                type: 'geojson',
                data: mapConfig.source,
                cluster: true,
                clusterMaxZoom: 14,
                clusterRadius: 50
            });

            map.addSource('polygons-source', {
                type: 'geojson',
                data: mapConfig.source
            });

            map.addLayer({
                id: 'polygons-layer',
                type: 'fill',
                source: 'polygons-source',
                filter: ['==', '$type', 'Polygon'],
                layout: {
                    'visibility': showPolygons ? 'visible' : 'none'
                },
                paint: {
                    'fill-color': [
                        'match',
                        ['get', 'type'],
                        'Protected Area',
                        mapConfig.colorTypes['Protected Area'],
                        '#e24a4aff'
                    ],
                    'fill-opacity': 0.5,
                    'fill-outline-color': '#ff0000ff'
                }
            });

            map.addLayer({
                id: 'polygon-labels',
                type: 'symbol',
                source: 'polygons-source',
                filter: ['==', ['geometry-type'], 'Polygon'],
                layout: {
                    'text-field': ['get', 'type'],
                    'text-size': 20,
                    'text-rotate': -45,
                    'text-rotation-alignment': 'map',
                    'text-anchor': 'center',
                    'visibility': showPolygons ? 'visible' : 'none',
                    'text-allow-overlap': false
                },
                paint: {
                    'text-color': [
                        'match',
                        ['get', 'type'],
                        'Protected Area',
                        mapConfig.colorTypes['Protected Area text'],
                        '#ff0000ff'
                    ],
                    'text-halo-color': '#ffffff',
                    'text-halo-width': 2,
                    'text-opacity': 0.4
                }
            });

            map.addLayer({
                id: 'clusters',
                type: 'circle',
                source: 'points-source',
                filter: ['has', 'point_count'],
                paint: {
                    'circle-color': '#f1c40f',
                    'circle-radius': [
                        'step', ['get', 'point_count'],
                        20, 10, 30, 30, 40
                    ]
                }
            });

            map.addLayer({
                id: 'cluster-count',
                type: 'symbol',
                source: 'points-source',
                filter: ['has', 'point_count'],
                layout: {
                    'text-field': '{point_count}',
                    'text-size': 12
                }
            });

            map.addLayer({
                id: 'unclustered-point',
                type: 'circle',
                source: 'points-source',
                filter: ['!', ['has', 'point_count']],
                paint: {
                    'circle-color': [
                        'match',
                        ['get', 'category'],
                        'Sensor',
                        mapConfig.colorTypes['Sensor'],
                        'Station',
                        mapConfig.colorTypes['Station'],
                        '#e67e22'
                    ],
                    'circle-radius': 8,
                    'circle-stroke-width': 1,
                    'circle-stroke-color': '#fff'
                }
            });

            map.on('click', (e) => {
                const features = map.queryRenderedFeatures(e.point, {
                    layers: ['unclustered-point', 'polygons-layer']
                });

                if (!features.length) return;

                const topFeature = features[0];
                const props = topFeature.properties;
                const layerId = topFeature.layer.id;

                const popupCoords = layerId === 'unclustered-point'
                    ? (topFeature.geometry as any).coordinates
                    : e.lngLat;

                new maplibregl.Popup()
                    .setLngLat(popupCoords)
                    .setHTML(`
            <div style="padding: 5px;">
                <b style="font-size: 14px;">${props?.name}</b>
                <p style="margin: 5px 0 0;">${props?.description || props?.info || ''}</p>
                <p style="margin: 5px 0 0; font-weight: bold; font-size: 12px; 
                color: ${mapConfig.colorTypes[props?.category as keyof typeof mapConfig.colorTypes]
                        || mapConfig.colorTypes[props?.type as keyof typeof mapConfig.colorTypes]
                        || '#000'}">
                        ${props?.category
                        || props?.type
                        || ''}
                </p>
            </div>
        `).addTo(map);
            });
        });

        return () => map.remove();
    }, []);

    useEffect(() => {
        const map = mapRef.current;
        if (!map) return;

        const toggle = (id: string, visible: boolean) => {
            if (map.getLayer(id)) {
                map.setLayoutProperty(id, 'visibility', visible ? 'visible' : 'none');
            }
        };

        toggle('polygons-layer', showPolygons);
        toggle('polygon-labels', showPolygons);
        ['clusters', 'cluster-count', 'unclustered-point'].forEach(id => toggle(id, showPoints));
    }, [showPoints, showPolygons]);

    return (
        <div className={styles.container}>
            <Sidebar
                mapConfig={mapConfig}
                showPoints={showPoints}
                setShowPoints={setShowPoints}
                showPolygons={showPolygons}
                setShowPolygons={setShowPolygons}
                mapRef={mapRef}
            />
            <div ref={mapContainerRef} className={styles.mapContainer} />
        </div>
    );
};

export default Map;