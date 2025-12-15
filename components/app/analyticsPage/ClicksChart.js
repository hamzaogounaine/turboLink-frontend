"use client"

import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  
} from "@/components/ui/chart"

export const description = "A simple area chart"



const chartConfig = {
  desktop: {
    label: "Clicks",
    color: "var(--chart-2)",
  },
} 

export function ClicksChart({data}) {
  return (
    <Card className={'h-80 flex flex-col justify-between pt-4 bg-gray-900'}>
      
      <CardContent className={'h-full'}>
        <ChartContainer config={chartConfig} className="h-full w-full ">
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
            className=""
          >
            <CartesianGrid vertical={false}/>
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={false}
              
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="clicks"
              type="natural"
              fill="var(--color-desktop)"
              fillOpacity={0.4}
              stroke="var(--color-desktop)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      
    </Card>
  )
}
