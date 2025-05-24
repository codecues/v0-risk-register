"use client"

import { Edit, Trash2, Calendar, User, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Risk } from "../types/risk"

interface RiskCardProps {
  risk: Risk
  onEdit: (risk: Risk) => void
  onDelete: (id: string) => void
}

export function RiskCard({ risk, onEdit, onDelete }: RiskCardProps) {
  const getSeverityColor = (score: number) => {
    if (score >= 6) return "bg-red-500"
    if (score >= 3) return "bg-yellow-500"
    return "bg-green-500"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-red-100 text-red-800"
      case "In Progress":
        return "bg-yellow-100 text-yellow-800"
      case "Mitigated":
        return "bg-blue-100 text-blue-800"
      case "Closed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Technical":
        return "bg-purple-100 text-purple-800"
      case "Financial":
        return "bg-green-100 text-green-800"
      case "Legal":
        return "bg-blue-100 text-blue-800"
      case "Operational":
        return "bg-orange-100 text-orange-800"
      case "Strategic":
        return "bg-indigo-100 text-indigo-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const isOverdue = new Date(risk.dueDate) < new Date() && risk.status !== "Closed"

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2 flex items-center gap-2">
              {risk.title}
              {isOverdue && <AlertTriangle className="h-4 w-4 text-red-500" />}
            </CardTitle>
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge className={getCategoryColor(risk.category)}>{risk.category}</Badge>
              <Badge className={getStatusColor(risk.status)}>{risk.status}</Badge>
              <Badge variant="outline">{risk.responseStrategy}</Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full ${getSeverityColor(risk.riskScore)} flex items-center justify-center text-white text-sm font-bold`}
            >
              {risk.riskScore}
            </div>
            <Button variant="ghost" size="sm" onClick={() => onEdit(risk)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(risk.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">{risk.description}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-500">Probability:</span>
            <p className="mt-1">{risk.probability}</p>
          </div>
          <div>
            <span className="font-medium text-gray-500">Impact:</span>
            <p className="mt-1">{risk.impact}</p>
          </div>
          <div className="flex items-center gap-1">
            <User className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600">{risk.riskOwner}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span className={`text-gray-600 ${isOverdue ? "text-red-600 font-medium" : ""}`}>
              {new Date(risk.dueDate).toLocaleDateString()}
            </span>
          </div>
        </div>

        {risk.attachments.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <span className="text-sm font-medium text-gray-500">{risk.attachments.length} attachment(s)</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
