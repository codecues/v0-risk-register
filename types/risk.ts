export type RiskCategory = "Technical" | "Financial" | "Legal" | "Operational" | "Strategic"
export type RiskStatus = "Open" | "In Progress" | "Mitigated" | "Closed"
export type RiskResponse = "Mitigation" | "Contingency" | "Avoidance" | "Transfer" | "Accept"
export type RiskLevel = "Low" | "Medium" | "High"

export interface Risk {
  id: string
  title: string
  description: string
  category: RiskCategory
  dateIdentified: string
  riskOwner: string
  probability: RiskLevel
  impact: RiskLevel
  riskScore: number
  status: RiskStatus
  responseStrategy: RiskResponse
  dueDate: string
  attachments: File[]
  mitigationPlan?: string
  contingencyPlan?: string
}
