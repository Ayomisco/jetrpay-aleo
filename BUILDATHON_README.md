# JetrPay

<div align="center">

![JetrPay Logo](https://img.shields.io/badge/JetrPay-Privacy--First_Payroll-blue?style=for-the-badge)

**Privacy-Preserving Payroll Platform Built on Aleo**

*Prove everything. Reveal nothing. Pay everyone.*

[![Aleo](https://img.shields.io/badge/Built_on-Aleo-00D4FF?style=flat-square)](https://aleo.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![Leo](https://img.shields.io/badge/Leo-3.4.0-purple?style=flat-square)](https://developer.aleo.org/leo/)

</div>

---

## 🎯 Overview

**JetrPay** is a **zero-knowledge payroll platform** that enables companies to pay employees in real-time while keeping salaries, payment amounts, and recipient identities completely private. Built on Aleo's programmable privacy Layer-1 blockchain.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        JetrPay Platform                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────────┐  │
│  │   Frontend  │◄──►│  Wallet     │◄──►│   Aleo Network      │  │
│  │  (Next.js)  │    │  Adapter    │    │   (Testnet)         │  │
│  └─────────────┘    └─────────────┘    └─────────────────────┘  │
│        │                   │                      │              │
│        │                   │                      ▼              │
│        │                   │           ┌─────────────────────┐  │
│        │                   │           │  Leo Smart Contract │  │
│        │                   │           │  (jetrpay_payroll)  │  │
│        │                   │           └─────────────────────┘  │
│        ▼                   │                                     │
│  ┌─────────────┐          │                                     │
│  │  Local      │          │                                     │
│  │  Storage    │◄─────────┘                                     │
│  └─────────────┘                                                │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm
- Leo 3.4.0 (for smart contract development)
- Leo Wallet or Puzzle Wallet (browser extension)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/jetrpay-aleo.git
cd jetrpay-aleo

# Install frontend dependencies
cd frontend
pnpm install

# Start development server
pnpm dev
```

The app will be available at `http://localhost:3000`

### Smart Contract

```bash
# Navigate to contracts directory
cd contracts/jetrpay_payroll

# Build the Leo contract
leo build

# Run tests
leo run test_create_stream

# Deploy to testnet (requires testnet credits)
leo deploy --network testnet
```

## 🔐 Privacy Features

### Zero-Knowledge Salary Streams

JetrPay implements **private salary streaming** using Aleo's zero-knowledge proofs:

1. **Private Records**: Salary amounts, rates, and balances are stored in encrypted records only visible to authorized parties
2. **Confidential Claims**: Employees can claim salaries without revealing how much they're claiming or their total balance
3. **Hidden Employer-Employee Links**: On-chain observers cannot determine which addresses are paying/receiving from each other

### How It Works

1. **Employer Setup**: Company creates a private vault and deposits funds
2. **Stream Creation**: Admin creates salary streams for each employee (private records)
3. **Real-Time Accrual**: Salary accrues block-by-block based on configured rate
4. **Private Claims**: Employees generate ZK proofs to claim accrued salary
5. **Instant Settlement**: Funds transfer privately, no public transaction trail

## 📁 Project Structure

```
jetrpay-aleo/
├── contracts/
│   └── jetrpay_payroll/
│       ├── src/main.leo          # Leo smart contract
│       ├── program.json          # Program configuration
│       └── README.md             # Contract documentation
│
├── frontend/
│   ├── app/                      # Next.js 15 app router
│   │   ├── dashboard/            # Main dashboard
│   │   ├── onboarding/           # User registration flow
│   │   ├── payroll/              # Payroll management
│   │   ├── wallet/               # Wallet overview
│   │   └── api/aleo/             # Backend API routes
│   │
│   ├── components/
│   │   ├── auth/                 # Onboarding components
│   │   ├── dashboard/            # Dashboard components
│   │   ├── layout/               # App shell, navigation
│   │   └── ui/                   # Reusable UI components
│   │
│   ├── lib/
│   │   ├── app-context-v2.tsx    # Global state management
│   │   ├── wallet-adapter.ts     # Multi-wallet support
│   │   └── utils.ts              # Utility functions
│   │
│   └── docs/                     # Documentation
│
└── README.md
```

## 🔧 Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **TypeScript** - Type safety

### Blockchain

- **Aleo** - Privacy-focused Layer-1 blockchain
- **Leo** - Aleo's native smart contract language
- **@aleohq/sdk** - JavaScript SDK for Aleo

### Wallets Supported

- **Leo Wallet** - Primary Aleo wallet
- **Puzzle Wallet** - Alternative Aleo wallet

## 📱 Features

### For Employers (Admin Dashboard)

- ✅ Register company with KYB verification
- ✅ Add employees to payroll
- ✅ Create private salary streams
- ✅ Monitor vault balance
- ✅ Pause/resume individual streams
- ✅ Bulk import employees via CSV

### For Employees

- ✅ Connect wallet securely
- ✅ View real-time accrued balance
- ✅ Claim salary with ZK proof
- ✅ View transaction history
- ✅ Request salary advances

### Network Integration

- ✅ Real-time block height from Aleo testnet
- ✅ Network status monitoring
- ✅ Program deployment verification
- ✅ Transaction broadcasting

## 🔗 Smart Contract

### Contract Details

| Property | Value |
|----------|-------|
| **Program ID** | `jetrpay_payroll_testnet_v1.aleo` |
| **Network** | Aleo Testnet |
| **Language** | Leo 3.4.0 |
| **Statements** | 30 |

> **Note**: The contract is compiled and ready for deployment. Deployment to testnet requires ALEO credits. You can deploy using:
> ```bash
> cd contracts/jetrpay_payroll
> leo deploy --network testnet --endpoint "https://api.explorer.provable.com/v1" --broadcast
> ```

### Transitions

```leo
// Create a new salary stream for an employee
transition create_salary_stream(
    employee: address,
    rate_per_block: u64,
    start_block: u32,
    max_amount: u64
) -> SalaryStream

// Employee claims accrued salary
transition claim_salary(
    stream: SalaryStream,
    amount: u64,
    current_block: u32
) -> (SalaryStream, credits)

// Pause/resume a stream
transition pause_stream(stream: SalaryStream) -> SalaryStream
transition resume_stream(stream: SalaryStream) -> SalaryStream
```

### Privacy Model


| Data           | Who Can See              |
| -------------- | ------------------------ |
| Salary Amount  | Only employer & employee |
| Stream Rate    | Only employer & employee |
| Claimed Amount | Only employee            |
| Total Balance  | Only employee            |
| Payment Links  | Nobody (ZK hidden)       |

## 🌐 Environment Variables

Create a `.env.local` file in the frontend directory:

```env
# Aleo Configuration
NEXT_PUBLIC_ALEO_NETWORK=testnet
NEXT_PUBLIC_ALEO_API_URL=https://api.explorer.provable.com/v1
NEXT_PUBLIC_PROGRAM_ID=jetrpay_payroll_testnet_v1.aleo

# For contract deployment (server-side only)
ALEO_PRIVATE_KEY=your_private_key_here
```

## 🧪 Testing

```bash
# Frontend tests
cd frontend
pnpm test

# Contract tests
cd contracts/jetrpay_payroll
leo run test_create_stream
leo run test_claim_salary
```

## 🚢 Deployment

### Frontend (Vercel)

```bash
cd frontend
vercel deploy
```

### Smart Contract (Aleo Testnet)

```bash
cd contracts/jetrpay_payroll
leo deploy --network testnet --endpoint "https://api.explorer.provable.com/v1"
```

## 📊 Demo Accounts

For hackathon demonstration, the app supports:

1. **Enterprise Flow**: Register a company → KYB verification → Add employees → Fund vault → Create streams
2. **Employee Flow**: Find company → KYC verification → View earnings → Claim salary

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Aleo](https://aleo.org) - For building the privacy Layer-1
- [Leo Language](https://developer.aleo.org/leo/) - For ZK-native smart contracts
- [shadcn/ui](https://ui.shadcn.com) - For beautiful components
- [Vercel](https://vercel.com) - For hosting

---

<div align="center">

**Built with ❤️ for the Aleo Buildathon 2026**

[Live Demo](https://jetrpay.xyz) · [GitHub](https://github.com/Ayomisco/jetrpay-aleo)

</div>
