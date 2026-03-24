import { PenaltyTier, PenaltyCalculation, LoanEligibility } from '@/types';

// ROSCA Constants
export const SHARE_PRICE = 2000;
export const GIVEAWAY_PERCENTAGE = 95;
export const ADMIN_FEE_PERCENTAGE = 5;
export const LOAN_COVERAGE_REQUIRED = 100;

// Penalty Tiers
export const PENALTY_TIERS = {
  tier1: { days: [1, 3], rate: 0.02 },
  tier2: { days: [4, 7], rate: 0.05 },
  tier3: { days: [8, 14], rate: 0.07 },
  daily: { days: [15, Infinity], rate: 0.015 },
};

/**
 * Get greeting based on time of day
 */
export const getGreeting = (): string => {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return 'Good Morning';
  } else if (hour >= 12 && hour < 17) {
    return 'Good Afternoon';
  } else if (hour >= 17 && hour < 22) {
    return 'Good Evening';
  } else {
    return 'Good Night';
  }
};

/**
 * Get greeting emoji based on time of day
 */
export const getGreetingEmoji = (): string => {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return '☀️';
  } else if (hour >= 12 && hour < 17) {
    return '🌤️';
  } else if (hour >= 17 && hour < 22) {
    return '🌆';
  } else {
    return '🌙';
  }
};

export const calculateShares = (amount: number): number => {
  if (!amount || isNaN(amount)) return 0;
  return Math.floor(amount / SHARE_PRICE);
};

export const calculateTotalValue = (shares: number): number => {
  if (!shares || isNaN(shares)) return 0;
  return shares * SHARE_PRICE;
};

export const calculatePenalty = (
  amount: number,
  daysLate: number
): PenaltyCalculation => {
  if (!amount || isNaN(amount)) {
    return {
      amount: 0,
      daysLate: 0,
      tier: 'none',
      rate: 0,
      penalty: 0,
      formula: 'Invalid amount',
    };
  }

  if (daysLate <= 0) {
    return {
      amount,
      daysLate: 0,
      tier: 'none',
      rate: 0,
      penalty: 0,
      formula: 'No penalty - paid on time',
    };
  }

  let tier: PenaltyTier;
  let rate: number;
  let penalty: number;
  let formula: string;

  if (daysLate >= 1 && daysLate <= 3) {
    tier = 'tier1';
    rate = PENALTY_TIERS.tier1.rate;
    penalty = Math.floor(amount * rate);
    formula = `${amount.toLocaleString()} × ${rate * 100}% = ${penalty.toLocaleString()} RWF`;
  } else if (daysLate >= 4 && daysLate <= 7) {
    tier = 'tier2';
    rate = PENALTY_TIERS.tier2.rate;
    penalty = Math.floor(amount * rate);
    formula = `${amount.toLocaleString()} × ${rate * 100}% = ${penalty.toLocaleString()} RWF`;
  } else if (daysLate >= 8 && daysLate <= 14) {
    tier = 'tier3';
    rate = PENALTY_TIERS.tier3.rate;
    penalty = Math.floor(amount * rate);
    formula = `${amount.toLocaleString()} × ${rate * 100}% = ${penalty.toLocaleString()} RWF`;
  } else {
    tier = 'daily';
    rate = PENALTY_TIERS.daily.rate;
    penalty = Math.floor(amount * rate * daysLate);
    formula = `${amount.toLocaleString()} × ${rate * 100}% × ${daysLate} days = ${penalty.toLocaleString()} RWF`;
  }

  return { amount, daysLate, tier, rate, penalty, formula };
};

export const calculateDaysLate = (paymentDay: Date, uploadDay: Date): number => {
  if (!paymentDay || !uploadDay) return 0;
  const diffTime = uploadDay.getTime() - paymentDay.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
};

export const checkLoanEligibility = (
  borrowerSavings: number,
  guarantorSavings: number,
  requestedAmount: number
): LoanEligibility => {
  const borrowerSafe = borrowerSavings || 0;
  const guarantorSafe = guarantorSavings || 0;
  const requestedSafe = requestedAmount || 0;
  
  const combinedSavings = borrowerSafe + guarantorSafe;
  const coveragePercentage = requestedSafe > 0 ? (combinedSavings / requestedSafe) * 100 : 0;
  const maxLoanAmount = combinedSavings;

  if (requestedSafe <= 0) {
    return {
      isEligible: false,
      borrowerSavings: borrowerSafe,
      guarantorSavings: guarantorSafe,
      combinedSavings,
      requestedAmount: requestedSafe,
      coveragePercentage: 0,
      maxLoanAmount,
      reason: 'Loan amount must be greater than 0',
    };
  }

  if (coveragePercentage < LOAN_COVERAGE_REQUIRED) {
    return {
      isEligible: false,
      borrowerSavings: borrowerSafe,
      guarantorSavings: guarantorSafe,
      combinedSavings,
      requestedAmount: requestedSafe,
      coveragePercentage,
      maxLoanAmount,
      reason: `Insufficient coverage. You need ${LOAN_COVERAGE_REQUIRED}% coverage. Current: ${coveragePercentage.toFixed(1)}%`,
    };
  }

  return {
    isEligible: true,
    borrowerSavings: borrowerSafe,
    guarantorSavings: guarantorSafe,
    combinedSavings,
    requestedAmount: requestedSafe,
    coveragePercentage,
    maxLoanAmount,
  };
};

export const calculateLoanPayment = (
  principal: number,
  annualRate: number,
  months: number
): { interest: number; totalRepayment: number; monthlyPayment: number } => {
  if (!principal || !annualRate || !months || isNaN(principal) || isNaN(annualRate) || isNaN(months)) {
    return { interest: 0, totalRepayment: 0, monthlyPayment: 0 };
  }
  
  const interest = Math.floor((principal * annualRate * months) / 100);
  const totalRepayment = principal + interest;
  const monthlyPayment = Math.ceil(totalRepayment / months);

  return { interest, totalRepayment, monthlyPayment };
};

export const calculateGiveawayDistribution = (
  totalPool: number
): { winnerAmount: number; adminFee: number } => {
  if (!totalPool || isNaN(totalPool)) {
    return { winnerAmount: 0, adminFee: 0 };
  }
  
  const winnerAmount = Math.floor(totalPool * (GIVEAWAY_PERCENTAGE / 100));
  const adminFee = totalPool - winnerAmount;

  return { winnerAmount, adminFee };
};

export const formatCurrency = (amount: number | undefined | null): string => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '0 RWF';
  }
  return `${amount.toLocaleString()} RWF`;
};

export const formatNumber = (num: number | undefined | null): string => {
  if (num === undefined || num === null || isNaN(num)) {
    return '0';
  }
  return num.toLocaleString();
};

export const formatDate = (date: Date | undefined | null): string => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return 'N/A';
  }
  return new Intl.DateTimeFormat('en-RW', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export const formatDateTime = (date: Date | undefined | null): string => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return 'N/A';
  }
  return new Intl.DateTimeFormat('en-RW', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const getInitials = (name: string | undefined | null): string => {
  if (!name) return '??';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

export const getPenaltyTierColor = (tier: PenaltyTier): string => {
  const colors = {
    none: 'success',
    tier1: 'warning',
    tier2: 'warning',
    tier3: 'danger',
    daily: 'danger',
  };
  return colors[tier] || 'info';
};

export const getPenaltyTierLabel = (tier: PenaltyTier): string => {
  const labels = {
    none: 'On Time',
    tier1: '1-3 Days Late (2%)',
    tier2: '4-7 Days Late (5%)',
    tier3: '8-14 Days Late (7%)',
    daily: '15+ Days Late (1.5%/day)',
  };
  return labels[tier] || 'Unknown';
};
