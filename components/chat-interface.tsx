"use client"

import { useEffect, useState } from "react"
import { useChat } from "ai/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, User, RefreshCw, Calendar, Building, Send, AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { apiService } from "@/lib/api"
import { useCompanyAnalysis } from "@/hooks/use-api"

interface ChatInterfaceProps {
  company: string
  prompt: { id: string; title: string; description: string; category: string } | undefined
  startDate: string
  endDate: string
  onReset: () => void
}

export function ChatInterface({ company, prompt, startDate, endDate, onReset }: ChatInterfaceProps) {
  const [apiConnected, setApiConnected] = useState<boolean | null>(null)
  const { data: analysisData, loading: analysisLoading, error: analysisError, analyzeCompany } = useCompanyAnalysis()

  const { messages, input, handleInputChange, handleSubmit, append, isLoading } = useChat({
    body: {
      company,
      prompt,
      startDate,
      endDate,
    },
  })

  // Check API connection on component mount
  useEffect(() => {
    const checkApiConnection = async () => {
      try {
        await apiService.healthCheck()
        setApiConnected(true)
      } catch (error) {
        console.error("API connection failed:", error)
        setApiConnected(false)
      }
    }

    checkApiConnection()
  }, [])

  // Send initial analysis request to localhost:5000
  useEffect(() => {
    if (prompt && company && apiConnected) {
      analyzeCompany({
        company,
        prompt: prompt.id,
        startDate,
        endDate,
      }).catch(console.error)
    }
  }, [prompt, company, startDate, endDate, apiConnected, analyzeCompany])

  // Send initial prompt when the component loads
  useEffect(() => {
    if (prompt && messages.length === 0) {
      append({
        role: "user",
        content: `「${prompt.title}」テンプレートに基づいて、${company}の分析を開始してください。`,
      })
    }
  }, [prompt, append, company, messages.length])

  const followUpQuestions = [
    "この会社にとって最大の脅威は何ですか？",
    "どのセールスマーカー製品が最も有益ですか？",
    "最近、競合環境はどのように変化しましたか？",
  ]

  const handleApiQuestion = async (question: string) => {
    try {
      const response = await apiService.sendChatMessage({
        message: question,
        company,
        context: { prompt: prompt?.id, startDate, endDate },
      })

      // Add the response to the chat
      append({
        role: "assistant",
        content: response.message || response.data || "APIからの応答を受信しました。",
      })
    } catch (error) {
      console.error("API request failed:", error)
      append({
        role: "assistant",
        content: "申し訳ございませんが、APIサーバーとの通信でエラーが発生しました。",
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* API Connection Status */}
      {apiConnected === false && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            localhost:5000への接続に失敗しました。APIサーバーが起動していることを確認してください。
          </AlertDescription>
        </Alert>
      )}

      {/* Analysis Data from API */}
      {analysisData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              API分析結果
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-50 p-4 rounded-lg">
              <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(analysisData, null, 2)}</pre>
            </div>
          </CardContent>
        </Card>
      )}

      {analysisLoading && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-600"></div>
              localhost:5000からデータを取得中...
            </div>
          </CardContent>
        </Card>
      )}

      {analysisError && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>API エラー: {analysisError}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">分析コンテキスト</CardTitle>
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${apiConnected ? "bg-green-500" : apiConnected === false ? "bg-red-500" : "bg-yellow-500"}`}
              />
              <span className="text-xs text-slate-500">
                {apiConnected ? "API接続済み" : apiConnected === false ? "API未接続" : "接続確認中"}
              </span>
              <Button variant="outline" size="sm" onClick={onReset}>
                <RefreshCw className="h-4 w-4 mr-2" />
                新規分析
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-slate-500" />
              <span className="font-medium">{company}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-500" />
              <span>{startDate && endDate ? `${startDate}から${endDate}` : "期間が指定されていません"}</span>
            </div>
            <Badge variant="secondary">{prompt?.category}</Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="min-h-[500px] flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI分析
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {messages.map((m) => (
                <div key={m.id} className="flex gap-3">
                  <div className={`p-2 rounded-full h-fit ${m.role === "user" ? "bg-blue-100" : "bg-slate-100"}`}>
                    {m.role === "user" ? (
                      <User className="h-4 w-4 text-blue-600" />
                    ) : (
                      <Bot className="h-4 w-4 text-slate-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{m.role === "user" ? "あなた" : "AIアシスタント"}</p>
                    <div className="prose prose-sm max-w-full text-sm">{m.content}</div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 items-center">
                  <div className="p-2 rounded-full h-fit bg-slate-100">
                    <Bot className="h-4 w-4 text-slate-600 animate-pulse" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">AIアシスタント</p>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-600"></div>
                      思考中...
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
        <div className="p-4 border-t">
          <div className="flex flex-wrap gap-2 mb-4">
            {followUpQuestions.map((q, i) => (
              <Button
                key={i}
                variant="outline"
                size="sm"
                onClick={() => (apiConnected ? handleApiQuestion(q) : append({ role: "user", content: q }))}
                disabled={isLoading}
              >
                {q}
              </Button>
            ))}
          </div>
          <form onSubmit={handleSubmit}>
            <div className="relative">
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder="AIに質問を入力..."
                className="pr-12"
                disabled={isLoading}
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="submit"
                      size="icon"
                      variant="ghost"
                      className="absolute top-1/2 right-1 -translate-y-1/2"
                      disabled={isLoading || !input}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>送信</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </form>
        </div>
      </Card>
    </div>
  )
}
