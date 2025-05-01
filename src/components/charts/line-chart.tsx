"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart as RechartsLineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface LineChartDataPoint {
  name: string
  current: number
  previous: number
}

interface LineChartProps {
  title: string
  description?: string
  data: LineChartDataPoint[]
  colors: [string, string]
}

interface TooltipProps {
  active?: boolean
  payload?: Array<{ value: number; dataKey: string; color: string }>
  label?: string
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid gap-2">
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              Date
            </span>
            <span className="font-bold text-muted-foreground">{label}</span>
          </div>
          {payload.map((entry: { dataKey: string; value: number; color: string }, index: number) => (
            <div key={index} className="flex flex-col">
              <span className="text-[0.70rem] uppercase text-muted-foreground">
                {entry.dataKey === "current" ? "Current Period" : "Previous Period"}
              </span>
              <span className="font-bold" style={{ color: entry.color }}>
                {entry.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }
  return null
}

export function LineChart({ title, description, data, colors }: LineChartProps) {
  const allValues = data.flatMap(item => [item.current, item.previous])
  const maxValue = Math.max(...allValues)
  const minValue = Math.min(...allValues)
  const padding = (maxValue - minValue) * 0.1

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <RechartsLineChart data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value.toLocaleString()}`}
              domain={[minValue - padding, maxValue + padding]}
              dy={-4}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="current"
              stroke={colors[0]}
              strokeWidth={2}
              dot={false}
              activeDot={{
                r: 6,
                style: { fill: colors[0], opacity: 0.8 }
              }}
            />
            <Line
              type="monotone"
              dataKey="previous"
              stroke={colors[1]}
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
              activeDot={{
                r: 6,
                style: { fill: colors[1], opacity: 0.8 }
              }}
            />
          </RechartsLineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
