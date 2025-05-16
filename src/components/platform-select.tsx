"use client"

import * as React from "react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PLATFORM_DISPLAY_NAMES, PlatformName } from "@/types/platform"

interface PlatformSelectProps {
  value: PlatformName;
  onValueChange: (value: PlatformName) => void;
}

export function PlatformSelect({ value, onValueChange }: PlatformSelectProps) {
  return (
    <Select value={value} onValueChange={(v) => onValueChange(v as PlatformName)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select platform" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Platforms</SelectLabel>
          <SelectItem value="all">All Platforms</SelectItem>
          {Object.entries(PLATFORM_DISPLAY_NAMES).map(([key, name]) => (
            <SelectItem key={key} value={key}>{name}</SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
