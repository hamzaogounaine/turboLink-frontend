"use client"

import api from "@/lib/api";
import { useParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react"; // Added useMemo
import useSWR from "swr";

// Define an interface for the raw click data for clarity and type safety
// ----------------------------------------------------------------------
// Fetcher remains mostly the same, but with stricter typing (optional)

const fetcher = async (url) => {
    try {
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      // SWR expects the fetcher to throw on error
      throw error.response?.data?.message || 'Failed to load link analytics.';
    }
  };

// ----------------------------------------------------------------------
// The Fixed Hook Logic

export const useAnalyticsLogic = () => {
    // 1. Remove unnecessary useState for clicks/devices. UseMemo for derivation.
    // The raw data from SWR is the source of truth.
    const { link } = useParams();

    // The SWR key should handle the case where 'link' might be an array (though unlikely for a single param)
    const swrKey = link ? `/url/analytics/${link}` : null;

    const { 
        data: rawData, 
        error, 
        isLoading 
    } = useSWR(
        swrKey, // Use the dynamically derived key
        fetcher,
        { 
            revalidateOnFocus: false, // Prevents unnecessary refetches on focus
            // Set initial data if you have it, e.g., initialData: { click_details: [], clicks: 0, created_at: '' }
        }
    );

    // 2. Derive aggregated/processed data using useMemo
    // This runs ONLY when rawData changes, preventing infinite loops.
    const clicksAnalytics = useMemo(() => {
        if (!rawData?.click_details) return [];
        return rawData.click_details; // For now, just return the raw array.
        // **FUTURE STEP**: You should put the data transformation (like aggregation by day/hour) here.
    }, [rawData]);

    const urlAnalytics = useMemo(() => {
        // 1. Initial check for data
        const details = rawData?.click_details;
        if (!details || details.length === 0) {
            return { browsers: [], os: [], countries: [] };
        }
    
        // 2. Aggregation Helper Function
        // Reduces an array of objects into a map of item counts.
        const aggregateCounts = (data, key) => {
            const counts = new Map();
    
            data.forEach(item => {
                const value = item[key] || 'Unknown'; // Handle null/undefined values
                counts.set(value, (counts.get(value) || 0) + 1);
            });
    
            // Convert the Map to the desired array format: [{ name: 'Chrome', count: 6 }, ...]
            return Array.from(counts.entries()).map(([name, count]) => ({
                name,
                count,
            }));
        };
    
        // 3. Run aggregations for all desired keys
        const browsers = aggregateCounts(details, 'browser');
        const os = aggregateCounts(details, 'os');
        const countries = aggregateCounts(details, 'country'); // Always aggregate country, even if null
        const referrers = aggregateCounts(details , "referrer")
    
        // 4. Return the structured data
        return {
            browsers,
            os,
            countries,
            referrers
        };
    }, [rawData]);

    // 3. Keep console.log out of the effect unless necessary
    // If you need a side effect when data loads:
    /*
    useEffect(() => {
        if (rawData) {
            console.log('Data loaded:', rawData.clicks, 'total clicks.');
        }
    }, [rawData]);
    */

    return {
        clicksAnalytics,
        urlAnalytics,
        rawData,
        isLoading,
        error
    }
}