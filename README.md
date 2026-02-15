WebGIS Interactive Map Explorer

A modern WebGIS application built with Next.js, TypeScript, and MapLibre GL JS. This project visualizes geospatial data (points and polygons) and provides an interactive interface for data exploration.
Features

    Interactive Map Engine: Fullscreen map integration using MapLibre GL JS with OpenStreetMap tiles.

    Dynamic Data Loading: Fetching and rendering GeoJSON data dynamically.

    Draggable UI Components: Custom-built, draggable windows for Layer Controls and Data Lists, ensuring a flexible workspace.

    Smart Navigation:

        FlyTo functionality: Smooth transitions to specific points upon selection.

        Auto-Bounding: Automatic map fitting for polygon geometries.

    Layer Management: Toggle visibility for points, clusters, and polygons in real-time.

    Camera Presets: Quick access to Pitch (3D view) and Flat (Top-down) views.

Tech Stack

    Framework: Next.js 16 (App Router)

    Language: TypeScript

    Mapping: MapLibre GL JS

    Icons: Lucide React

    Components: React Draggable

    Styling: CSS Modules (Standard CSS)

Installation & Setup

    Clone the repository:

    git clone https://github.com/LouKlmt/gs-mini.git
    cd gs-mini

    Install dependencies:

    npm install

    Run the development server:

    npm run dev

    Open the app:
    Navigate to http://localhost:3000 to view the map.

Project Structure

    /components/map-components: Core logic for the Map, Sidebar, and Controls.

    /interfaces: TypeScript definitions for Map configurations and props.

    /public/data: Local GeoJSON data storage.

Future Improvements

If I had more time, I would:

    Add a backend API to serve GeoJSON data from a database instead of local files.
