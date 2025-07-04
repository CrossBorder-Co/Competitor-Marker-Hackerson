"use client"

import { useEffect } from "react"
import { useChat } from "ai/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, User, RefreshCw, Calendar, Building, Send } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ChatInterfaceProps {
  company: string
  prompt: { id: string; title: string; description: string; category: string } | undefined
  startDate: string
  endDate: string
  onReset: () => void
}

export function ChatInterface({ company, prompt, startDate, endDate, onReset }: ChatInterfaceProps) {
  const { messages, input, handleInputChange, handleSubmit, append, isLoading } = useChat({
    body: {
      company,
      prompt,
      startDate,
      endDate,
    },
  })

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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">分析コンテキスト</CardTitle>
            <Button variant="outline" size="sm" onClick={onReset}>
              <RefreshCw className="h-4 w-4 mr-2" />
              新規分析
            </Button>
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
                onClick={() => append({ role: "user", content: q })}
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
