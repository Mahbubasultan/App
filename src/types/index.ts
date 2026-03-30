export type UserRole = 'member' | 'accountant' | 'admin';
export type PaymentStatus = 'pending' | 'verified' | 'flagged' | 'rejected';
export type LoanStatus = 'pending' | 'guarantor_pending' | 'approved' | 'rejected' | 'disbursed' | 'repaid';
export type PenaltyTier = 'none' | 'tier1' | 'tier2' | 'tier3' | 'daily';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  totalValue: number; // Total savings in RWF
  shares: number; // Number of shares (totalValue / 2000)
  joinedDate: Date;
  lastPaymentDate: Date | null;
  nextPaymentDue: Date;
  hasWonGiveaway: boolean;
  isActive: boolean;
}

export interface Payment {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  shares: number; // amount / 2000
  transactionId: string;
  momoName: string;
  momoNumber: string;
  screenshot: string;
  paymentDay: Date; // Expected payment date
  uploadDay: Date; // Actual upload date
  daysLate: number;
  penaltyTier: PenaltyTier;
  penaltyAmount: number;
  penaltyRate: number;
  status: PaymentStatus;
  verifiedBy?: string;
  verifiedAt?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Loan {
  id: string;
  borrowerId: string;
  borrowerName: string;
  borrowerSavings: number;
  amount: number;
  guarantorId: string;
  guarantorName: string;
  guarantorSavings: number;
  combinedSavings: number; // borrowerSavings + guarantorSavings
  coveragePercentage: number; // (combinedSavings / amount) * 100
  interestRate: number;
  duration: number; // months
  monthlyPayment: number;
  totalRepayment: number;
  status: LoanStatus;
  guarantorAccepted: boolean;
  approvedBy?: string;
  approvedAt?: Date;
  disbursedAt?: Date;
  dueDate?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Giveaway {
  id: string;
  month: string;
  year: number;
  totalPool: number;
  winnerAmount: number; // 95% of pool
  adminFee: number; // 5% of pool
  winnerId: string;
  winnerName: string;
  eligibleMembers: number;
  runBy: string;
  date: Date;
}

export interface ShareTransaction {
  id: string;
  userId: string;
  userName: string;
  type: 'contribution' | 'loan' | 'repayment' | 'penalty' | 'giveaway';
  amount: number;
  shares: number;
  totalShares: number;
  totalValue: number;
  description: string;
  reference?: string;
  penalty?: number;
  penaltyRate?: number;
  daysLate?: number;
  createdAt: Date;
}

export interface PenaltyCalculation {
  amount: number;
  daysLate: number;
  tier: PenaltyTier;
  rate: number;
  penalty: number;
  formula: string;
}

export interface LoanEligibility {
  isEligible: boolean;
  borrowerSavings: number;
  guarantorSavings: number;
  combinedSavings: number;
  requestedAmount: number;
  coveragePercentage: number;
  maxLoanAmount: number;
  reason?: string;
}

export interface GroupStats {
  totalMembers: number;
  activeMembers: number;
  totalShares: number;
  totalValue: number;
  sharePrice: number; // Always 2000 RWF
  monthlyContributions: number;
  activeLoans: number;
  totalLoansIssued: number;
  pendingVerifications: number;
  totalPenalties: number;
  averageShares: number;
  giveawayPool: number;
}

export interface MonthlyData {
  month: string;
  year: number;
  contributions: number;
  shares: number;
  loans: number;
  repayments: number;
  penalties: number;
  giveaway: number;
  netFlow: number;
}
