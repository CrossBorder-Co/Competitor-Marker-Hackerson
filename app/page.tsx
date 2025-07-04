"use client"

import { cn } from "@/lib/utils"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { TrendingUp, Users, Target, Zap } from "lucide-react"
import { ChatInterface } from "@/components/chat-interface"

const TEMPLATE_PROMPTS = [
  {
    id: "competitive-landscape",
    title: "競合環境分析",
    description: "競合環境を分析し、主要プレイヤーを特定します",
    category: "分析",
  },
  {
    id: "threat-assessment",
    title: "脅威評価",
    description: "潜在的な脅威と競合リスクを評価します",
    category: "リスク",
  },
  {
    id: "similar-companies-activity",
    title: "類似企業の動向調査",
    description: "類似企業が同時に何をしているかを調べます",
    category: "調査",
  },
]

export default function CompetitorMarkerApp() {
  const [selectedCompany, setSelectedCompany] = useState("")
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")
  const [selectedPrompt, setSelectedPrompt] = useState("")
  const [analysisStarted, setAnalysisStarted] = useState(false)

  const handleStartAnalysis = () => {
    if (selectedCompany && selectedPrompt) {
      setAnalysisStarted(true)
    }
  }

  const resetAnalysis = () => {
    setAnalysisStarted(false)
    setSelectedCompany("")
    setSelectedPrompt("")
    setStartDate("")
    setEndDate("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Target className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Competitor Marker</h1>
              <p className="text-slate-600">AI搭載の競合インテリジェンスプラットフォーム</p>
            </div>
          </div>

          <div className="flex gap-4 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span>市場分析</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>競合追跡</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span>AIによる推奨</span>
            </div>
          </div>
        </div>

        {analysisStarted ? (
          <div className="space-y-8">
            <ChatInterface
              company={selectedCompany}
              prompt={TEMPLATE_PROMPTS.find((p) => p.id === selectedPrompt)}
              startDate={startDate}
              endDate={endDate}
              onReset={resetAnalysis}
            />
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>分析設定</CardTitle>
              <CardDescription>会社のパラメータを設定します</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Company Selection */}
              <div className="space-y-2">
                <Label htmlFor="company">対象企業</Label>
                <Input
                  id="company"
                  placeholder="会社名もしくは法人番号を入力"
                  value={selectedCompany}
                  onChange={(e) => setSelectedCompany(e.target.value)}
                />
              </div>

              {/* Date Range Accordion */}
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="date-range">
                  <AccordionTrigger>任意: 期間を指定</AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="start-date">開始日</Label>
                        <Input
                          id="start-date"
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="block w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="end-date">終了日</Label>
                        <Input
                          id="end-date"
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="block w-full"
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* Template Prompts */}
              <div className="space-y-4">
                <Label>分析テンプレート</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {TEMPLATE_PROMPTS.map((prompt) => (
                    <Card
                      key={prompt.id}
                      className={cn(
                        "cursor-pointer transition-all hover:shadow-md",
                        selectedPrompt === prompt.id && "ring-2 ring-blue-500 bg-blue-50",
                      )}
                      onClick={() => setSelectedPrompt(prompt.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-sm">{prompt.title}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {prompt.category}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-600">{prompt.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleStartAnalysis}
                disabled={!selectedCompany || !selectedPrompt}
                className="w-full"
                size="lg"
              >
                AI分析を開始
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
