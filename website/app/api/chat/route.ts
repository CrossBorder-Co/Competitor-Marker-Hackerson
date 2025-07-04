import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  const { messages, company, prompt, startDate, endDate } = await req.json()

  // Construct a detailed system prompt to guide the AI
  const systemPrompt = `あなたは、企業の競争環境を分析する専門のAIアシスタント「競合マーカー」です。
  提供された情報に基づいて、詳細で実用的な洞察を提供してください。
  回答は常に日本語で、マークダウン形式を使用して構造化してください。
  グラフや表のデータを作成する際は、明確で簡潔な形式を使用してください。`

  // Find the last user message to prepend context
  const lastUserMessageIndex = messages.findLastIndex((m) => m.role === "user")

  if (lastUserMessageIndex !== -1) {
    const originalContent = messages[lastUserMessageIndex].content
    messages[lastUserMessageIndex].content = `
      以下のコンテキストに基づいて回答してください:
      - 分析対象企業: ${company}
      - 分析テンプレート: ${prompt.title}
      - 分析期間: ${startDate && endDate ? `${startDate}から${endDate}` : "指定なし"}
      ---
      ユーザーの質問: ${originalContent}
      `
  }

  const result = await streamText({
    model: openai("gpt-4o"),
    system: systemPrompt,
    messages,
  })

  return result.toAIStreamResponse()
}
