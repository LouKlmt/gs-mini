"use client";

import React, { useEffect, useRef, useState } from 'react';
import styles from './Sidebar.module.css';
import { SidebarProps } from '@/interfaces/Map';
import Controlls from '../controlls/Controlls';
import Sourcelist from '../sourcelist/Sourcelist';
import { Layers, List } from 'lucide-react';

const Sidebar = (sidebarProps: SidebarProps) => {
    const { mapRef } = sidebarProps;
    const [controllsVisible, setControllsVisible] = useState(false);
    const [sourcelistVisible, setSourcelistVisible] = useState(false);

    const enablePitchView = () => {
        if (mapRef.current) {
            mapRef.current.flyTo({
                pitch: 60,
                bearing: -20,
                zoom: 15,
                duration: 2000,
                essential: true
            });
        }
    };

    const resetView = () => {
        if (mapRef.current) {
            mapRef.current.flyTo({
                pitch: 0,
                bearing: 0,
                zoom: 12,
                duration: 2000
            });
        }
    };


    return (
        <>
            {controllsVisible && <Controlls
                {...sidebarProps}
                controllsVisible={controllsVisible}
                setControllsVisible={setControllsVisible}
            />}
            {sourcelistVisible && <Sourcelist
                {...sidebarProps}
                sourcelistVisible={sourcelistVisible}
                setSourcelistVisible={setSourcelistVisible}
            />}
            <div className={styles.sidebar}>
                <button onClick={enablePitchView} className={styles.sidebarButton}>
                    <p>Pitch</p>
                </button>
                <button onClick={resetView} className={styles.sidebarButton}>
                    <p>Flat</p>
                </button>
                <button className={styles.sidebarButton + (controllsVisible ? ' ' + styles.sidebarButtonActive : '')} onClick={() => setControllsVisible(!controllsVisible)}>
                    <Layers className={styles.icon} />
                </button>
                <button className={styles.sidebarButton + (sourcelistVisible ? ' ' + styles.sidebarButtonActive : '')} onClick={() => setSourcelistVisible(!sourcelistVisible)}>
                    <List className={styles.icon} />
                </button>
            </div>
        </>
    );
};

export default Sidebar;