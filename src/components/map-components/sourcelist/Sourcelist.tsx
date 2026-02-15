"use client";

import React, { useEffect, useRef, useState } from 'react';
import styles from './Sourcelist.module.css';
import { SourcelistProps } from '@/interfaces/Map';
import Draggable from 'react-draggable';
import { X, Grip, MapPin, Box } from 'lucide-react';
import maplibregl from 'maplibre-gl';

const Sourcelist = (sourcelistProps: SourcelistProps) => {
    const { mapRef, sourcelistVisible, setSourcelistVisible, mapConfig } = sourcelistProps;
    const sourcelistRef = useRef(null);
    const [features, setFeatures] = useState<any>([]);
    useEffect(() => {
        fetch(mapConfig.source)
            .then(response => response.json())
            .then(data => setFeatures(data.features));
    }, []);

    return (
        <Draggable nodeRef={sourcelistRef}>
            <div className={styles.sourcelist} ref={sourcelistRef}>
                <div className={styles.header}>
                    <div className={styles.title}>
                        <Grip className={styles.dragIcon} />
                        <h4>Points & Areas</h4>
                    </div>
                    <button className={styles.closeButton} onClick={() => setSourcelistVisible(!sourcelistVisible)}>
                        <X className={styles.closeButtonIcon} />
                    </button>
                </div>
                <div className={styles.body}>
                    {features.map((feature: any, index: number) => (
                        <div key={index} className={styles.listPoint} onClick={() => {
                            const { geometry } = feature;
                            const map = mapRef.current;

                            if (geometry.type === 'Point') {
                                map?.flyTo({
                                    center: geometry.coordinates,
                                    zoom: 15,
                                    essential: true,
                                    duration: 1000
                                });
                            } else if (geometry.type === 'Polygon') {
                                const coords = geometry.coordinates[0];
                                const bounds = coords.reduce((acc: any, cur: any) => {
                                    return acc.extend(cur);
                                }, new maplibregl.LngLatBounds(coords[0], coords[0]));

                                map?.fitBounds(bounds, {
                                    padding: 50,
                                    duration: 1000
                                });
                            }
                        }}>
                            {feature.geometry.type === 'Point' ? (
                                <MapPin size={16} className={styles.pointIcon} color={mapConfig.colorTypes[feature.properties.category] || '#1697e2'} />
                            ) : (
                                <Box size={16} className={styles.areaIcon} color={mapConfig.colorTypes[feature.properties.category] || '#e67e22'} />
                            )}
                            <p>{feature.properties.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </Draggable>
    );
};

export default Sourcelist;