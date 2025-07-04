import type { ICompanyRepository } from '../domain/interfaces/ICompanyRepository.js';
import type { Company } from '../domain/models/Company.js';

export class InMemoryCompanyRepository implements ICompanyRepository {
  private companies: Map<string, Company> = new Map();

  constructor() {
    // Initialize with sample data
    this.seedData();
  }

  async findById(id: string): Promise<Company | null> {
    return this.companies.get(id) || null;
  }

  async findByName(name: string): Promise<Company | null> {
    for (const company of this.companies.values()) {
      if (company.name === name) {
        return company;
      }
    }
    return null;
  }

  async findByKeyword(keyword: string): Promise<Company | null> {
    // First try to find by ID
    const companyById = await this.findById(keyword);
    if (companyById) {
      return companyById;
    }

    // Then try to find by name
    return await this.findByName(keyword);
  }

  async getCompetitors(companyId: string): Promise<string[]> {
    const company = await this.findById(companyId);
    return company?.recommendationKeywords || [];
  }

  private seedData() {
    // Sample data from the user's request
    const sampleCompanies: Company[] = [
      {
        id: "9700150093632",
        name: "イチゴイチエ・コンサルティング・インコーポレーテッド",
        keywords: [
          "フィリピン人材特化コンサルティング",
          "特定技能人材コンサルティングサービス",
          "技術・人文・国際人材コンサルティングサービス",
          "インターンシップ・留学生コンサルティング",
          "技能実習生介護職コンサルティングサービス",
          "MWO申請サポートサービス",
          "オリジナル日本語教育プログラム",
          "KANJI LOOK AND LEARNアプリ",
          "ミキシングメソッド（従来型教育×直接教授法×漢字アプリ×コーチング）"
        ],
        recommendationKeywords: [
          "株式会社ミネルバ",
          "フジ技研株式会社",
          "Ｚｅｎｋｅｎ株式会社",
          "株式会社ＥＮＥＸコンサルティング",
          "Ｍ'ｓＨＲ社会保険労務士法人",
          "Ｍ'ｓＨＲ株式会社",
          "株式会社リアン",
          "株式会社Ｓａｋｕｌａ",
          "ひろせ税理士法人",
          "株式会社グローカル",
          "株式会社ポテンシャライト",
          "株式会社ＨＲｔｅａｍ",
          "Ａｃｒｏｆｏｒｃｅ株式会社",
          "株式会社ＷＩＬＬＣＯ",
          "株式会社ＬＵＳＨＥＲＡ",
          "株式会社トータルスタッフ",
          "株式会社キャリアエイト",
          "株式会社アルタ",
          "株式会社ライトワークデザイン",
          "株式会社キャリアリテイリング",
          "Ｈｉｔ Ｒｏｌｅ株式会社",
          "株式会社キャリアアシストシステムズ",
          "株式会社ＡＯＡ",
          "株式会社Ｔａｌｅｎｃｏ",
          "株式会社大江戸コンサルタント"
        ]
      },
      {
        id: "9700150084994",
        name: "台湾中小企業銀行股份有限公司",
        keywords: [
          "中小企業向け金融サービス",
          "商業銀行業務",
          "中小企業融資",
          "台湾無尽の伝統",
          "民営化銀行",
          "中小企業支援",
          "企業金融ソリューション",
          "台湾市場特化",
          "地域経済活性化",
          "企業資金調達"
        ],
        recommendationKeywords: [
          "楽天カード株式会社",
          "株式会社北洋銀行",
          "西京信用金庫",
          "株式会社西京銀行",
          "株式会社福邦銀行",
          "株式会社神奈川銀行",
          "株式会社四国銀行",
          "株式会社日本政策金融公庫",
          "アイクレジット株式会社",
          "株式会社佐賀共栄銀行",
          "京都中央信用金庫",
          "株式会社宮崎太陽銀行",
          "株式会社トマト銀行",
          "税理士法人みやま会計事務所",
          "観音寺信用金庫",
          "株式会社東日本銀行",
          "多摩信用金庫",
          "ファミリア税理士法人",
          "株式会社富山第一銀行",
          "遠州信用金庫",
          "株式会社商工組合中央金庫",
          "たいこうカード株式会社",
          "中国工商銀行股份有限公司",
          "株式会社池田泉州銀行",
          "株式会社大東銀行"
        ]
      }
    ];

    sampleCompanies.forEach(company => {
      this.companies.set(company.id, company);
    });
  }
}