export interface MapConfig {
    source: string;
    colorTypes: { [key: string]: string };
    center: [number, number];
    zoom: number;
    pitch: number;
    bearing: number;
}

export interface MapProps {
    mapConfig: MapConfig;
}

export interface SidebarProps extends MapProps {
    showPoints: boolean;
    setShowPoints: (val: boolean) => void;
    showPolygons: boolean;
    setShowPolygons: (val: boolean) => void;
    mapRef: React.RefObject<maplibregl.Map | null>;
}

export interface ControllsProps extends SidebarProps {
    controllsVisible: boolean;
    setControllsVisible: (visible: boolean) => void;
}

export interface SourcelistProps extends SidebarProps {
    sourcelistVisible: boolean;
    setSourcelistVisible: (visible: boolean) => void;
}

