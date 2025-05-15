"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CartesianGrid, Line, LineChart as RechartsLineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

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
  if (!data || data.length === 0) {
    return (
      <div className="flex h-[350px] items-center justify-center text-muted-foreground">
        No data available
      </div>
    )
  }

  const allValues = data.flatMap(item => [item.current, item.previous])
  const maxValue = Math.max(...allValues)
  const minValue = Math.min(...allValues)
  const padding = Math.max((maxValue - minValue) * 0.1, 1000) // Ensure minimum padding

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="pt-4">
        <ResponsiveContainer width="100%" height={350}>
          <RechartsLineChart data={data}
            margin={{ top: 10, right: 30, left: 30, bottom: 20 }}
          >
            <XAxis
              dataKey="name"
              stroke="#a1a1aa"
              fontSize={12}
              tickLine={false}
              axisLine={true}
              dy={10}
              angle={-45}
              textAnchor="end"
              height={60}
              className="text-zinc-400"
            />
            <YAxis
              stroke="#a1a1aa"
              fontSize={12}
              tickLine={false}
              axisLine={true}
              width={80}
              className="text-zinc-400"
              tickFormatter={(value) => `${value.toLocaleString()}`}
              domain={[minValue - padding, maxValue + padding]}
              dy={-4}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#18181b',
                border: '1px solid #27272a',
                borderRadius: '6px',
                color: '#a1a1aa'
              }}
              cursor={{ stroke: '#a1a1aa' }}
              content={<CustomTooltip />}
            />
            <Line
              type="monotone"
              dataKey="current"
              stroke={colors[0]}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 6, fill: colors[0] }}
              animationDuration={1000}
              animationBegin={0}
            />
            <Line
              type="monotone"
              dataKey="previous"
              stroke={colors[1]}
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
              activeDot={{ r: 6, fill: colors[1] }}
            />
            <CartesianGrid strokeDasharray="10 10" horizontal={true} vertical={false} stroke="#27272a" />
          </RechartsLineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
