"use client"

import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, TrendingDown, AlertTriangle, Target, Users } from "lucide-react"
import { useCompetitorData, useMarketInsights } from "@/hooks/use-api"

interface CompetitorAnalysisProps {
  company: string
  startDate: string
  endDate: string
}

const marketShareData = [
  { name: "Q1", company: 35, competitor1: 25, competitor2: 20, others: 20 },
  { name: "Q2", company: 37, competitor1: 24, competitor2: 19, others: 20 },
  { name: "Q3", company: 39, competitor1: 23, competitor2: 18, others: 20 },
  { name: "Q4", company: 41, competitor1: 22, competitor2: 17, others: 20 },
]

const competitiveMetrics = [
  { name: "ブランド認知度", value: 85, change: 5 },
  { name: "顧客満足度", value: 78, change: -2 },
  { name: "市場シェア", value: 41, change: 6 },
  { name: "イノベーション指数", value: 72, change: 8 },
]

const threatMatrix = [
  { threat: "新規参入者", impact: "高", probability: "中", severity: 75 },
  { threat: "価格競争", impact: "中", probability: "高", severity: 60 },
  { threat: "技術革新", impact: "高", probability: "低", severity: 45 },
  { threat: "規制変更", impact: "中", probability: "中", severity: 40 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

export function CompetitorAnalysis({ company, startDate, endDate }: CompetitorAnalysisProps) {
  const { data: competitorData, loading: competitorLoading, fetchCompetitorData } = useCompetitorData()
  const { data: marketData, loading: marketLoading, fetchMarketInsights } = useMarketInsights()

  useEffect(() => {
    if (company) {
      fetchCompetitorData(company).catch(console.error)
      fetchMarketInsights({
        company,
        industry: "technology", // This could be dynamic based on company
        region: "global",
      }).catch(console.error)
    }
  }, [company, fetchCompetitorData, fetchMarketInsights])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            競合インテリジェンスダッシュボード
          </CardTitle>
          <CardDescription>{company}の競合上の地位に関する包括的な分析</CardDescription>
        </CardHeader>
      </Card>

      {/* API Data Display */}
      {competitorData && (
        <Card>
          <CardHeader>
            <CardTitle>API競合データ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-50 p-4 rounded-lg">
              <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(competitorData, null, 2)}</pre>
            </div>
          </CardContent>
        </Card>
      )}

      {marketData && (
        <Card>
          <CardHeader>
            <CardTitle>API市場インサイト</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-50 p-4 rounded-lg">
              <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(marketData, null, 2)}</pre>
            </div>
          </CardContent>
        </Card>
      )}

      {(competitorLoading || marketLoading) && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-600"></div>
              localhost:5000から競合データを取得中...
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">概要</TabsTrigger>
          <TabsTrigger value="market-share">市場シェア</TabsTrigger>
          <TabsTrigger value="threats">脅威分析</TabsTrigger>
          <TabsTrigger value="opportunities">機会</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {competitiveMetrics.map((metric) => (
              <Card key={metric.name}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{metric.name}</span>
                    <div className="flex items-center gap-1">
                      {metric.change > 0 ? (
                        <TrendingUp className="h-3 w-3 text-green-500" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-500" />
                      )}
                      <span className={`text-xs ${metric.change > 0 ? "text-green-500" : "text-red-500"}`}>
                        {metric.change > 0 ? "+" : ""}
                        {metric.change}%
                      </span>
                    </div>
                  </div>
                  <div className="text-2xl font-bold mb-2">{metric.value}%</div>
                  <Progress value={metric.value} className="h-2" />
                  <span className="text-xs text-slate-500 mt-1">前期比</span>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">競争上の強み</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-sm">強力なブランド認知度</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-sm">革新的な製品ポートフォリオ</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-sm">確立された流通チャネル</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-sm">高い顧客ロイヤルティ</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">改善領域</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                    <span className="text-sm">価格競争力の向上</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                    <span className="text-sm">新興市場への参入</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                    <span className="text-sm">デジタル変革の加速</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                    <span className="text-sm">サステナビリティ戦略</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="market-share" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>市場シェアの動向</CardTitle>
              <CardDescription>6ヶ月間の市場シェアの推移</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={marketShareData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="company" stroke="#2563eb" strokeWidth={2} name={company} />
                  <Line type="monotone" dataKey="competitor1" stroke="#dc2626" strokeWidth={2} name="競合他社A" />
                  <Line type="monotone" dataKey="competitor2" stroke="#16a34a" strokeWidth={2} name="競合他社B" />
                  <Line type="monotone" dataKey="others" stroke="#ca8a04" strokeWidth={2} name="その他" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>現在の市場ポジション</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: company, value: 41 },
                        { name: "競合他社A", value: 22 },
                        { name: "競合他社B", value: 17 },
                        { name: "その他", value: 20 },
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label
                    >
                      {marketShareData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>競合指標</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">市場リーダーシップ</span>
                  <Badge variant="secondary">1位</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">成長率</span>
                  <span className="text-sm font-medium text-green-600">+6.2%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">競合優位性</span>
                  <Badge>強い</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">市場集中度</span>
                  <span className="text-sm">中程度</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="threats" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                脅威評価マトリックス
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {threatMatrix.map((threat) => (
                  <div key={threat.threat} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{threat.threat}</h4>
                      <div className="flex gap-2">
                        <Badge variant={threat.impact === "高" ? "destructive" : "secondary"}>
                          影響: {threat.impact}
                        </Badge>
                        <Badge variant={threat.probability === "高" ? "destructive" : "secondary"}>
                          確率: {threat.probability}
                        </Badge>
                      </div>
                    </div>
                    <Progress value={threat.severity} className="h-2" />
                    <span className="text-xs text-slate-500">脅威レベル: {threat.severity}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>優先度の高い脅威</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
                    <div>
                      <div className="font-medium text-sm">新規参入者の台頭</div>
                      <div className="text-xs text-slate-600">資金豊富なスタートアップによる市場参入</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />
                    <div>
                      <div className="font-medium text-sm">価格競争の激化</div>
                      <div className="text-xs text-slate-600">既存競合他社による積極的な価格戦略</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                    <div>
                      <div className="font-medium text-sm">技術革新の遅れ</div>
                      <div className="text-xs text-slate-600">AI・自動化技術への対応不足</div>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>緩和戦略</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                    <div>
                      <div className="font-medium text-sm">イノベーション投資の拡大</div>
                      <div className="text-xs text-slate-600">R&D予算を20%増加</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                    <div>
                      <div className="font-medium text-sm">戦略的パートナーシップ</div>
                      <div className="text-xs text-slate-600">技術企業との提携強化</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                    <div>
                      <div className="font-medium text-sm">顧客ロイヤルティ強化</div>
                      <div className="text-xs text-slate-600">カスタマーサクセス投資</div>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="opportunities" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  市場機会
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                    <div>
                      <div className="font-medium text-sm">新興市場への拡大</div>
                      <div className="text-xs text-slate-600">アジア太平洋地域での成長機会</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                    <div>
                      <div className="font-medium text-sm">デジタル変革サービス</div>
                      <div className="text-xs text-slate-600">企業のDX支援需要の増加</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                    <div>
                      <div className="font-medium text-sm">サステナビリティ市場</div>
                      <div className="text-xs text-slate-600">環境配慮型製品への需要拡大</div>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  戦略的推奨事項
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2" />
                    <div>
                      <div className="font-medium text-sm">M&A戦略の検討</div>
                      <div className="text-xs text-slate-600">技術力強化のための買収</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2" />
                    <div>
                      <div className="font-medium text-sm">プラットフォーム戦略</div>
                      <div className="text-xs text-slate-600">エコシステム構築による差別化</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2" />
                    <div>
                      <div className="font-medium text-sm">人材投資の拡大</div>
                      <div className="text-xs text-slate-600">AI・データサイエンス人材の確保</div>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>実装ロードマップ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <div className="font-medium text-sm">短期（3-6ヶ月）</div>
                  <div className="text-xs text-slate-600">競合分析システムの導入、価格戦略の見直し</div>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <div className="font-medium text-sm">中期（6-12ヶ月）</div>
                  <div className="text-xs text-slate-600">新市場参入、戦略的パートナーシップの構築</div>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <div className="font-medium text-sm">長期（12ヶ月以上）</div>
                  <div className="text-xs text-slate-600">M&A実行、プラットフォーム戦略の展開</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
