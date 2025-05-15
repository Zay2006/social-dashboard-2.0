"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { chartColors } from "@/lib/colors"
import { Bar, BarChart as RechartsBarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface ChartDataPoint {
  name: string
  value: number
}

interface BarChartProps {
  title: string
  data: ChartDataPoint[]
  color: string
}

interface TooltipProps {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              Platform
            </span>
            <span className="font-bold text-muted-foreground">{label}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              Followers
            </span>
            <span className="font-bold">
              {payload[0].value.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    )
  }
  return null
}

export function BarChart({ title, data, color = chartColors.bar.primary }: BarChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-[350px] items-center justify-center text-muted-foreground">
        No data available
      </div>
    )
  }

  const maxValue = Math.max(...data.map(item => item.value))
  const minValue = Math.min(...data.map(item => item.value))
  const padding = Math.max((maxValue - minValue) * 0.1, 1000) // Ensure minimum padding

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <ResponsiveContainer width="100%" height={350}>
          <RechartsBarChart data={data}
            margin={{ top: 10, right: 30, left: 30, bottom: 20 }}
          >
            <defs>
              <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={1} />
                <stop offset="100%" stopColor={color} stopOpacity={0.6} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="10 10" horizontal={true} vertical={false} stroke="#27272a" />
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
              tickFormatter={(value) => `${value.toLocaleString()}`}
              domain={[minValue - padding, maxValue + padding]}
              dy={-4}
              width={80}
              className="text-zinc-400"
            />
            <Tooltip 
              content={<CustomTooltip />}
              contentStyle={{
                backgroundColor: '#18181b',
                border: '1px solid #27272a',
                borderRadius: '6px',
                color: '#a1a1aa'
              }}
              cursor={{ fill: '#27272a', opacity: 0.2 }} 
            />
            <Bar
              dataKey="value"
              fill={`url(#gradient-${title})`}
              radius={[4, 4, 0, 0]}
              maxBarSize={50}
              animationDuration={1000}
              animationBegin={0}
            />
          </RechartsBarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
