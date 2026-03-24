# Community Savings App - Digital ROSCA System

A professional, production-ready Digital ROSCA (Rotating Savings and Credit Association) platform with strict banking logic, share-based equity, and automated penalty calculations.

## 🏦 Banking Logic Overview

### Share-Based Equity System
- **1 Share = 2,000 RWF** (fixed price)
- Every payment is automatically converted to shares
- Members' equity is tracked in shares, not just currency
- Total Value = Shares × 2,000 RWF

**Example:**
- Payment: 50,000 RWF → 25 shares
- Total: 125 shares → 250,000 RWF total value

### Strict Penalty Tiers

The system enforces time-sensitive penalties based on payment lateness:

| Days Late | Tier | Rate | Calculation |
|-----------|------|------|-------------|
| 0 | None | 0% | No penalty |
| 1-3 | Tier 1 | 2% | Amount × 2% |
| 4-7 | Tier 2 | 5% | Amount × 5% |
| 8-14 | Tier 3 | 7% | Amount × 7% |
| 15+ | Daily | 1.5%/day | Amount × 1.5% × Days |

**Example Calculations:**
```
Payment: 50,000 RWF
Due: Jan 15, 2024

Scenario 1: Paid Jan 17 (2 days late)
Penalty = 50,000 × 2% = 1,000 RWF

Scenario 2: Paid Jan 20 (5 days late)
Penalty = 50,000 × 5% = 2,500 RWF

Scenario 3: Paid Jan 30 (15 days late)
Penalty = 50,000 × 1.5% × 15 = 11,250 RWF
```

### 100% Loan Coverage Requirement

Loans require **full coverage** from combined savings:

**Formula:**
```
Borrower Savings + Guarantor Savings ≥ Loan Amount
Coverage % = (Combined Savings / Loan Amount) × 100
```

**Example:**
```
Borrower: 250,000 RWF (125 shares)
Guarantor: 280,000 RWF (140 shares)
Combined: 530,000 RWF

✓ Can borrow up to: 530,000 RWF (100% coverage)
✗ Cannot borrow: 600,000 RWF (only 88.3% coverage)
```

### Giveaway Distribution (Tontine)

Monthly pool distribution:
- **95%** goes to winner
- **5%** admin fee

**Rules:**
- Only members who haven't won are eligible
- Random selection
- Winner marked to prevent double-winning
- Complete history tracking

**Example:**
```
Total Pool: 2,500,000 RWF
Winner Gets: 2,375,000 RWF (95%)
Admin Fee: 125,000 RWF (5%)
```

## ✨ Features

### 👤 Member Portal

#### My Savings Dashboard
- **Share-Based Display**: Shows shares owned and total value
- **Transaction History**: Complete ledger with share calculations
- **Penalty Tracking**: Detailed breakdown with hover tooltips
- **Next Payment Due**: Clear deadline display

#### Request Loan
- **Real-Time Calculator**: Adjusts max loan based on guarantor selection
- **100% Coverage Check**: Visual feedback on eligibility
- **Interest Calculation**: 5% interest with monthly payment breakdown
- **Guarantor Status**: Shows if guarantor has accepted

#### Pay Shares
- **Drag & Drop Upload**: Payment screenshot with preview
- **Share Calculation**: Real-time conversion (Amount ÷ 2,000)
- **Penalty Warning**: Shows if payment is late with exact penalty
- **Payment Day Tracking**: Compares due date vs upload date

### 💼 Accountant Portal

#### Verify Payments
- **Payment Queue**: Cards showing all pending submissions
- **Share Display**: Shows how many shares each payment represents
- **Penalty Alerts**: Highlights late payments with tier information
- **Screenshot Modal**: Full-screen view with all payment details
- **One-Click Actions**: Verify or Flag buttons

#### Loan Approvals
- **Coverage Display**: Shows combined savings vs loan amount
- **Eligibility Check**: Visual indicator if 100% coverage met
- **Guarantor Status**: Shows if guarantor accepted
- **Approve/Reject**: One-click workflow

### 👑 Admin Portal

#### Group Analytics
- **Total Shares**: Group-wide share count
- **Total Value**: Complete equity calculation
- **Share Price**: Fixed at 2,000 RWF
- **Monthly Breakdown**: Contributions, loans, penalties, giveaways

#### User Management
- **Share-Based View**: Shows each member's shares and value
- **Complete CRUD**: Add, edit, delete members
- **Role Management**: Assign member/accountant/admin roles

#### Run Giveaway
- **Animated Wheel**: 4-second spin animation
- **Eligibility Filter**: Only shows members who haven't won
- **95/5 Split**: Automatic calculation
- **History Tracking**: Complete record of past winners

## 🎯 Key Workflows

### Payment Submission Flow
1. Member uploads payment screenshot
2. System calculates shares (Amount ÷ 2,000)
3. System checks if late (Upload Day vs Payment Day)
4. If late, calculates penalty based on tier
5. Accountant reviews in queue
6. Accountant verifies or flags
7. If verified, shares added to member's account

### Loan Request Flow
1. Member selects guarantor
2. System calculates combined savings
3. System checks 100% coverage requirement
4. If eligible, member submits request
5. Guarantor logs in and accepts/rejects
6. If accepted, accountant reviews
7. If approved, loan disbursed

### Giveaway Flow
1. Admin clicks "Spin the Wheel"
2. System filters eligible members (haven't won)
3. Random selection with animation
4. 95% of pool goes to winner
5. 5% kept as admin fee
6. Winner marked as "has won"
7. History updated

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3.3
- **Icons**: Lucide React
- **File Upload**: React Dropzone
- **State Management**: React Hooks

## 📦 Installation

```bash
cd c:\Users\Mahbuba\Desktop\App

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
npm start
```

## 🚀 Getting Started

1. Open [http://localhost:3000](http://localhost:3000)
2. Select a role (Member, Accountant, or Admin)
3. Explore the banking features

## 📁 Project Structure

```
src/
├── app/                    # Next.js pages
│   ├── member/            # Member portal
│   ├── accountant/        # Accountant portal
│   └── admin/             # Admin portal
├── components/
│   ├── ui/                # Reusable UI components
│   ├── layout/            # Layout components
│   ├── member/            # Member-specific components
│   ├── accountant/        # Accountant components
│   └── admin/             # Admin components
├── lib/
│   ├── mockData.ts        # Mock data with calculations
│   └── utils.ts           # Banking logic functions
└── types/
    └── index.ts           # TypeScript definitions
```

## 🔧 Banking Functions

### Share Calculations
```typescript
calculateShares(amount: number): number
// 50,000 RWF → 25 shares

calculateTotalValue(shares: number): number
// 125 shares → 250,000 RWF
```

### Penalty Calculations
```typescript
calculatePenalty(amount: number, daysLate: number): PenaltyCalculation
// Returns: { tier, rate, penalty, formula }

calculateDaysLate(paymentDay: Date, uploadDay: Date): number
// Returns: number of days late
```

### Loan Eligibility
```typescript
checkLoanEligibility(
  borrowerSavings: number,
  guarantorSavings: number,
  requestedAmount: number
): LoanEligibility
// Returns: { isEligible, coveragePercentage, maxLoanAmount, reason }
```

### Giveaway Distribution
```typescript
calculateGiveawayDistribution(totalPool: number): {
  winnerAmount: number,  // 95%
  adminFee: number       // 5%
}
```

## 🎨 Design Features

- **Mobile-First**: Responsive from 320px to 4K
- **Professional Fintech UI**: Inspired by Paystack, Flutterwave
- **Smooth Animations**: Fade-in, slide-up, spin effects
- **Interactive Tooltips**: Detailed penalty explanations
- **Real-Time Calculations**: Instant feedback on all inputs
- **Loading States**: Professional loading indicators
- **Toast Notifications**: Success, error, warning, info

## 📊 Mock Data

The app includes realistic mock data:
- 6 Users with share-based equity
- 3 Payments with penalty calculations
- 2 Loans with coverage checks
- 3 Giveaway history entries
- Complete transaction ledger

## 🔒 Security Features

- Input validation on all forms
- XSS protection via React
- File upload validation (10MB limit, images only)
- Role-based access control
- Penalty calculation verification

## 📄 License

MIT License

## 🤝 Production Deployment

For production use:
1. Connect to real backend API
2. Add authentication (JWT/OAuth)
3. Implement actual file storage (S3, Cloudinary)
4. Add database integration (PostgreSQL, MongoDB)
5. Set up payment gateway integration
6. Add SMS notifications for penalties
7. Implement audit logging
8. Set up CI/CD pipeline

## 📞 Support

For issues or questions, please open an issue on the repository.

---

**Built with ❤️ for transparent, automated community savings management**
