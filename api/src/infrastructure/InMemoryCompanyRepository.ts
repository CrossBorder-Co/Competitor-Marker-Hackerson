import { readFileSync } from 'fs';
import type { ICompanyRepository } from '../domain/interfaces/ICompanyRepository.js';
import type { Company } from '../domain/models/Company.js';
import { join, resolve } from "path";

interface CompanyDto {
  company_id: string;
  company_name: string;
  company_keywords: string[],
  recommendation_keywords: string[],
}

export class InMemoryCompanyRepository implements ICompanyRepository {
  private companies: Map<string, Company> = new Map();
  private revenueRanges: Record<string, string> = {};

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
    const dn = resolve(__dirname);
    const sampleCompanies: CompanyDto[] = JSON.parse(readFileSync(join(dn,"comapnies.json")).toString());
    const revenues: Record<string, string> = JSON.parse(readFileSync(join(dn,"revenues.json")).toString());

    sampleCompanies.forEach(company => {
      this.companies.set(company.company_id, {
        id: company.company_id,
        name: company.company_name,
        keywords: company.company_keywords,
        recommendationKeywords: company.recommendation_keywords,
      });
    });
    this.revenueRanges = revenues;
  }
}
