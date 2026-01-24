export interface Employee {
  id: string
  name: string
  role: string
  status: "Active" | "Paused"
  salary: number
  ratePerSecond: number
  accruedBalance: number
  walletAddress: string
  startDate: string
}

export interface Transaction {
  id: string
  type: "stream" | "withdrawal" | "deposit"
  amount: number
  asset: string
  timestamp: string
  blockNumber: number
  status: "confirmed" | "pending" | "failed"
  to?: string
}

export const MOCK_EMPLOYEES: Employee[] = [
  {
    id: "emp-1",
    name: "Alex Rivera",
    role: "Senior Protocol Engineer",
    status: "Active",
    salary: 142000,
    ratePerSecond: 142000 / 31536000,
    accruedBalance: 1240.52,
    walletAddress: "aleo1...9a4j",
    startDate: "2025-01-12",
  },
  {
    id: "emp-2",
    name: "Sarah Chen",
    role: "Product Designer",
    status: "Active",
    salary: 115000,
    ratePerSecond: 115000 / 31536000,
    accruedBalance: 842.15,
    walletAddress: "aleo1...p2k9",
    startDate: "2025-02-05",
  },
  {
    id: "emp-3",
    name: "Marcus Thorne",
    role: "Security Auditor",
    status: "Paused",
    salary: 165000,
    ratePerSecond: 0,
    accruedBalance: 2150.8,
    walletAddress: "aleo1...m7v2",
    startDate: "2024-11-20",
  },
]

export const MOCK_COMPANY_STATS = {
  monthlyBurn: 42500,
  vaultBalance: 245000,
  activeStreams: 12,
  complianceScore: 100,
}

export const generateMockTransactions = (count: number): Transaction[] => {
  const types: ("stream" | "withdrawal" | "deposit")[] = ["stream", "withdrawal", "deposit"]
  const assets = ["USDC", "ALEO"]

  return Array.from({ length: count }, (_, i) => ({
    id: `tx-${i}-${Math.random().toString(36).substr(2, 9)}`,
    type: types[Math.floor(Math.random() * types.length)],
    amount: Math.random() * 500,
    asset: assets[Math.floor(Math.random() * assets.length)],
    timestamp: new Date(Date.now() - Math.random() * 1000000000).toISOString(),
    blockNumber: 420000 - Math.floor(Math.random() * 10000),
    status: "confirmed",
  })).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}
