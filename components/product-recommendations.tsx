"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Star, TrendingUp, Target, BarChart3, ArrowRight } from "lucide-react"

interface ProductRecommendationsProps {
  company: string
}

const salesMarkerProducts = [
  {
    id: "sales-intelligence-pro",
    name: "セールスインテリジェンスプロ",
    category: "営業",
    description: "高度な競合追跡とセールスインテリジェンスプラットフォーム",
    features: ["リアルタイムの競合活動監視", "勝敗分析とインサイト", "販売機会のスコアリング", "競合バトルカード"],
    benefits: ["勝率25%向上", "販売サイクル30%短縮", "競争力のあるポジショニング"],
    pricing: "¥29,900/月/ユーザー",
    matchScore: 95,
    priority: "high",
    icon: Target,
  },
  {
    id: "market-opportunity-scanner",
    name: "市場機会スキャナー",
    category: "戦略",
    description: "未開拓の市場セグメントと成長機会を特定",
    features: ["市場ギャップ分析", "顧客ニーズ評価", "競合環境マッピング", "機会の優先順位付け"],
    benefits: ["新たな収益源の発見", "迅速な市場参入", "戦略的優位性"],
    pricing: "¥19,900/月/ユーザー",
    matchScore: 88,
    priority: "high",
    icon: TrendingUp,
  },
  {
    id: "competitive-pricing-analytics",
    name: "競合価格分析",
    category: "価格設定",
    description: "市場のダイナミクスに基づいて価格戦略を最適化",
    features: ["リアルタイム価格監視", "価格弾力性分析", "競合価格アラート", "収益最適化"],
    benefits: ["利益率15%向上", "動的価格設定能力", "市場対応型価格設定"],
    pricing: "¥14,900/月/ユーザー",
    matchScore: 82,
    priority: "medium",
    icon: BarChart3,
  },
]

const implementationPlan = [
  {
    phase: "フェーズ1 (1-2ヶ月目)",
    title: "基盤設定",
    products: ["セールスインテリジェンスプロ", "市場機会スキャナー"],
    activities: ["初期プラットフォーム設定", "データ統合と競合特定", "チームトレーニング", "ベースライン指標設定"],
  },
  {
    phase: "フェーズ2 (3-4ヶ月目)",
    title: "最適化と拡大",
    products: ["競合価格分析"],
    activities: ["高度な機能の有効化", "プロセス最適化と自動化", "パフォーマンス監視と調整"],
  },
]

export function ProductRecommendations({ company }: ProductRecommendationsProps) {
  const highPriorityProducts = salesMarkerProducts.filter((p) => p.priority === "high")
  const mediumPriorityProducts = salesMarkerProducts.filter((p) => p.priority === "medium")

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            セールスマーカー製品の推奨
          </CardTitle>
          <CardDescription>{company}の競合分析に基づくパーソナライズされた製品推奨</CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="recommendations" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="recommendations">推奨</TabsTrigger>
          <TabsTrigger value="implementation">実装</TabsTrigger>
          <TabsTrigger value="roi">ROI分析</TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations" className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">優先度の高い推奨</h3>
              <Badge className="bg-red-600">重要</Badge>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {highPriorityProducts.map((product) => {
                const IconComponent = product.icon
                return (
                  <Card key={product.id} className="border-red-200 bg-red-50">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-red-600 rounded-lg">
                            <IconComponent className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{product.name}</CardTitle>
                            <Badge variant="secondary">{product.category}</Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">一致スコア</div>
                          <div className="text-2xl font-bold text-red-600">{product.matchScore}%</div>
                        </div>
                      </div>
                      <CardDescription>{product.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h5 className="font-semibold mb-2">主な機能</h5>
                        <ul className="text-sm space-y-1">
                          {product.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <CheckCircle className="h-3 w-3 text-green-600" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div>
                          <div className="text-sm text-slate-600">月額</div>
                          <div className="font-semibold">{product.pricing}</div>
                        </div>
                        <Button className="bg-red-600 hover:bg-red-700">
                          始める
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">中優先度の推奨</h3>
              <Badge className="bg-orange-600">重要</Badge>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mediumPriorityProducts.map((product) => {
                const IconComponent = product.icon
                return (
                  <Card key={product.id} className="border-orange-200 bg-orange-50">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-orange-600 rounded-lg">
                            <IconComponent className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{product.name}</CardTitle>
                            <Badge variant="secondary">{product.category}</Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">一致スコア</div>
                          <div className="text-2xl font-bold text-orange-600">{product.matchScore}%</div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div>
                          <div className="text-sm text-slate-600">月額</div>
                          <div className="font-semibold">{product.pricing}</div>
                        </div>
                        <Button
                          variant="outline"
                          className="border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white bg-transparent"
                        >
                          詳細
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="implementation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>実装ロードマップ</CardTitle>
              <CardDescription>価値を最大化し、混乱を最小限に抑えるための段階的アプローチ</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {implementationPlan.map((phase, index) => (
                <div key={index} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">{phase.phase}</h4>
                      <p className="text-slate-600">{phase.title}</p>
                    </div>
                  </div>
                  <div className="ml-11 space-y-3">
                    <div>
                      <h5 className="font-medium mb-2">推奨製品</h5>
                      <div className="flex flex-wrap gap-2">
                        {phase.products.map((product, productIndex) => (
                          <Badge key={productIndex} variant="outline" className="border-blue-200 text-blue-700">
                            {product}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">主な活動</h5>
                      <ul className="space-y-1">
                        {phase.activities.map((activity, activityIndex) => (
                          <li key={activityIndex} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            {activity}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  {index < implementationPlan.length - 1 && <div className="ml-4 w-0.5 h-8 bg-slate-200"></div>}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roi" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>ROI分析</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>投資概要</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <span className="font-semibold text-blue-800">年間総投資額</span>
                      <span className="font-bold text-blue-600 text-lg">¥776,400</span>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>期待されるリターン</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center p-3 bg-green-100 rounded-lg border border-green-200">
                      <span className="font-semibold text-green-800">年間総リターン</span>
                      <span className="font-bold text-green-600 text-lg">¥2,750,000</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
