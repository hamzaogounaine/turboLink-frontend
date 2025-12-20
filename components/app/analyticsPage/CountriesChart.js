"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"

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

// Define a color palette
const COLORS = [
  "#38BDF8", // sky blue
  "#22C55E", // emerald green
  "#EAB308", // yellow
  "#F97316", // orange
  "#EF4444", // red
  "#A855F7", // purple
  "#14B8A6", // teal
  "#6366F1", // indigo
  "#EC4899", // pink
  "#F43F5E", // rose
]


export function CountriesChart({ data }) {
  // Add fill colors to the data
  const chartData = React.useMemo(() => {
    return data.map((item, index) => ({
      ...item,
      fill: COLORS[index % COLORS.length],
    }))
  }, [data])

  // Generate chart config dynamically based on data
  const chartConfig = React.useMemo(() => {
    const config = {
      count: {
        label: "Visitors",
      },
    }
    
    data.forEach((item, index) => {
      config[index] = {
        label: item.name,
        color: COLORS[index % COLORS.length],
      }
    })
    
    return config
  }, [data])

  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0)
  }, [chartData])

  return (
    <Card className="flex flex-col  p-0 bg-transparent border-0 ">
      {/* <CardHeader className="items-center pb-0  h-full">
        <CardTitle>Visitors by Country</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader> */}
      <CardContent className="h-full min-h-[200px]">
        <ChartContainer
          config={chartConfig}
          className="mx-auto h-full max-h-[250px] "
        >
          <PieChart className="">
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="name"
              innerRadius={60}
              outerRadius={80}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Visitors
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
     
    </Card>
  )
}