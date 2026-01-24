# JetrPay Frontend

**Privacy-Preserving Payroll Interface Built with Next.js 14**

This is the frontend application for JetrPay, a zero-knowledge payroll platform on Aleo Network. The interface enables employers to manage private salary streams and employees to access real-time earnings — all while maintaining complete financial privacy.

---

## 🎯 Overview

The JetrPay frontend is a modern, responsive web application that integrates seamlessly with Aleo's Leo Wallet to execute zero-knowledge payroll transactions. Built with Next.js 14, TypeScript, and TailwindCSS, it provides an intuitive interface for complex cryptographic operations.

### Key Features

✅ **Leo Wallet Integration** - One-click wallet connection via Aleo Wallet Adapter  
✅ **Client-Side ZK Proving** - Web Workers generate proofs in-browser (no backend)  
✅ **Real-Time Balance Tracking** - Per-second salary accrual with live counter  
✅ **Responsive Design** - Mobile-first UI that works on all devices  
✅ **Dark Mode** - Cyberpunk-inspired theme with dark mode support  
✅ **Type-Safe** - Full TypeScript coverage for reliability  

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                 NEXT.JS APP ROUTER                      │
│  Server Components | Client Components | API Routes    │
└─────────────────────────────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────┐
│              REACT CONTEXT (State)                      │
│  Wallet | Payroll Data | User Profile | Theme           │
└─────────────────────────────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────┐
│           ALEO WALLET ADAPTER LAYER                     │
│  Leo Wallet | Transaction Signing | Account Management │
└─────────────────────────────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────┐
│               WEB WORKER (ZK Proving)                   │
│  Aleo SDK | Offline Execution | Proof Generation       │
└─────────────────────────────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────┐
│                  ALEO NETWORK                           │
│  Testnet/Mainnet | Smart Contracts | Records            │
└─────────────────────────────────────────────────────────┘
```

---

## 📦 Directory Structure

```
frontend/
├── app/                          # Next.js 14 App Router
│   ├── layout.tsx               # Root layout with providers
│   ├── page.tsx                 # Homepage (redirects to landing)
│   ├── globals.css              # Global styles
│   │
│   ├── (landing)/               # Public marketing pages
│   │   ├── layout.tsx
│   │   ├── page.tsx            # Hero landing page
│   │   ├── pricing/            # Pricing tiers
│   │   ├── roadmap/            # Product roadmap
│   │   └── use-cases/          # Case studies
│   │
│   ├── dashboard/               # Admin/employer dashboard
│   │   ├── layout.tsx
│   │   └── page.tsx            # Payroll overview
│   │
│   ├── payroll/                 # Payroll management
│   │   ├── layout.tsx
│   │   └── page.tsx            # Create/manage streams
│   │
│   ├── wallet/                  # Employee wallet view
│   │   ├── layout.tsx
│   │   └── page.tsx            # Balance & withdrawal
│   │
│   ├── analytics/               # Analytics dashboard
│   ├── transactions/            # Transaction history
│   ├── settings/                # Account settings
│   └── onboarding/              # User onboarding flow
│
├── components/                  # React components
│   ├── auth/                   # Wallet connection
│   │   └── onboarding.tsx
│   │
│   ├── dashboard/              # Dashboard widgets
│   │   ├── admin-dashboard.tsx
│   │   ├── admin-payroll-console.tsx
│   │   ├── employee-dashboard.tsx
│   │   ├── wallet-overview.tsx
│   │   └── operations-center.tsx
│   │
│   ├── layout/                 # Layout components
│   │   └── app-shell.tsx       # Sidebar + header
│   │
│   └── ui/                     # Shadcn UI components
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── table.tsx
│       └── ... (40+ components)
│
├── lib/                        # Utilities & integrations
│   ├── aleo-wallet.ts         # Wallet connection logic
│   ├── payroll-actions.ts     # Smart contract interactions
│   ├── app-context.tsx        # Global state management
│   ├── mock-data.ts           # Demo data
│   └── utils.ts               # Helper functions
│
├── hooks/                      # Custom React hooks
│   ├── use-mobile.ts          # Mobile detection
│   └── use-toast.ts           # Toast notifications
│
├── workers/                    # Web Workers
│   └── prover.worker.ts       # ZK proof generation
│
├── public/                     # Static assets
│   ├── logo.svg
│   └── og-image.png
│
├── docs/                       # Documentation
│   ├── ALEO_IMPLEMENTATION_PLAN.md
│   ├── JETRPAY_PRD.md
│   └── FEATURE_AUDIT.md
│
├── next.config.mjs            # Next.js configuration
├── tailwind.config.ts         # TailwindCSS config
├── tsconfig.json              # TypeScript config
├── package.json               # Dependencies
└── README.md                  # This file
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.17+ (LTS recommended)
- **pnpm** 8+ (or npm/yarn)
- **Leo Wallet** browser extension
- **Aleo Testnet Credits** ([get from faucet](https://faucet.aleo.org))

---

### Installation

1. **Clone the repository**:
```bash
git clone git@github.com:Ayomisco/jetrpay-aleo.git
cd jetrpay-aleo/frontend
```

2. **Install dependencies**:
```bash
pnpm install
# or
npm install
```

3. **Set up environment variables**:
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
# Aleo Network Configuration
NEXT_PUBLIC_ALEO_NETWORK=testnet3
NEXT_PUBLIC_ALEO_API_URL=https://api.explorer.aleo.org/v1

# Smart Contract Program IDs (update after deployment)
NEXT_PUBLIC_PAYROLL_PROGRAM_ID=payroll.aleo
NEXT_PUBLIC_COMPLIANCE_PROGRAM_ID=compliance.aleo
NEXT_PUBLIC_TREASURY_PROGRAM_ID=treasury.aleo

# Optional: Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Optional: Database (Supabase for metadata)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
```

4. **Run development server**:
```bash
pnpm dev
```

5. **Open browser**:
Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🔧 Development

### Available Scripts

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint

# Run type checking
pnpm type-check

# Format code
pnpm format
```

### Development Workflow

1. **Start dev server**: `pnpm dev`
2. **Make changes** to components/pages
3. **See live updates** (Fast Refresh enabled)
4. **Test in browser** with Leo Wallet connected
5. **Commit changes**: Follow [Conventional Commits](https://www.conventionalcommits.org/)

---

## 🎨 Styling

### TailwindCSS

We use TailwindCSS with a custom design system:

**Colors**:
```typescript
// tailwind.config.ts
colors: {
  primary: '#00D4FF',      // Aleo blue
  secondary: '#8B5CF6',    // Purple
  success: '#10B981',      // Green
  danger: '#EF4444',       // Red
  warning: '#F59E0B',      // Orange
}
```

**Custom Utilities**:
```css
/* app/globals.css */
@layer utilities {
  .text-gradient {
    @apply bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary;
  }
}
```

### Shadcn UI

All UI components follow [Shadcn UI](https://ui.shadcn.com/) patterns:
- Components in `components/ui/`
- Fully customizable with Tailwind
- Accessible by default (ARIA compliant)

**Add new component**:
```bash
npx shadcn-ui@latest add <component-name>
```

### Dark Mode

Dark mode is handled via `next-themes`:
```tsx
import { useTheme } from 'next-themes'

const { theme, setTheme } = useTheme()
```

---

## 🔌 Aleo Integration

### Wallet Connection

```typescript
// lib/aleo-wallet.ts
import { WalletAdapterNetwork } from '@demox-labs/aleo-wallet-adapter-base'
import { LeoWalletAdapter } from '@demox-labs/aleo-wallet-adapter-leo'
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react'

export function useAleoWallet() {
  const { wallet, connect, disconnect, publicKey } = useWallet()
  
  return {
    wallet,
    connect,
    disconnect,
    address: publicKey?.toString(),
    isConnected: !!publicKey,
  }
}
```

**Usage in component**:
```tsx
'use client'

import { useAleoWallet } from '@/lib/aleo-wallet'

export default function ConnectButton() {
  const { connect, disconnect, address, isConnected } = useAleoWallet()
  
  return (
    <button onClick={isConnected ? disconnect : connect}>
      {isConnected ? `Connected: ${address?.slice(0, 8)}...` : 'Connect Wallet'}
    </button>
  )
}
```

---

### Execute Smart Contract Transitions

```typescript
// lib/payroll-actions.ts
import { Transaction } from '@demox-labs/aleo-wallet-adapter-react'

export async function createSalaryStream(
  employeeAddress: string,
  annualSalary: number,
  wallet: LeoWalletAdapter
) {
  try {
    // 1. Prepare inputs
    const inputs = [
      employeeAddress,
      `${annualSalary}u64`,
      '31536000u64', // 1 year in seconds
    ]
    
    // 2. Request transaction (triggers ZK proving in wallet)
    const txResponse = await wallet.requestTransaction({
      program: process.env.NEXT_PUBLIC_PAYROLL_PROGRAM_ID!,
      function: 'create_stream',
      inputs,
      fee: 0.1, // Aleo credits
    })
    
    // 3. Wait for confirmation
    const txId = await txResponse.send()
    await txResponse.wait()
    
    return { success: true, txId }
  } catch (error) {
    console.error('Failed to create stream:', error)
    return { success: false, error: error.message }
  }
}
```

**Usage in component**:
```tsx
'use client'

import { createSalaryStream } from '@/lib/payroll-actions'
import { useAleoWallet } from '@/lib/aleo-wallet'

export default function CreateStreamForm() {
  const { wallet } = useAleoWallet()
  const [loading, setLoading] = useState(false)
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const result = await createSalaryStream(
      employeeAddress,
      annualSalary,
      wallet
    )
    
    if (result.success) {
      toast.success(`Stream created! TX: ${result.txId}`)
    } else {
      toast.error(result.error)
    }
    
    setLoading(false)
  }
  
  return <form onSubmit={handleSubmit}>...</form>
}
```

---

### Web Worker for ZK Proving

```typescript
// workers/prover.worker.ts
import { AleoWorker } from '@provablehq/sdk'

const aleoWorker = new AleoWorker()

self.onmessage = async (event) => {
  const { program, functionName, inputs } = event.data
  
  try {
    // Generate ZK proof (5-30 seconds)
    const result = await aleoWorker.executeOffline({
      program,
      function: functionName,
      inputs,
    })
    
    self.postMessage({ success: true, result })
  } catch (error) {
    self.postMessage({ success: false, error: error.message })
  }
}
```

**Usage in component**:
```tsx
'use client'

import { useEffect, useRef } from 'react'

export default function ProofGenerator() {
  const workerRef = useRef<Worker>()
  
  useEffect(() => {
    workerRef.current = new Worker(
      new URL('@/workers/prover.worker.ts', import.meta.url)
    )
    
    workerRef.current.onmessage = (event) => {
      if (event.data.success) {
        console.log('Proof generated:', event.data.result)
      }
    }
    
    return () => workerRef.current?.terminate()
  }, [])
  
  const generateProof = () => {
    workerRef.current?.postMessage({
      program: 'payroll.aleo',
      functionName: 'create_stream',
      inputs: [...],
    })
  }
  
  return <button onClick={generateProof}>Generate Proof</button>
}
```

---

## 📊 State Management

### React Context

```typescript
// lib/app-context.tsx
'use client'

import { createContext, useContext, useState } from 'react'

interface AppContextType {
  user: User | null
  streams: SalaryStream[]
  balance: bigint
  updateUser: (user: User) => void
  addStream: (stream: SalaryStream) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [streams, setStreams] = useState<SalaryStream[]>([])
  const [balance, setBalance] = useState<bigint>(0n)
  
  return (
    <AppContext.Provider value={{
      user,
      streams,
      balance,
      updateUser: setUser,
      addStream: (stream) => setStreams([...streams, stream]),
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within AppProvider')
  return context
}
```

**Usage**:
```tsx
'use client'

import { useApp } from '@/lib/app-context'

export default function Dashboard() {
  const { user, streams } = useApp()
  
  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <p>Active streams: {streams.length}</p>
    </div>
  )
}
```

---

## 🎯 Key Pages

### Landing Page
**Route**: `/`  
**File**: `app/(landing)/page.tsx`

- Hero section with value proposition
- Feature highlights
- Call-to-action for wallet connection

### Dashboard
**Route**: `/dashboard`  
**File**: `app/dashboard/page.tsx`

- Real-time payroll metrics
- Active stream count
- Treasury balance
- Quick actions (create stream, view employees)

### Payroll Console
**Route**: `/payroll`  
**File**: `app/payroll/page.tsx`

- Create salary streams
- Manage existing streams
- Bulk CSV import
- Stream pause/resume/terminate

### Employee Wallet
**Route**: `/wallet`  
**File**: `app/wallet/page.tsx`

- Real-time balance counter
- Withdraw button
- Transaction history
- Earnings projections

---

## 🧪 Testing

### Unit Tests (Coming Soon)

```bash
pnpm test
```

### E2E Tests (Coming Soon)

```bash
pnpm test:e2e
```

### Manual Testing Checklist

- [ ] Connect Leo Wallet
- [ ] Switch between employer/employee roles
- [ ] Create salary stream
- [ ] Withdraw earned balance
- [ ] View transaction history
- [ ] Generate compliance proof
- [ ] Mobile responsiveness
- [ ] Dark mode toggle

---

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect GitHub**:
   - Visit [vercel.com](https://vercel.com)
   - Import `jetrpay-aleo` repository

2. **Configure environment**:
   - Add all `.env.local` variables to Vercel dashboard

3. **Deploy**:
   - Every push to `main` triggers production deployment
   - Preview deployments for PRs

### Self-Hosting

```bash
# Build for production
pnpm build

# Start production server
pnpm start

# Or use Docker
docker build -t jetrpay-frontend .
docker run -p 3000:3000 jetrpay-frontend
```

---

## 🔒 Security

### Best Practices

- ✅ **No private keys in frontend** - Keys stay in Leo Wallet
- ✅ **HTTPS only** - All requests encrypted
- ✅ **CSP headers** - Prevent XSS attacks
- ✅ **No tracking** - Privacy-respecting analytics only
- ✅ **Type safety** - TypeScript catches bugs at compile time

### Environment Variables

Never commit `.env.local` to Git:
```bash
# .gitignore
.env*.local
```

---

## 🎨 Design System

### Typography
```typescript
// Headings
<h1 className="text-4xl font-bold">Main Title</h1>
<h2 className="text-3xl font-semibold">Section Title</h2>
<h3 className="text-2xl font-medium">Subsection</h3>

// Body
<p className="text-base">Regular text</p>
<p className="text-sm text-muted-foreground">Secondary text</p>
```

### Spacing
```typescript
// Consistent spacing scale
gap-2  // 0.5rem
gap-4  // 1rem
gap-6  // 1.5rem
gap-8  // 2rem
```

### Components
```typescript
// Button variants
<Button variant="default">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>
```

---

## 📚 Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Aleo Wallet Adapter](https://www.npmjs.com/package/@demox-labs/aleo-wallet-adapter-react)
- [Aleo SDK](https://developer.aleo.org/sdk)
- [Shadcn UI](https://ui.shadcn.com)

### Community
- [Aleo Discord](https://discord.gg/aleo) - #frontend-dev
- [JetrPay Discussions](https://github.com/Ayomisco/jetrpay-aleo/discussions)

---

## 🤝 Contributing

### How to Contribute

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-ui`
3. **Make changes** to components/pages
4. **Test thoroughly**
5. **Commit**: `git commit -m 'feat: add amazing UI component'`
6. **Push**: `git push origin feature/amazing-ui`
7. **Open Pull Request**

### Code Style

- Use **TypeScript** for all new code
- Follow **ESLint** rules: `pnpm lint`
- Use **Prettier** for formatting
- Write **meaningful commit messages**

---

## 📜 License

MIT License - See [LICENSE](../LICENSE)

---

## 🙏 Acknowledgments

- **Shadcn** for the amazing UI component library
- **Vercel** for Next.js and hosting platform
- **Aleo Team** for wallet adapter and SDK
- **TailwindCSS** for utility-first styling

---

<div align="center">

**Built with Next.js 14 on Aleo Network**

*Privacy-First | Mobile-Ready | Production-Grade*

[Demo](https://jetrpay-aleo.vercel.app) · [Docs](./docs) · [GitHub](https://github.com/Ayomisco/jetrpay-aleo)

</div>
