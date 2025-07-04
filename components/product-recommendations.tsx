"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, TrendingUp, DollarSign, Clock, CheckCircle, ArrowRight } from "lucide-react"

interface ProductRecommendationsProps {
  company: string
}

const recommendations = [
  {
    id: "sales-intelligence-pro",
    name: "セールスインテリジェンスプロ",
    description: "競合他社の販売活動と勝敗パターンを追跡",
    category: "セールス",
    priority: "高",
    matchScore: 95,
    pricing: "月額 ¥89,000",
    features: ["リアルタイム競合追跡", "勝敗分析レポート", "セールスバトルカード", "パイプライン予測"],
    benefits: ["勝率15-25%向上", "販売サイクル20%短縮", "競合情報の一元化"],
    implementation: "2-4週間",
  },
  {
    id: "market-opportunity-scanner",
    name: "市場機会スキャナー",
    description: "未開拓の市場セグメントと顧客ニーズを特定",
    category: "マーケティング",
    priority: "高",
    matchScore: 88,
    pricing: "月額 ¥67,000",
    features: ["市場ギャップ分析", "顧客セグメンテーション", "需要予測モデル", "競合ポジショニング"],
    benefits: ["新規市場発見", "マーケティングROI向上", "戦略的意思決定支援"],
    implementation: "3-6週間",
  },
  {
    id: "competitive-pricing-analytics",
    name: "競合価格分析",
    description: "市場のダイナミクスに基づいて価格戦略を最適化",
    category: "戦略",
    priority: "中",
    matchScore: 82,
    pricing: "月額 ¥45,000",
    features: ["動的価格監視", "価格弾力性分析", "収益最適化", "競合価格アラート"],
    benefits: ["利益率10-15%改善", "価格競争力強化", "収益予測精度向上"],
    implementation: "1-3週間",
  },
  {
    id: "customer-journey-mapper",
    name: "カスタマージャーニーマッパー",
    description: "顧客が代替案をどのように評価するかを理解",
    category: "カスタマーエクスペリエンス",
    priority: "中",
    matchScore: 75,
    pricing: "月額 ¥38,000",
    features: ["ジャーニー可視化", "タッチポイント分析", "コンバージョン最適化", "顧客行動予測"],
    benefits: ["顧客体験向上", "コンバージョン率改善", "チャーン率削減"],
    implementation: "2-4週間",
  },
  {
    id: "sales-enablement-suite",
    name: "セールスイネーブルメントスイート",
    description: "営業チームに競合バトルカードを提供",
    category: "セールス",
    priority: "低",
    matchScore: 68,
    pricing: "月額 ¥29,000",
    features: ["バトルカード自動生成", "セールス資料管理", "トレーニングコンテンツ", "パフォーマンス追跡"],
    benefits: ["営業効率向上", "一貫したメッセージング", "新人研修期間短縮"],
    implementation: "1-2週間",
  },
  {
    id: "pipeline-forecasting",
    name: "パイプライン予測",
    description: "市場シェアの変化と収益への影響を予測",
    category: "分析",
    priority: "低",
    matchScore: 62,
    pricing: "月額 ¥34,000",
    features: ["AI予測モデル", "シナリオ分析", "リスク評価", "パフォーマンス指標"],
    benefits: ["予測精度向上", "リスク管理強化", "戦略的計画支援"],
    implementation: "3-5週間",
  },
]

const implementationPhases = [
  {
    phase: "フェーズ1（1-3ヶ月）",
    title: "基盤構築",
    products: ["セールスインテリジェンスプロ", "競合価格分析"],
    investment: "¥134,000/月",
    expectedROI: "150-200%",
  },
  {
    phase: "フェーズ2（3-6ヶ月）",
    title: "機能拡張",
    products: ["市場機会スキャナー", "カスタマージャーニーマッパー"],
    investment: "¥105,000/月",
    expectedROI: "200-250%",
  },
  {
    phase: "フェーズ3（6-12ヶ月）",
    title: "最適化",
    products: ["セールスイネーブルメントスイート", "パイプライン予測"],
    investment: "¥63,000/月",
    expectedROI: "250-300%",
  },
]

const successMetrics = [
  { metric: "勝率向上", target: "15-25%", timeline: "3ヶ月" },
  { metric: "販売サイクル短縮", target: "20-30%", timeline: "6ヶ月" },
  { metric: "平均取引額増加", target: "10-15%", timeline: "6ヶ月" },
  { metric: "市場シェア拡大", target: "5-8%", timeline: "12ヶ月" },
  { metric: "顧客満足度向上", target: "10-15%", timeline: "9ヶ月" },
  { metric: "営業効率改善", target: "25-35%", timeline: "6ヶ月" },
]

export function ProductRecommendations({ company }: ProductRecommendationsProps) {
  const highPriorityProducts = recommendations.filter((r) => r.priority === "高")
  const mediumPriorityProducts = recommendations.filter((r) => r.priority === "中")
  const lowPriorityProducts = recommendations.filter((r) => r.priority === "低")

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "高":
        return "destructive"
      case "中":
        return "default"
      case "低":
        return "secondary"
      default:
        return "default"
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "高":
        return "重要"
      case "中":
        return "重要"
      case "低":
        return "任意"
      default:
        return "任意"
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
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
          {/* High Priority Recommendations */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">優先度の高い推奨</h3>
              <Badge variant="destructive">重要</Badge>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {highPriorityProducts.map((product) => (
                <Card key={product.id} className="border-red-200">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{product.name}</CardTitle>
                        <CardDescription className="mt-1">{product.description}</CardDescription>
                      </div>
                      <Badge variant={getPriorityColor(product.priority)}>{getPriorityLabel(product.priority)}</Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-600">一致スコア</span>
                        <div className="flex items-center gap-1">
                          <Progress value={product.matchScore} className="w-16 h-2" />
                          <span className="text-sm font-medium">{product.matchScore}%</span>
                        </div>
                      </div>
                      <Badge variant="outline">{product.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm mb-2">主な機能</h4>
                      <ul className="text-sm text-slate-600 space-y-1">
                        {product.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm mb-2">期待されるメリット</h4>
                      <ul className="text-sm text-slate-600 space-y-1">
                        {product.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <TrendingUp className="h-3 w-3 text-blue-500" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-slate-500" />
                          <span className="text-sm font-medium">{product.pricing}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-slate-500" />
                          <span className="text-sm">{product.implementation}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          詳細
                        </Button>
                        <Button size="sm">始める</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Medium Priority Recommendations */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">中優先度の推奨</h3>
              <Badge>重要</Badge>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mediumPriorityProducts.map((product) => (
                <Card key={product.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{product.name}</CardTitle>
                        <CardDescription className="mt-1">{product.description}</CardDescription>
                      </div>
                      <Badge variant={getPriorityColor(product.priority)}>{getPriorityLabel(product.priority)}</Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-600">一致スコア</span>
                        <div className="flex items-center gap-1">
                          <Progress value={product.matchScore} className="w-16 h-2" />
                          <span className="text-sm font-medium">{product.matchScore}%</span>
                        </div>
                      </div>
                      <Badge variant="outline">{product.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm mb-2">主な機能</h4>
                      <ul className="text-sm text-slate-600 space-y-1">
                        {product.features.slice(0, 3).map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-slate-500" />
                          <span className="text-sm font-medium">{product.pricing}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-slate-500" />
                          <span className="text-sm">{product.implementation}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          詳細
                        </Button>
                        <Button variant="outline" size="sm">
                          始める
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Low Priority Recommendations */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">追加の推奨</h3>
              <Badge variant="secondary">任意</Badge>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {lowPriorityProducts.map((product) => (
                <Card key={product.id} className="opacity-75">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{product.name}</CardTitle>
                        <CardDescription className="mt-1">{product.description}</CardDescription>
                      </div>
                      <Badge variant={getPriorityColor(product.priority)}>{getPriorityLabel(product.priority)}</Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-600">一致スコア</span>
                        <div className="flex items-center gap-1">
                          <Progress value={product.matchScore} className="w-16 h-2" />
                          <span className="text-sm font-medium">{product.matchScore}%</span>
                        </div>
                      </div>
                      <Badge variant="outline">{product.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between pt-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-slate-500" />
                          <span className="text-sm font-medium">{product.pricing}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-slate-500" />
                          <span className="text-sm">{product.implementation}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        詳細を見る
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="implementation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>実装ロードマップ</CardTitle>
              <CardDescription>価値を最大化し、混乱を最小限に抑えるための段階的アプローチ</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {implementationPhases.map((phase, index) => (
                  <div key={index} className="border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{phase.phase}</h3>
                        <p className="text-slate-600">{phase.title}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-slate-600">期待ROI</div>
                        <div className="font-semibold">{phase.expectedROI}</div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium mb-2">含まれる製品</h4>
                        <div className="flex flex-wrap gap-2">
                          {phase.products.map((product, productIndex) => (
                            <Badge key={productIndex} variant="outline">
                              {product}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-slate-500" />
                          <span className="font-medium">投資額: {phase.investment}</span>
                        </div>
                        {index < implementationPhases.length - 1 && <ArrowRight className="h-4 w-4 text-slate-400" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>成功指標とKPI</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {successMetrics.map((metric, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="font-medium text-sm mb-2">{metric.metric}</div>
                    <div className="text-2xl font-bold text-green-600 mb-1">{metric.target}</div>
                    <div className="text-xs text-slate-500">目標期間: {metric.timeline}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roi" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>投資概要</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">初期投資（年間）</span>
                  <span className="font-semibold">¥3,624,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">実装コスト</span>
                  <span className="font-semibold">¥500,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">トレーニング費用</span>
                  <span className="font-semibold">¥200,000</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">総投資額（初年度）</span>
                    <span className="font-bold text-lg">¥4,324,000</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>期待されるリターン</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">売上増加</span>
                  <span className="font-semibold text-green-600">¥8,500,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">コスト削減</span>
                  <span className="font-semibold text-green-600">¥2,100,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">効率性向上</span>
                  <span className="font-semibold text-green-600">¥1,800,000</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">総リターン（初年度）</span>
                    <span className="font-bold text-lg text-green-600">¥12,400,000</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>ROI分析</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">187%</div>
                  <div className="text-sm text-slate-600">初年度ROI</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">3.2ヶ月</div>
                  <div className="text-sm text-slate-600">投資回収期間</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">¥8.1M</div>
                  <div className="text-sm text-slate-600">純利益（初年度）</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>リスク評価</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">実装リスク</span>
                  <Badge variant="secondary">低</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">技術リスク</span>
                  <Badge variant="secondary">低</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">市場リスク</span>
                  <Badge>中</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">競合リスク</span>
                  <Badge>中</Badge>
                </div>
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">総合リスクレベル</span>
                    <Badge variant="secondary">低-中</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
