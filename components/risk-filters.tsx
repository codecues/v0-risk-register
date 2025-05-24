"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import type { Risk } from "../types/risk"

interface RiskFiltersProps {
  filters: {
    category: string
    status: string
    owner: string
    severity: string
  }
  onFiltersChange: (filters: any) => void
  risks: Risk[]
}

export function RiskFilters({ filters, onFiltersChange, risks }: RiskFiltersProps) {
  const uniqueOwners = Array.from(new Set(risks.map((risk) => risk.riskOwner)))

  const clearFilters = () => {
    onFiltersChange({
      category: "all",
      status: "all",
      owner: "all",
      severity: "all",
    })
  }

  const hasActiveFilters = Object.values(filters).some((value) => value !== "all")

  return (
    <div className="flex flex-wrap gap-4 items-center">
      <div className="flex flex-wrap gap-2">
        <Select value={filters.category} onValueChange={(value) => onFiltersChange({ ...filters, category: value })}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Technical">Technical</SelectItem>
            <SelectItem value="Financial">Financial</SelectItem>
            <SelectItem value="Legal">Legal</SelectItem>
            <SelectItem value="Operational">Operational</SelectItem>
            <SelectItem value="Strategic">Strategic</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.status} onValueChange={(value) => onFiltersChange({ ...filters, status: value })}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Open">Open</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Mitigated">Mitigated</SelectItem>
            <SelectItem value="Closed">Closed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.owner} onValueChange={(value) => onFiltersChange({ ...filters, owner: value })}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Owner" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Owners</SelectItem>
            {uniqueOwners.map((owner) => (
              <SelectItem key={owner} value={owner}>
                {owner}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.severity} onValueChange={(value) => onFiltersChange({ ...filters, severity: value })}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severities</SelectItem>
            <SelectItem value="high">High (6-9)</SelectItem>
            <SelectItem value="medium">Medium (3-5)</SelectItem>
            <SelectItem value="low">Low (1-2)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters && (
        <Button variant="outline" size="sm" onClick={clearFilters}>
          <X className="h-4 w-4 mr-1" />
          Clear Filters
        </Button>
      )}
    </div>
  )
}
