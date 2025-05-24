"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, X } from "lucide-react"
import type { Risk, RiskCategory, RiskStatus, RiskResponse, RiskLevel } from "../types/risk"

interface RiskFormProps {
  risk?: Risk | null
  onSubmit: (risk: Risk | Omit<Risk, "id">) => void
  onCancel: () => void
}

const calculateRiskScore = (probability: RiskLevel, impact: RiskLevel): number => {
  const probValue = probability === "Low" ? 1 : probability === "Medium" ? 2 : 3
  const impactValue = impact === "Low" ? 1 : impact === "Medium" ? 2 : 3
  return probValue * impactValue
}

export function RiskForm({ risk, onSubmit, onCancel }: RiskFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Technical" as RiskCategory,
    dateIdentified: new Date().toISOString().split("T")[0],
    riskOwner: "",
    probability: "Medium" as RiskLevel,
    impact: "Medium" as RiskLevel,
    status: "Open" as RiskStatus,
    responseStrategy: "Mitigation" as RiskResponse,
    dueDate: "",
    mitigationPlan: "",
    contingencyPlan: "",
  })

  const [attachments, setAttachments] = useState<File[]>([])

  useEffect(() => {
    if (risk) {
      setFormData({
        title: risk.title,
        description: risk.description,
        category: risk.category,
        dateIdentified: risk.dateIdentified,
        riskOwner: risk.riskOwner,
        probability: risk.probability,
        impact: risk.impact,
        status: risk.status,
        responseStrategy: risk.responseStrategy,
        dueDate: risk.dueDate,
        mitigationPlan: risk.mitigationPlan || "",
        contingencyPlan: risk.contingencyPlan || "",
      })
      setAttachments(risk.attachments)
    }
  }, [risk])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const riskScore = calculateRiskScore(formData.probability, formData.impact)

    const riskData = {
      ...formData,
      riskScore,
      attachments,
    }

    if (risk) {
      onSubmit({ ...riskData, id: risk.id })
    } else {
      onSubmit(riskData)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments([...attachments, ...Array.from(e.target.files)])
    }
  }

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index))
  }

  const riskScore = calculateRiskScore(formData.probability, formData.impact)

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{risk ? "Edit Risk" : "Add New Risk"}</CardTitle>
        <CardDescription>
          {risk ? "Update the risk information below" : "Fill in the details for the new risk"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Risk Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value: RiskCategory) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Technical">Technical</SelectItem>
                  <SelectItem value="Financial">Financial</SelectItem>
                  <SelectItem value="Legal">Legal</SelectItem>
                  <SelectItem value="Operational">Operational</SelectItem>
                  <SelectItem value="Strategic">Strategic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateIdentified">Date Identified *</Label>
              <Input
                id="dateIdentified"
                type="date"
                value={formData.dateIdentified}
                onChange={(e) => setFormData({ ...formData, dateIdentified: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="riskOwner">Risk Owner *</Label>
              <Input
                id="riskOwner"
                value={formData.riskOwner}
                onChange={(e) => setFormData({ ...formData, riskOwner: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="probability">Probability *</Label>
              <Select
                value={formData.probability}
                onValueChange={(value: RiskLevel) => setFormData({ ...formData, probability: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="impact">Impact *</Label>
              <Select
                value={formData.impact}
                onValueChange={(value: RiskLevel) => setFormData({ ...formData, impact: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value: RiskStatus) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Mitigated">Mitigated</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="responseStrategy">Response Strategy *</Label>
              <Select
                value={formData.responseStrategy}
                onValueChange={(value: RiskResponse) => setFormData({ ...formData, responseStrategy: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mitigation">Mitigation</SelectItem>
                  <SelectItem value="Contingency">Contingency</SelectItem>
                  <SelectItem value="Avoidance">Avoidance</SelectItem>
                  <SelectItem value="Transfer">Transfer</SelectItem>
                  <SelectItem value="Accept">Accept</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Risk Score (Calculated)</Label>
              <div
                className={`p-3 rounded-md text-center font-bold ${
                  riskScore >= 6
                    ? "bg-red-100 text-red-800"
                    : riskScore >= 3
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                }`}
              >
                {riskScore} ({riskScore >= 6 ? "High" : riskScore >= 3 ? "Medium" : "Low"})
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mitigationPlan">Mitigation Plan</Label>
            <Textarea
              id="mitigationPlan"
              value={formData.mitigationPlan}
              onChange={(e) => setFormData({ ...formData, mitigationPlan: e.target.value })}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contingencyPlan">Contingency Plan</Label>
            <Textarea
              id="contingencyPlan"
              value={formData.contingencyPlan}
              onChange={(e) => setFormData({ ...formData, contingencyPlan: e.target.value })}
              rows={3}
            />
          </div>

          <div className="space-y-4">
            <Label>Attachments</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-900">Upload files</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      multiple
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>
              </div>
            </div>

            {attachments.length > 0 && (
              <div className="space-y-2">
                {attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">{file.name}</span>
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeAttachment(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-6">
            <Button type="submit" className="flex-1">
              {risk ? "Update Risk" : "Add Risk"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
