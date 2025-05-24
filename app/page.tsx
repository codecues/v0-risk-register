"use client"

import { useState, useMemo } from "react"
import { Plus, Grid, List, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RiskForm } from "./components/risk-form"
import { RiskCard } from "./components/risk-card"
import { RiskMatrix } from "./components/risk-matrix"
import { RiskFilters } from "./components/risk-filters"
import type { Risk } from "./types/risk"

const initialRisks: Risk[] = [
  {
    id: "1",
    title: "Server Infrastructure Failure",
    description: "Critical server hardware failure could lead to system downtime",
    category: "Technical",
    dateIdentified: "2024-01-15",
    riskOwner: "John Smith",
    probability: "Medium",
    impact: "High",
    riskScore: 6,
    status: "Open",
    responseStrategy: "Mitigation",
    dueDate: "2024-02-15",
    attachments: [],
  },
  {
    id: "2",
    title: "Budget Overrun",
    description: "Project costs exceeding allocated budget by 20%",
    category: "Financial",
    dateIdentified: "2024-01-10",
    riskOwner: "Sarah Johnson",
    probability: "High",
    impact: "Medium",
    riskScore: 6,
    status: "In Progress",
    responseStrategy: "Mitigation",
    dueDate: "2024-01-30",
    attachments: [],
  },
  {
    id: "3",
    title: "Regulatory Compliance",
    description: "New data protection regulations may require system changes",
    category: "Legal",
    dateIdentified: "2024-01-20",
    riskOwner: "Mike Davis",
    probability: "Low",
    impact: "High",
    riskScore: 3,
    status: "Open",
    responseStrategy: "Avoidance",
    dueDate: "2024-03-01",
    attachments: [],
  },
]

export default function RiskRegister() {
  const [risks, setRisks] = useState<Risk[]>(initialRisks)
  const [showForm, setShowForm] = useState(false)
  const [editingRisk, setEditingRisk] = useState<Risk | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    category: "all",
    status: "all",
    owner: "all",
    severity: "all",
  })
  const [sortBy, setSortBy] = useState("riskScore")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  const filteredAndSortedRisks = useMemo(() => {
    const filtered = risks.filter((risk) => {
      const matchesSearch =
        risk.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        risk.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = filters.category === "all" || risk.category === filters.category
      const matchesStatus = filters.status === "all" || risk.status === filters.status
      const matchesOwner = filters.owner === "all" || risk.riskOwner === filters.owner
      const matchesSeverity =
        filters.severity === "all" ||
        (filters.severity === "high" && risk.riskScore >= 6) ||
        (filters.severity === "medium" && risk.riskScore >= 3 && risk.riskScore < 6) ||
        (filters.severity === "low" && risk.riskScore < 3)

      return matchesSearch && matchesCategory && matchesStatus && matchesOwner && matchesSeverity
    })

    return filtered.sort((a, b) => {
      const aValue = a[sortBy as keyof Risk]
      const bValue = b[sortBy as keyof Risk]

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })
  }, [risks, searchTerm, filters, sortBy, sortOrder])

  const handleAddRisk = (newRisk: Omit<Risk, "id">) => {
    const risk: Risk = {
      ...newRisk,
      id: Date.now().toString(),
    }
    setRisks([...risks, risk])
    setShowForm(false)
  }

  const handleEditRisk = (updatedRisk: Risk) => {
    setRisks(risks.map((risk) => (risk.id === updatedRisk.id ? updatedRisk : risk)))
    setEditingRisk(null)
    setShowForm(false)
  }

  const handleDeleteRisk = (id: string) => {
    setRisks(risks.filter((risk) => risk.id !== id))
  }

  const startEdit = (risk: Risk) => {
    setEditingRisk(risk)
    setShowForm(true)
  }

  const cancelForm = () => {
    setShowForm(false)
    setEditingRisk(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Risk Register</h1>
          <p className="text-gray-600">Manage and track project risks effectively</p>
        </div>

        {showForm ? (
          <RiskForm risk={editingRisk} onSubmit={editingRisk ? handleEditRisk : handleAddRisk} onCancel={cancelForm} />
        ) : (
          <Tabs defaultValue="list" className="space-y-6">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="list" className="flex items-center gap-2">
                  <List className="h-4 w-4" />
                  List View
                </TabsTrigger>
                <TabsTrigger value="matrix" className="flex items-center gap-2">
                  <Grid className="h-4 w-4" />
                  Risk Matrix
                </TabsTrigger>
              </TabsList>

              <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add New Risk
              </Button>
            </div>

            <TabsContent value="list" className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex flex-col lg:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search risks..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="riskScore">Risk Score</SelectItem>
                        <SelectItem value="title">Title</SelectItem>
                        <SelectItem value="dateIdentified">Date</SelectItem>
                        <SelectItem value="dueDate">Due Date</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button variant="outline" onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </Button>
                  </div>
                </div>

                <RiskFilters filters={filters} onFiltersChange={setFilters} risks={risks} />
              </div>

              <div className="grid gap-4">
                {filteredAndSortedRisks.map((risk) => (
                  <RiskCard key={risk.id} risk={risk} onEdit={startEdit} onDelete={handleDeleteRisk} />
                ))}
                {filteredAndSortedRisks.length === 0 && (
                  <div className="text-center py-12 text-gray-500">No risks found matching your criteria.</div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="matrix">
              <RiskMatrix risks={filteredAndSortedRisks} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}
