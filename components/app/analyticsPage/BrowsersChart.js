"use client"

import { Bar, BarChart, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

// The aggregated data structure is: [{ name: 'Chrome', count: 6 }, ...]

const chartConfig = {
  count: {
    label: "Clicks",
    color: "hsl(210 40% 98%)",
  },
} 

export function BrowsersChart({ data }) {
    
    // Dynamic color logic remains the same
    const dataWithColors = data.map(item => ({
        ...item,
        fill: item.name.toLowerCase().includes('chrome') ? 'var(--chart-chrome, #4285F4)' : 
              item.name.toLowerCase().includes('firefox') ? 'var(--chart-firefox, #FF7139)' : 
              item.name.toLowerCase().includes('safari') ? 'var(--chart-safari, #06B6D4)' : 
              item.name.toLowerCase().includes('edge') ? 'var(--chart-edge, #0078D7)' : 
              'var(--chart-other, #6B7280)',
    }));
    
    // const totalClicks = data.reduce((sum, item) => sum + item.count, 0);

  return (
    // 1. OUTERMOST CONTAINER: Must be flex-col and h-full
    <div className="flex flex-col h-full p-4 bg-transparent  rounded-xl">
      
      {/* HEADER: Fixed Height Content */}
   
      {/* 2. CHART AREA WRAPPER: Use flex-grow and h-full */}
      <div className="flex-grow h-full"> 
        <ChartContainer config={chartConfig} className="h-full  w-full ">
          <BarChart
            accessibilityLayer
            data={dataWithColors}
            layout="vertical"
            // Set width and height to 100% to fill the ChartContainer
            width={0} // Recharts relies on parent dimension, setting to 0 helps React render
            height={0} // Same as above
            margin={{
              left: 5,
              right: 15,
            }}
          >
            <YAxis
              dataKey="name" 
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              className="text-xs "
            />
            <XAxis dataKey="count" type="number" hide /> 
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="count" layout="vertical" radius={5} />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  )
}