"use client"

import { Bar, BarChart, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

// The aggregated data structure is: [{ name: 'Linux', count: 6 }, { name: 'Windows', count: 0 }, ...]

const chartConfig = {
  count: {
    label: "Clicks",
    color: "hsl(210 40% 98%)",
  },
} 

// The 'data' prop accepts the aggregated array: data = deviceAnalytics.os
export function OSChart({ data }) {
    
    // Dynamic color logic based on the OS name
    const dataWithColors = data.map(item => ({
        ...item,
        // Map common OS names to distinct colors
        fill: item.name.toLowerCase().includes('linux') ? 'var(--chart-linux, #FFBC00)' : // Yellow for Linux
              item.name.toLowerCase().includes('windows') ? 'var(--chart-windows, #0078D7)' : // Blue for Windows
              item.name.toLowerCase().includes('mac') ? 'var(--chart-mac, #A2AAAD)' :     // Grey for Mac
              item.name.toLowerCase().includes('android') ? 'var(--chart-android, #3DDC84)' : // Green for Android
              item.name.toLowerCase().includes('ios') ? 'var(--chart-ios, #5856D6)' :       // Purple for iOS
              'var(--chart-other, #6B7280)', // Default fallback
    }));
    
    const totalClicks = data.reduce((sum, item) => sum + item.count, 0);

  return (
    // OUTERMOST CONTAINER: Must be flex-col and h-full to fill parent div
    <div className="flex flex-col h-full p-4  rounded-xl">
      
      {/* HEADER: Fixed Height Content */}


      {/* CHART AREA WRAPPER: Use flex-grow and h-full to occupy remaining space */}
      <div className="flex-grow h-full"> 
        <ChartContainer config={chartConfig} className="h-full w-full">
          <BarChart
            accessibilityLayer
            data={dataWithColors} // Use the color-mapped data
            layout="vertical"
            width={0} 
            height={0} 
            margin={{
              left: 5,
              right: 15,
            }}
          >
            {/* YAxis shows the OS name (e.g., 'Linux', 'Windows') */}
            <YAxis
              dataKey="name" 
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              className="text-xs text-gray-400"
            />
            {/* XAxis shows the click count */}
            <XAxis dataKey="count" type="number" hide /> 
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            {/* Bar uses 'count' for length and the dynamically calculated 'fill' */}
            <Bar dataKey="count" layout="vertical" radius={5} />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  )
}