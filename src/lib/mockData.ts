import { User, Payment, Loan, Giveaway, ShareTransaction, GroupStats, MonthlyData } from '@/types';
import { calculateShares, calculatePenalty, calculateDaysLate } from './utils';

// Mock Users with share-based equity
export const mockUsers: User[] = [
  // Production-ready: Start with empty array, data will be loaded from database
];

export const mockPayments: Payment[] = [
  // Production-ready: Start with empty array, payments will be loaded from database
];

// Mock Loans with 100% coverage requirement
export const mockLoans: Loan[] = [
  // Production-ready: Start with empty array, loans will be loaded from database
];

// Mock Share Transactions
export const mockTransactions: ShareTransaction[] = [
  // Production-ready: Start with empty array, transactions will be loaded from database
];

// Mock Giveaways
export const mockGiveaways: Giveaway[] = [
  // Production-ready: Start with empty array, giveaways will be loaded from database
];

// Mock Shares Data
export interface ShareRecord {
  id: string;
  memberId: string;
  memberName: string;
  shareName: string;
  shareValue: number;
  totalAssigned: number;
  sharesCount: number;
  status: 'active' | 'pending' | 'suspended';
  date: string;
}

export const mockShares: ShareRecord[] = [
  // Production-ready: Start with empty array, shares will be loaded from database
];

// Mock Guarantor Records
export interface GuarantorRecord {
  id: string;
  borrowerId: string;
  borrowerName: string;
  guarantorId: string;
  guarantorName: string;
  coverageAmount: number;
  loanAmount: number;
  status: 'pending' | 'accepted' | 'rejected' | 'on_hold';
  date: string;
  loanId: string;
}

export const mockGuarantors: GuarantorRecord[] = [
  // Production-ready: Start with empty array, guarantors will be loaded from database
];

// Mock Group Stats
export const mockGroupStats: GroupStats = {
  totalMembers: 0,
  activeMembers: 0,
  totalShares: 0,
  totalValue: 0,
  sharePrice: 2000,
  monthlyContributions: 0,
  activeLoans: 0,
  totalLoansIssued: 0,
  pendingVerifications: 0,
  totalPenalties: 0,
  averageShares: 0,
  giveawayPool: 0,
};

// Mock Monthly Data
export const mockMonthlyData: MonthlyData[] = [
  // Production-ready: Start with empty array, monthly data will be loaded from database
];
