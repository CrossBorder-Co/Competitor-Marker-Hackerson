import type { Company } from '../models/Company.js';

export interface ICompanyRepository {
  findById(id: string): Promise<Company | null>;
  findByName(name: string): Promise<Company | null>;
  getCompetitors(companyId: string): Promise<string[]>;
}
