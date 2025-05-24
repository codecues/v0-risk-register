"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Risk } from "../types/risk"

interface RiskMatrixProps {
  risks: Risk[]
}

export function RiskMatrix({ risks }: RiskMatrixProps) {
  const getMatrixPosition = (probability: string, impact: string) => {
    const probIndex = probability === "Low" ? 0 : probability === "Medium" ? 1 : 2
    const impactIndex = impact === "Low" ? 0 : impact === "Medium" ? 1 : 2
    return { row: 2 - probIndex, col: impactIndex }
  }

  const getCellColor = (row: number, col: number) => {
    const score = (2 - row + 1) * (col + 1)
    if (score >= 6) return "bg-red-200 border-red-300"
    if (score >= 3) return "bg-yellow-200 border-yellow-300"
    return "bg-green-200 border-green-300"
  }

  const getRisksInCell = (row: number, col: number) => {
    return risks.filter((risk) => {
      const pos = getMatrixPosition(risk.probability, risk.impact)
      return pos.row === row && pos.col === col
    })
  }

  const matrixLabels = {
    probability: ["High", "Medium", "Low"],
    impact: ["Low", "Medium", "High"],
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Assessment Matrix</CardTitle>
        <CardDescription>Visual representation of risks based on probability and impact</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            {/* Header */}
            <div className="grid grid-cols-4 gap-2 mb-2">
              <div></div>
              <div className="text-center font-medium text-sm">Low Impact</div>
              <div className="text-center font-medium text-sm">Medium Impact</div>
              <div className="text-center font-medium text-sm">High Impact</div>
            </div>

            {/* Matrix */}
            {[0, 1, 2].map((row) => (
              <div key={row} className="grid grid-cols-4 gap-2 mb-2">
                <div className="flex items-center justify-center font-medium text-sm">
                  {matrixLabels.probability[row]} Probability
                </div>
                {[0, 1, 2].map((col) => {
                  const cellRisks = getRisksInCell(row, col)
                  return (
                    <div key={col} className={`h-24 border-2 rounded-lg p-2 ${getCellColor(row, col)}`}>
                      <div className="text-xs font-medium mb-1">Score: {(2 - row + 1) * (col + 1)}</div>
                      <div className="space-y-1">
                        {cellRisks.slice(0, 2).map((risk) => (
                          <div
                            key={risk.id}
                            className="text-xs bg-white bg-opacity-70 rounded px-1 py-0.5 truncate"
                            title={risk.title}
                          >
                            {risk.title}
                          </div>
                        ))}
                        {cellRisks.length > 2 && (
                          <div className="text-xs text-gray-600">+{cellRisks.length - 2} more</div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-200 border border-green-300 rounded"></div>
            <span>Low Risk (1-2)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-200 border border-yellow-300 rounded"></div>
            <span>Medium Risk (3-4)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-200 border border-red-300 rounded"></div>
            <span>High Risk (6-9)</span>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{risks.filter((r) => r.riskScore >= 6).length}</div>
            <div className="text-sm text-red-600">High Risk</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {risks.filter((r) => r.riskScore >= 3 && r.riskScore < 6).length}
            </div>
            <div className="text-sm text-yellow-600">Medium Risk</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{risks.filter((r) => r.riskScore < 3).length}</div>
            <div className="text-sm text-green-600">Low Risk</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
