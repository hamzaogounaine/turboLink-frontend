"use client"

import React, { useEffect, useRef, useMemo } from 'react';

// IMPORTANT: For this component to work, the following scripts 
// MUST BE LOADED in your root HTML document (e.g., layout.tsx or index.html) 
// exactly as you provided them: anychart-base, anychart-map, world.js, etc.

// We assume 'anychart' is available globally, as per your example.

// === Data Mapping (Needs to be external/expanded in your app) ===
const COUNTRY_NAME_TO_ISO2 = {
    "United States": "US", "United Kingdom": "GB", "Germany": "DE", "Canada": "CA", 
    "Unknown": "NA", "Brazil": "BR", "India": "IN", "Australia": "AU", 
    "Japan": "JP", "China": "CN", "Russia": "RU", "Mexico": "MX",
    // ... expand this list ...
};


// =============================================================

export function GeoMapChart({ data }) {
    
    const containerRef = useRef(null);

    // 1. Transform the data into the map's required structure
    const mapData = useMemo(() => {
        return data
            // Filter out 'Unknown' if you don't want it plotted (though we map it for safety)
            .filter(item => item.count > 0)
            .map(item => {
                const iso2 = COUNTRY_NAME_TO_ISO2[item.name] || 'Germany'; // Fallback to 'NA' if name not mapped
                return {
                    id: iso2, // The 2-letter code required by the world map
                    value: item.count, // The click count
                    name: item.name, // The full name for the tooltip
                };
            });
    }, [data]);
    
    // 2. Map Initialization Logic (Runs when data changes)
    useEffect(() => {
        if (!containerRef.current || !mapData.length) return;

        // Cleanup function for when the component unmounts
        let mapInstance

        try {
            // Set the theme before any chart drawing
            anychart.theme('darkBlue'); 

            // Create the map instance
            mapInstance = anychart.map();

            // Set the geoData using the world map registered in the CDN script
            mapInstance.geoData('anychart.maps.world');

            // Set the chart title
            mapInstance.title('Geographical Click Breakdown (Choropleth)');

            // Creating a data set from our transformed array
            const dataSet = anychart.data.set(mapData);

            // Define the series
            var series = mapInstance.choropleth(dataSet);

            // Adjust the series: use the 'id' field to match map regions
            series.geoIdField('id'); // Matches the 'id' (ISO2) we created in mapData

            // Define the color scale based on click count (value)
            mapInstance.colorScale(
                anychart.scales.ordinalColor().ranges([
                    { less: 1, color: '#1a1a1a' },
                    { from: 1, to: 10, color: '#4d4d4d' },
                    { from: 10, to: 50, color: '#5C3E8A' },
                    { from: 50, color: '#9933CC' }
                ])
            );
            
            // Apply tooltip formatting similar to your example
            mapInstance
                .tooltip()
                .useHtml(true)
                .titleFormat(function () {
                    // Use the country name from the data (not the map's default)
                    return this.getData('name') || this.id; 
                })
                .format(function () {
                    const value = this.value || 0;
                    return `<strong>Total Clicks: </strong> <span style="color: #9933CC; font-size: 14px;">${value}</span>`;
                });

            // Optional: Create zoom controls
            var zoomController = anychart.ui.zoom();
            zoomController.render(mapInstance);

            // Set container id and initiate chart drawing
            mapInstance.container(containerRef.current);
            mapInstance.draw();

        } catch (e) {
            console.error("AnyChart Map initialization failed:", e);
        }

        // Cleanup function: Dispose of the map instance when the component unmounts
        return () => {
            if (mapInstance) {
                mapInstance.dispose();
            }
        };
    }, [mapData]); // Rerun effect when mapData (derived from data) changes

    return (
        <div className="flex flex-col h-full p-4  rounded-xl">
             <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold">Geographical Click Map</h3>
            </div>
            
            {/* The map rendering area */}
            <div className="flex-grow h-full">
                {/* 3. The container div for AnyChart */}
                <div ref={containerRef} className="w-full h-full" />
            </div>
        </div>
    );
}