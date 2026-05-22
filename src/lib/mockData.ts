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
  {
    id: 'LOAN-001',
    borrowerId: 'user-001',
    borrowerName: 'Jean Baptiste',
    borrowerSavings: 500000,
    guarantorId: 'user-002',
    guarantorName: 'Marie Claire',
    guarantorSavings: 750000,
    amount: 800000,
    monthlyPayment: 80000,
    totalRepayment: 960000,
    duration: 12,
    status: 'approved',
    date: '2024-01-15',
    combinedSavings: 1250000,
    coveragePercentage: 156,
    interestRate: 5,
    guarantorAccepted: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'LOAN-002',
    borrowerId: 'user-003',
    borrowerName: 'Eric Habimana',
    borrowerSavings: 600000,
    guarantorId: 'user-004',
    guarantorName: 'Patrick Nkunda',
    guarantorSavings: 850000,
    amount: 1200000,
    monthlyPayment: 100000,
    totalRepayment: 1440000,
    duration: 12,
    status: 'pending',
    date: '2024-02-10',
    combinedSavings: 1450000,
    coveragePercentage: 121,
    interestRate: 5,
    guarantorAccepted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'LOAN-003',
    borrowerId: 'user-005',
    borrowerName: 'Grace Uwera',
    borrowerSavings: 450000,
    guarantorId: 'user-006',
    guarantorName: 'David Mugisha',
    guarantorSavings: 900000,
    amount: 600000,
    monthlyPayment: 60000,
    totalRepayment: 720000,
    duration: 12,
    status: 'approved',
    date: '2024-02-20',
    combinedSavings: 1350000,
    coveragePercentage: 225,
    interestRate: 5,
    guarantorAccepted: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'LOAN-004',
    borrowerId: 'user-007',
    borrowerName: 'Robert Nkosi',
    borrowerSavings: 700000,
    guarantorId: 'user-008',
    guarantorName: 'Christine Kwame',
    guarantorSavings: 650000,
    amount: 950000,
    monthlyPayment: 95000,
    totalRepayment: 1140000,
    duration: 12,
    status: 'pending',
    date: '2024-03-05',
    combinedSavings: 1350000,
    coveragePercentage: 142,
    interestRate: 5,
    guarantorAccepted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'LOAN-005',
    borrowerId: 'user-009',
    borrowerName: 'Susan Mwangi',
    borrowerSavings: 550000,
    guarantorId: 'user-010',
    guarantorName: 'John Omondi',
    guarantorSavings: 800000,
    amount: 700000,
    monthlyPayment: 70000,
    totalRepayment: 840000,
    duration: 12,
    status: 'approved',
    date: '2024-03-12',
    combinedSavings: 1350000,
    coveragePercentage: 193,
    interestRate: 5,
    guarantorAccepted: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
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
  guarantorName: string;
  guarantorEmail: string;
  guarantorPhone: string;
  guarantorSavings: number;
  borrowerName: string;
  borrowerEmail: string;
  borrowerPhone: string;
  borrowerSavings: number;
  loanAmount: number;
  coverage: string;
  combinedSavings: number;
  date: string;
  status: string;
}

export const mockGuarantors: GuarantorRecord[] = [
  {
    id: 'GAR-001',
    guarantorName: 'Marie Claire',
    guarantorEmail: 'marie.claire@rosca.com',
    guarantorPhone: '+250788123456',
    guarantorSavings: 750000,
    borrowerName: 'Jean Baptiste',
    borrowerEmail: 'jean.baptiste@rosca.com',
    borrowerPhone: '+250788234567',
    borrowerSavings: 500000,
    loanAmount: 800000,
    coverage: '156%',
    combinedSavings: 1250000,
    date: '2024-01-15',
    status: 'Approved',
  },
  {
    id: 'GAR-002',
    guarantorName: 'Patrick Nkunda',
    guarantorEmail: 'patrick.nkunda@rosca.com',
    guarantorPhone: '+250788345678',
    guarantorSavings: 850000,
    borrowerName: 'Eric Habimana',
    borrowerEmail: 'eric.habimana@rosca.com',
    borrowerPhone: '+250788456789',
    borrowerSavings: 600000,
    loanAmount: 1200000,
    coverage: '121%',
    combinedSavings: 1450000,
    date: '2024-02-10',
    status: 'Pending',
  },
  {
    id: 'GAR-003',
    guarantorName: 'David Mugisha',
    guarantorEmail: 'david.mugisha@rosca.com',
    guarantorPhone: '+250788567890',
    guarantorSavings: 900000,
    borrowerName: 'Grace Uwera',
    borrowerEmail: 'grace.uwera@rosca.com',
    borrowerPhone: '+250788678901',
    borrowerSavings: 450000,
    loanAmount: 600000,
    coverage: '225%',
    combinedSavings: 1350000,
    date: '2024-02-20',
    status: 'Approved',
  },
  {
    id: 'GAR-004',
    guarantorName: 'Christine Kwame',
    guarantorEmail: 'christine.kwame@rosca.com',
    guarantorPhone: '+250788789012',
    guarantorSavings: 650000,
    borrowerName: 'Robert Nkosi',
    borrowerEmail: 'robert.nkosi@rosca.com',
    borrowerPhone: '+250788890123',
    borrowerSavings: 700000,
    loanAmount: 950000,
    coverage: '142%',
    combinedSavings: 1350000,
    date: '2024-03-05',
    status: 'Pending',
  },
  {
    id: 'GAR-005',
    guarantorName: 'John Omondi',
    guarantorEmail: 'john.omondi@rosca.com',
    guarantorPhone: '+250788901234',
    guarantorSavings: 800000,
    borrowerName: 'Susan Mwangi',
    borrowerEmail: 'susan.mwangi@rosca.com',
    borrowerPhone: '+250788012345',
    borrowerSavings: 550000,
    loanAmount: 700000,
    coverage: '193%',
    combinedSavings: 1350000,
    date: '2024-03-12',
    status: 'Approved',
  },
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
