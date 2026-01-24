# JetrPay - Real-Time Crypto Payroll Platform
## Comprehensive Product & Technical Specification

---

## 📋 Executive Summary

**JetrPay** is a Web3-native real-time payroll streaming platform built on Arbitrum that enables employees to access their earnings by the second instead of waiting 2-4 weeks for traditional payroll. Companies deposit salary budgets into smart contracts that stream funds to employees continuously, allowing instant withdrawals with zero middlemen.

**Timeline:** MVP in 3 days (60 hours)  
**Category:** DeFi Infrastructure  
**Market Size:** $396M+ ARR potential (1% penetration of US workforce)

---

## 🎯 Problem Statement ($50B+ Market)

### Current Payroll Dysfunction
- **Employees:** Wait 2-4 weeks for payment (78% of US workers have cashflow crisis)
- **International Contractors:** Wait 3-7 days for wire transfers + $45+ fees
- **Freelancers:** Invoice → Wait 30-90 days → Payment
- **Companies:** Hold employee earnings as free working capital
- **Service Providers:** Payroll software (ADP, Gusto) charges $40-200/month per employee

### Real Pain Point
A Nigerian developer working for US company:
- Earns $5K/month
- Waits 30 days to get paid
- Pays $75 wire fee
- Loses 5% to FX spread
- **Net received:** $4,512 after 30+ days

---

## 💡 Solution: Real-Time Payroll Streaming

**How It Works:**
1. Company deposits $50K salary budget → Smart contract
2. Smart contract streams to 10 employees automatically
3. Employee earns $10/hour → After 1 hour, $10 available to withdraw
4. Employee clicks "Withdraw" → Receives USDC in 3 seconds
5. No invoicing, no waiting, no wire fees

**Key Differentiator:** Built on Arbitrum for $0.01 transaction costs (vs. Ethereum $50+ gas fees)

---

## 🏗️ Technical Architecture

### Smart Contracts (Solidity on Arbitrum)

#### Core Contracts
```
StreamFactory.sol
├─ Companies create payment streams
├─ Manages stream parameters (salary, duration, rate)
└─ Emits StreamCreated events for indexing

SalaryStream.sol
├─ Per-second vesting logic (inspired by Sablier)
├─ Tracks accrued balance per employee
└─ Gas-optimized for 1000+ employees per company

MultiStream.sol
├─ Batch stream management
├─ Handle up to 1000 employees in single transaction
└─ Reduces gas costs by 60% vs individual streams

InstantWithdraw.sol
├─ Withdraw accrued balance anytime
├─ Direct USDC transfer to employee wallet/bank
└─ Fee handling (0.25% on withdrawals)

PayrollScheduler.sol
├─ Auto-top-up from company treasury
├─ Cron-triggered off-chain
└─ Maintains minimum stream balance

TaxWithholding.sol
├─ Auto-deduct taxes per jurisdiction
├─ US: W2 (federal + state), 1099 (contractor)
├─ International: VAT, local income tax
└─ Audit trail for compliance

FiatRamp.sol
├─ Integration with Stripe/TransferWise
├─ Employee USD/EUR/GBP/etc conversions
└─ Handles KYC requirements for fiat withdrawals
```

### Technology Stack

**Blockchain:**
- Solidity 0.8.20
- Hardhat (development framework)
- Arbitrum One (mainnet) - low gas cost critical
- OpenZeppelin (upgradeable contracts, access control)
- The Graph Protocol (real-time stream indexing)

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- TailwindCSS + shadcn/ui
- Wagmi (Web3 interaction)
- Web3Auth (social + wallet login)

**Backend:**
- Node.js
- PostgreSQL + Prisma ORM
- Redis (real-time state caching)
- AWS Lambda (cron jobs)
- SendGrid (email notifications)

**Integrations:**
- Stripe Connect (payment processing)
- TransferWise API (international transfers)
- Plaid API (company bank accounts)
- QuickBooks/Xero API (accounting sync)
- The Graph (stream event indexing)

---

## 🎨 User Experience & Features

### For Companies (HR/Finance Teams)

#### Onboarding (5 minutes)
```
Step 1: Company Setup
├─ Connect company wallet (MetaMask, Ledger)
├─ OR link bank account via Plaid
├─ Set company name, tax ID
└─ Accept terms

Step 2: Import Employees
├─ Upload CSV (name, email, salary, address)
├─ OR import from QuickBooks/Xero
├─ Validate employee data
└─ Create pending invites

Step 3: Fund Treasury
├─ Deposit USDC to company smart contract
├─ Recommended: 1 month runway
├─ Set auto-top-up threshold ($5K minimum)
└─ Enable treasury staking (earn 4% APY)
```

#### Company Dashboard

**Real-Time Metrics:**
- Total Monthly Payroll: $50K
- Current Balance: $42,385
- Daily Burn Rate: $1,678
- Days Until Refill Needed: 21 days
- Active Employees: 10
- Streams Running: 10
- Total Withdrawn Today: $3,200

**Employee Management:**
- Search/filter employee list
- View per-employee stream status
- Pause/resume individual streams
- Adjust salary (takes effect next pay cycle)
- Terminate employee (graceful stream wind-down)
- Download payroll reports (PDF export)

**Admin Actions:**
- Add new employee (instant stream creation)
- Remove employee (stream termination)
- Manual bonus payment (one-time transfer)
- Batch salary adjustments
- Export for accountant (CSV, PDF)
- Set auto-top-up triggers
- View treasury balance & staking APY

**Analytics & Reporting:**
- 30-day/90-day payroll trends
- Employee withdrawal patterns
- Cost-per-employee analysis
- Tax withholding summary (by employee, by jurisdiction)
- Cash flow forecasting (next 12 months)

#### Company Wallet Management
- View treasury balance in real-time
- Deposit USDC via DEX or Stripe
- Enable treasury staking (Aave/Lido)
- Set minimum balance alerts
- Manage multi-sig vault (for large companies)

### For Employees

#### Onboarding (2 minutes)
```
Step 1: Email Invite
├─ Company sends invite
└─ Employee clicks link

Step 2: Web3Auth Signup
├─ Email/social login (Google, GitHub)
├─ Web3Auth generates non-custodial wallet
├─ Employee sees stream parameters
└─ Accept & confirm

Step 3: Bank/Wallet Setup
├─ Connect bank account (optional, for fiat)
├─ Connect wallet (optional, for crypto)
└─ Set primary withdrawal method
```

#### Employee Dashboard

**Live Earnings Display:**
- "You've earned $47.50 today" (live counter)
- "Earned this week: $210.30"
- "Total earned (all-time): $12,843.50"
- Per-second rate: "$0.0069 every second"

**Quick Actions:**
- **Withdraw** button → Cash out accrued balance
- **Advance Wage** button → Access tomorrow's pay (+2% fee)
- **View History** → All past transactions
- **Settings** → Bank/wallet management

**Financial Hub Features:**

1. **Earned Wage Access (EWA)**
   - See available balance: $47.50
   - Advance up to 50% of tomorrow's earnings
   - $100 advance → $2 fee → $98 to account
   - Automatically repays from next stream
   - Never let an advance exceed actual earnings

2. **Savings Goals**
   - Create goal: "Emergency Fund - $1000"
   - Set auto-transfer: "10% of each withdrawal"
   - Track progress in real-time
   - View goal completion date

3. **Bill Pay Automation**
   - "Auto-pay rent from stream"
   - Set amount: $1,500
   - Schedule: Every month, 1st of month
   - Automatic payment from accrued balance
   - Payment confirmation + receipt

4. **Split Deposits**
   - 70% to primary checking account
   - 30% to crypto wallet
   - Customizable percentages
   - Change anytime

5. **Transaction History**
   - Detailed ledger: Date, Amount, Type, Status
   - Export as CSV/PDF
   - Filter by date range, type, amount

6. **Spending Insights**
   - "You withdraw 2x per week, avg $500"
   - "Compare to average: 1.5x/week"
   - Monthly spending trend (graph)
   - Savings rate analysis

#### Mobile Experience
- Live earnings counter (refreshes every second)
- One-tap withdraw to preferred method
- Biometric auth (Face ID/Touch ID)
- Push notifications for new earnings
- In-app transaction receipts
- QR code for payment confirmation

---

## 🔐 Security & Compliance

### Smart Contract Security
- OpenZeppelin audited contracts
- Non-upgradeable immutable core (SalaryStream.sol)
- Multi-sig governance (≥3 of 5 signers for upgrades)
- Rate limiting (max withdrawal per tx: $10K)
- Reentrancy guards on all external calls

### KYC/KYB Verification

**For Employees (KYC Lite):**
- Email verification
- Phone number verification
- Proof of identity (optional, for fiat > $1K/month)
  - Government ID scan
  - Biometric selfie
- Address verification (utility bill)

**For Companies (KYB):**
- Company registration verification
- Tax ID (EIN) verification
- Beneficial ownership identification
- Bank account verification (Plaid)
- Signatory verification (multi-sig)

### Tax Compliance

**United States:**
- Automatic W2 withholding (federal + state)
- 1099 contractor tax handling
- Quarterly estimated tax warnings
- Form 1098 generation
- IRS e-filing compatibility

**International:**
- Per-country tax calculation
- VAT handling (EU)
- Pension contributions (Germany, France)
- Local income tax withholding
- Compliance reporting per jurisdiction

### Anti-Fraud & AML
- Geolocation verification
- Velocity checks (rapid withdrawal limits)
- Sanction list screening (OFAC, EU)
- Unusual activity alerts
- 24-hour hold on fiat withdrawals >$5K (optional)

---

## 🔗 Web3 Integration Details

### Authentication Options

**Option 1: Web3Auth (Recommended MVP)**
```javascript
// Social login (email/Google/GitHub)
const userInfo = await web3auth.connect();
// Non-custodial wallet auto-generated
// User signs transactions with private key
```

**Option 2: Privy (Production)**
```javascript
// Embedded wallets for non-crypto users
// Email/social auth with embedded wallet
// Seamless Web3 UX for normies
```

**Option 3: Traditional + Web3 Hybrid**
```javascript
// Email/password (traditional)
// Magic Link (passwordless)
// MetaMask connect (self-custodial)
// WalletConnect support
```

### Wallet Management
- **Non-custodial:** User holds private keys
- **Embedded Wallet:** Privy/Web3Auth manages keys securely
- **Multi-sig Company Vaults:** 2-of-3 or 3-of-5 signers
- **Hardware Wallets:** Ledger/Trezor support for companies

### Smart Contract Interactions
```solidity
// Employee withdraws accrued balance
interface IInstantWithdraw {
    function withdraw(uint256 amount) external;
    function withdrawTo(address recipient, uint256 amount) external;
    function withdrawWithCallback(uint256 amount, bytes calldata data) external;
}

// Company tops up treasury
interface ITreasury {
    function deposit(uint256 amount) external;
    function getBalance() external view returns (uint256);
    function setAutoTopUp(uint256 threshold, uint256 amount) external;
}

// View accrued balance (no gas cost, read-only)
interface IStreamReader {
    function getAccruedBalance(address employee) external view returns (uint256);
    function getStreamRate(address employee) external view returns (uint256);
    function getStreamsForCompany(address company) external view returns (Stream[]);
}
