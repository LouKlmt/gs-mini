"use client";

import React, { useEffect, useRef, useState } from 'react';
import styles from './Controlls.module.css';
import { ControllsProps } from '@/interfaces/Map';
import Draggable from 'react-draggable';
import { X, Grip } from 'lucide-react';

const Controlls = (controllsProps: ControllsProps) => {
    const { mapRef, showPoints, setShowPoints, showPolygons, setShowPolygons, controllsVisible, setControllsVisible } = controllsProps;
    const controllsRef = useRef(null);

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
        <Draggable nodeRef={controllsRef}>
            <div className={styles.controls} ref={controllsRef}>
                <div className={styles.header}>
                    <div className={styles.title}>
                        <Grip className={styles.dragIcon} />
                        <h4>Layers</h4>
                    </div>
                    <button className={styles.closeButton} onClick={() => setControllsVisible(!controllsVisible)}>
                        <X className={styles.closeButtonIcon} />
                    </button>
                </div>
                <div className={styles.body}>
                    <label className={styles.label}>
                        <input type="checkbox" className={styles.checkbox} checked={showPoints} onChange={() => setShowPoints(!showPoints)} />
                        Points
                    </label>
                    <label className={styles.label}>
                        <input type="checkbox" className={styles.checkbox} checked={showPolygons} onChange={() => setShowPolygons(!showPolygons)} />
                        Polygons
                    </label>
                </div>
            </div>
        </Draggable>
    );
};

export default Controlls;