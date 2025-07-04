"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown, Minus, Users, DollarSign, Target, Zap } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"

interface CompetitorAnalysisProps {
  company: string
  startDate: string
  endDate: string
}

const marketShareData = [
  { month: "1月", company: 35, competitor1: 25, competitor2: 20, others: 20 },
  { month: "2月", company: 37, competitor1: 24, competitor2: 19, others: 20 },
  { month: "3月", company: 36, competitor1: 26, competitor2: 18, others: 20 },
  { month: "4月", company: 38, competitor1: 25, competitor2: 17, others: 20 },
  { month: "5月", company: 40, competitor1: 24, competitor2: 16, others: 20 },
  { month: "6月", company: 39, competitor1: 25, competitor2: 16, others: 20 },
]

const competitorMetrics = [
  { name: "市場シェア", value: 39, change: 4, trend: "up" },
  { name: "ブランドセンチメント", value: 78, change: -2, trend: "down" },
  { name: "イノベーション指数", value: 85, change: 8, trend: "up" },
  { name: "顧客満足度", value: 82, change: 0, trend: "stable" },
]

const threatLevels = [
  { name: "直接の競合", value: 75, color: "#ef4444" },
  { name: "新規参入者", value: 45, color: "#f97316" },
  { name: "代替品", value: 30, color: "#eab308" },
  { name: "サプライヤー", value: 20, color: "#22c55e" },
]

const COLORS = ["#3b82f6", "#ef4444", "#f97316", "#22c55e", "#8b5cf6"]

export function CompetitorAnalysis({ company, startDate, endDate }: CompetitorAnalysisProps) {
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

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">概要</TabsTrigger>
          <TabsTrigger value="market-share">市場シェア</TabsTrigger>
          <TabsTrigger value="threats">脅威分析</TabsTrigger>
          <TabsTrigger value="opportunities">機会</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {competitorMetrics.map((metric) => (
              <Card key={metric.name}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">{metric.name}</p>
                      <p className="text-2xl font-bold">{metric.value}%</p>
                    </div>
                    <div
                      className={`p-2 rounded-full ${
                        metric.trend === "up" ? "bg-green-100" : metric.trend === "down" ? "bg-red-100" : "bg-slate-100"
                      }`}
                    >
                      {metric.trend === "up" ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : metric.trend === "down" ? (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      ) : (
                        <Minus className="h-4 w-4 text-slate-600" />
                      )}
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge
                      variant={
                        metric.trend === "up" ? "default" : metric.trend === "down" ? "destructive" : "secondary"
                      }
                    >
                      {metric.change > 0 ? "+" : ""}
                      {metric.change}%
                    </Badge>
                    <span className="text-xs text-slate-500">前期比</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>競争上の強み</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>ブランド認知度</span>
                      <span>92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>製品品質</span>
                      <span>88%</span>
                    </div>
                    <Progress value={88} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>顧客サービス</span>
                      <span>85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>イノベーション</span>
                      <span>79%</span>
                    </div>
                    <Progress value={79} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>改善領域</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>価格競争力</span>
                      <span>65%</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>市場の俊敏性</span>
                      <span>58%</span>
                    </div>
                    <Progress value={58} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>デジタルプレゼンス</span>
                      <span>72%</span>
                    </div>
                    <Progress value={72} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>パートナーシップネットワーク</span>
                      <span>61%</span>
                    </div>
                    <Progress value={61} className="h-2" />
                  </div>
                </div>
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
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="company" stroke="#3b82f6" strokeWidth={3} name={company} />
                  <Line type="monotone" dataKey="competitor1" stroke="#ef4444" strokeWidth={2} name="競合A" />
                  <Line type="monotone" dataKey="competitor2" stroke="#f97316" strokeWidth={2} name="競合B" />
                  <Line type="monotone" dataKey="others" stroke="#6b7280" strokeWidth={2} name="その他" />
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
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: company, value: 39 },
                        { name: "競合A", value: 25 },
                        { name: "競合B", value: 16 },
                        { name: "その他", value: 20 },
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {[0, 1, 2, 3].map((entry, index) => (
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
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">マーケットリーダー</span>
                  </div>
                  <Badge className="bg-blue-600">{company}</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="font-medium">成長率</span>
                  </div>
                  <span className="font-semibold text-green-600">+12.5%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-slate-600" />
                    <span className="font-medium">収益シェア</span>
                  </div>
                  <span className="font-semibold">$2.1B</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="threats" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>脅威評価マトリックス</CardTitle>
              <CardDescription>カテゴリ別の競合脅威の分析</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={threatLevels} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="name" type="category" width={120} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">優先度の高い脅威</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                  <h4 className="font-semibold text-red-800">競合A - 積極的な価格設定</h4>
                  <p className="text-sm text-red-700 mt-1">主要製品で20%の価格引き下げ、主要顧客をターゲットに</p>
                  <Badge variant="destructive" className="mt-2">
                    重大
                  </Badge>
                </div>
                <div className="p-4 border border-orange-200 rounded-lg bg-orange-50">
                  <h4 className="font-semibold text-orange-800">新規参入者 - TechCorp</h4>
                  <p className="text-sm text-orange-700 mt-1">
                    革新的なAI搭載ソリューションを持つ資金豊富なスタートアップ
                  </p>
                  <Badge variant="secondary" className="mt-2 bg-orange-200">
                    高
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>緩和戦略</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                  <h4 className="font-semibold text-green-800">価値提案の強化</h4>
                  <p className="text-sm text-green-700 mt-1">独自の機能と優れた顧客サービスに焦点を当てる</p>
                </div>
                <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                  <h4 className="font-semibold text-blue-800">イノベーションへの投資</h4>
                  <p className="text-sm text-blue-700 mt-1">研究開発と製品開発イニシアチブを加速する</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="opportunities" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  市場機会
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                  <h4 className="font-semibold text-green-800">SMB市場の拡大</h4>
                  <p className="text-sm text-green-700 mt-1">
                    40%の成長可能性を持つ、サービスが不十分な中小企業セグメント
                  </p>
                </div>
                <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                  <h4 className="font-semibold text-blue-800">国際市場</h4>
                  <p className="text-sm text-blue-700 mt-1">アジア太平洋地域で当社のソリューションに対する強い需要</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>戦略的推奨事項</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      1
                    </div>
                    <div>
                      <h5 className="font-semibold">SMB向けGTMの加速</h5>
                      <p className="text-sm text-slate-600">中小企業向けの簡素化された製品層を立ち上げる</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      2
                    </div>
                    <div>
                      <h5 className="font-semibold">AI能力への投資</h5>
                      <p className="text-sm text-slate-600">競争力を維持するためにAI搭載機能を開発する</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
