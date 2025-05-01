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

interface PlatformSelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function PlatformSelect({ value, onValueChange }: PlatformSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select platform" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Platforms</SelectLabel>
          <SelectItem value="all">All Platforms</SelectItem>
          <SelectItem value="twitter">Twitter</SelectItem>
          <SelectItem value="instagram">Instagram</SelectItem>
          <SelectItem value="linkedin">LinkedIn</SelectItem>
          <SelectItem value="facebook">Facebook</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
