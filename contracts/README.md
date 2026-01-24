# JetrPay Smart Contracts

**Zero-Knowledge Payroll Programs Written in Leo**

This directory contains the Leo smart contracts that power JetrPay's privacy-preserving payroll platform on Aleo Network.

---

## 📋 Overview

JetrPay uses three modular Leo programs to handle payroll operations while maintaining complete privacy:

1. **`payroll.aleo`** - Core salary streaming and withdrawal logic
2. **`compliance.aleo`** - Zero-knowledge compliance proofs for auditors
3. **`treasury.aleo`** - Company treasury management and fund allocation

All salary amounts, recipient identities, and company balances are encrypted using Aleo's record model. Only authorized parties can decrypt their own data, while the network verifies correctness through zero-knowledge proofs.

---

## 🏗️ Contract Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    PAYROLL.ALEO                          │
│  Private salary streams | Withdrawals | Stream control   │
└──────────────────────────────────────────────────────────┘
                            ▲
                            │ (calls for compliance checks)
                            ▼
┌──────────────────────────────────────────────────────────┐
│                  COMPLIANCE.ALEO                         │
│  Solvency proofs | Tax verification | Selective disclosure│
└──────────────────────────────────────────────────────────┘
                            ▲
                            │ (queries treasury balance)
                            ▼
┌──────────────────────────────────────────────────────────┐
│                   TREASURY.ALEO                          │
│  Deposit funds | Allocate to streams | Balance tracking  │
└──────────────────────────────────────────────────────────┘
```

---

## 📦 Directory Structure

```
contracts/
├── payroll/
│   ├── src/
│   │   └── main.leo              # Payroll streaming logic
│   ├── inputs/
│   │   ├── create_stream.in      # Test inputs for stream creation
│   │   └── withdraw.in           # Test inputs for withdrawals
│   ├── build/                    # Compiled program (auto-generated)
│   ├── program.json              # Program metadata
│   └── README.md                 # Payroll-specific docs
│
├── compliance/
│   ├── src/
│   │   └── main.leo              # ZK compliance proofs
│   ├── inputs/
│   │   ├── prove_solvency.in
│   │   └── prove_tax.in
│   ├── build/
│   ├── program.json
│   └── README.md
│
└── treasury/
    ├── src/
    │   └── main.leo              # Treasury management
    ├── inputs/
    │   ├── deposit.in
    │   └── allocate.in
    ├── build/
    ├── program.json
    └── README.md
```

---

## 🔧 Programs Overview

### 1. Payroll.aleo

**Purpose**: Manage private salary streams and employee withdrawals

**Key Records**:
```leo
record SalaryStream {
    owner: address,           // Employee who can withdraw
    employer: address,        // Company that created stream
    amount: u64,              // Total salary amount (annual)
    rate_per_second: u64,     // Per-second accrual rate
    start_time: u64,          // Unix timestamp of stream start
    end_time: u64,            // Unix timestamp of stream end
    withdrawn: u64,           // Amount already withdrawn
}
```

**Key Transitions**:
- `create_stream()` - Employer creates salary stream for employee
- `withdraw()` - Employee withdraws accrued balance
- `terminate_stream()` - Employer ends stream early
- `pause_stream()` - Temporarily pause accrual
- `resume_stream()` - Resume paused stream
- `adjust_salary()` - Change salary amount mid-stream

**Privacy Guarantees**:
- ✅ Salary amount encrypted (only employee + employer know)
- ✅ Withdrawal amounts hidden from public
- ✅ Employee identity private (address never exposed)
- ✅ Stream existence provable without revealing details

---

### 2. Compliance.aleo

**Purpose**: Generate zero-knowledge proofs for regulatory compliance

**Key Transitions**:
```leo
// Prove company has sufficient funds for payroll
transition prove_solvency(
    treasury_balance: u64,        // Private input
    total_payroll: u64,           // Private input
) -> bool {
    // Returns true if treasury >= payroll
    // Auditor sees proof, not actual amounts
}

// Prove correct tax withholding
transition prove_tax_withholding(
    gross_salary: u64,            // Private input
    net_salary: u64,              // Private input
    tax_rate_bps: u64,            // Basis points (e.g., 2500 = 25%)
) -> bool {
    // Returns true if math is correct
    // Tax authority verifies without seeing individual salaries
}

// Generate selective disclosure for auditor
transition generate_audit_proof(
    stream: SalaryStream,         // Private record
    disclosure_mask: u8,          // Bitmask: which fields to reveal
) -> AuditProof {
    // Returns proof revealing only selected fields
    // e.g., mask = 0b00000011 reveals only amount + tax
}
```

**Use Cases**:
- Annual audit without exposing employee data
- Tax compliance verification
- Investor due diligence (prove runway without revealing burn rate)
- Regulatory reporting with minimal disclosure

**Privacy Guarantees**:
- ✅ Auditor verifies correctness without seeing raw data
- ✅ Selective disclosure - reveal only what's necessary
- ✅ Proof is non-interactive (auditor doesn't need private keys)

---

### 3. Treasury.aleo

**Purpose**: Manage company funds and allocate to salary streams

**Key Records**:
```leo
record TreasuryBalance {
    owner: address,              // Company address
    balance: u64,                // Total funds (private)
    allocated: u64,              // Funds locked in streams
    available: u64,              // Funds available for new streams
    last_updated: u64,           // Timestamp of last change
}
```

**Key Transitions**:
```leo
// Deposit funds into treasury
transition deposit(
    treasury: TreasuryBalance,
    amount: u64,
) -> TreasuryBalance {
    // Increases balance and available funds
}

// Allocate funds to new salary stream
transition allocate_to_stream(
    treasury: TreasuryBalance,
    stream_amount: u64,
) -> TreasuryBalance {
    // Reduces available, increases allocated
    // Fails if insufficient funds
}

// Release funds from terminated stream
transition release_from_stream(
    treasury: TreasuryBalance,
    released_amount: u64,
) -> TreasuryBalance {
    // Reduces allocated, increases available
}

// Emergency withdrawal (admin only)
transition emergency_withdraw(
    treasury: TreasuryBalance,
    amount: u64,
) -> (TreasuryBalance, u64) {
    // Returns updated treasury + withdrawal amount
}
```

**Privacy Guarantees**:
- ✅ Treasury balance never exposed publicly
- ✅ Allocation decisions private
- ✅ Competitors can't see company runway

---

## 🚀 Quick Start

### Prerequisites

1. Install Leo CLI:
```bash
curl -L https://raw.githubusercontent.com/AleoHQ/leo/testnet3/install.sh | sh
```

2. Verify installation:
```bash
leo --version
```

3. Get Aleo testnet credits:
- Visit [https://faucet.aleo.org](https://faucet.aleo.org)
- Enter your Aleo address
- Request testnet credits

---

### Build Contracts

```bash
# Navigate to each program directory and build
cd payroll
leo build

cd ../compliance
leo build

cd ../treasury
leo build
```

**Output**: Compiled programs in `build/` directories

---

### Run Tests

```bash
# Test payroll contract
cd payroll
leo run create_stream

# Test with custom inputs
leo run withdraw --input inputs/withdraw.in

# Test all transitions
leo test
```

---

### Deploy to Testnet

```bash
# Deploy payroll program
cd payroll
leo deploy --network testnet3 --private-key <YOUR_PRIVATE_KEY>

# Note the program ID (e.g., payroll_abc123.aleo)

# Deploy other programs
cd ../compliance
leo deploy --network testnet3 --private-key <YOUR_PRIVATE_KEY>

cd ../treasury
leo deploy --network testnet3 --private-key <YOUR_PRIVATE_KEY>
```

**Important**: Save all program IDs - you'll need them for frontend integration.

---

### Execute Transitions

```bash
# Create a salary stream (employer)
leo execute create_stream \
    aleo1employee... \
    100000u64 \
    31536000u64 \
    --network testnet3 \
    --private-key <EMPLOYER_PRIVATE_KEY>

# Withdraw earned salary (employee)
leo execute withdraw \
    <STREAM_RECORD> \
    1706140800u64 \
    --network testnet3 \
    --private-key <EMPLOYEE_PRIVATE_KEY>
```

---

## 🧪 Testing

### Unit Tests

Each program includes comprehensive unit tests:

```bash
# Run all tests
leo test

# Run specific test
leo test test_create_stream

# Run with verbose output
leo test --verbose
```

### Integration Tests

Test cross-program interactions:

```bash
# Example: Create stream → Withdraw → Prove solvency
./scripts/integration_test.sh
```

### Test Coverage

- ✅ **Stream creation** with various parameters
- ✅ **Withdrawal** with partial and full amounts
- ✅ **Stream termination** before end date
- ✅ **Solvency proofs** with edge cases
- ✅ **Tax calculations** for multiple jurisdictions
- ✅ **Treasury operations** with insufficient funds

---

## 📝 Example Usage

### Scenario: Company Pays Employee

**Step 1: Company deposits to treasury**
```bash
leo execute deposit \
    <TREASURY_RECORD> \
    1000000u64 \
    --network testnet3
```

**Step 2: Allocate funds to employee stream**
```bash
leo execute allocate_to_stream \
    <TREASURY_RECORD> \
    100000u64 \
    --network testnet3
```

**Step 3: Create salary stream**
```bash
leo execute create_stream \
    aleo1employee... \
    100000u64 \
    31536000u64 \
    --network testnet3
```

**Step 4: Employee withdraws after 1 month**
```bash
# 1 month = ~2,592,000 seconds
# Accrued = 100000 / 31536000 * 2592000 ≈ 8219 USDC

leo execute withdraw \
    <STREAM_RECORD> \
    <CURRENT_TIMESTAMP> \
    --network testnet3
```

**Step 5: Employer proves solvency to investor**
```bash
leo execute prove_solvency \
    900000u64 \        # Remaining treasury
    91781u64 \         # Remaining payroll obligation
    --network testnet3

# Investor sees: ✅ Proof valid
# Investor does NOT see: actual amounts
```

---

## 🔒 Security Considerations

### Access Control

- **Stream Creation**: Only employers can create streams
- **Withdrawals**: Only stream owner (employee) can withdraw
- **Treasury**: Only company owner can manage funds
- **Compliance Proofs**: Can be generated by employer, verified by anyone

### Validation

All transitions include validation:
```leo
// Example from payroll.leo
assert(amount > 0u64);                    // Positive amounts only
assert(end_time > start_time);            // Valid time range
assert(employee != employer);             // No self-payment
```

### Known Limitations

- ⚠️ **No partial withdrawals yet** - Employees must withdraw full accrued amount
- ⚠️ **Single currency** - Only supports one token (USDC planned)
- ⚠️ **No automatic streaming** - Withdrawals are manual (auto planned for Wave 8)

### Audit Status

- [ ] Internal review completed
- [ ] Third-party audit scheduled (Wave 9)
- [ ] Formal verification in progress

---

## 🛠️ Development Guide

### Adding a New Transition

1. **Define function signature**:
```leo
transition my_new_function(
    param1: u64,
    param2: address,
) -> MyRecord {
    // Implementation
}
```

2. **Add validation**:
```leo
assert(param1 > 0u64);
assert(param2 != self.caller);
```

3. **Create test inputs** in `inputs/my_new_function.in`:
```
[main]
param1: u64 = 12345u64;
param2: address = aleo1...;
```

4. **Add unit test**:
```leo
#[test]
function test_my_new_function() {
    let result = my_new_function(12345u64, aleo1...);
    assert(result.field == expected_value);
}
```

5. **Build and test**:
```bash
leo build
leo test test_my_new_function
```

### Optimizing Gas Costs

- **Minimize record fields** - Each field increases proof size
- **Batch operations** - Combine multiple updates into one transition
- **Use u64 instead of u128** - Smaller types = faster proving
- **Avoid nested structs** - Flatten data structures when possible

### Debugging Tips

```bash
# Print execution trace
leo run my_function --verbose

# Check compiled output
cat build/main.aleo

# Verify program hash
leo verify
```

---

## 📚 Resources

### Leo Language Documentation
- [Leo Language Guide](https://developer.aleo.org/leo/)
- [Leo Standard Library](https://developer.aleo.org/leo/language#standard-library)
- [Leo by Example](https://developer.aleo.org/leo/examples)

### Aleo Network
- [Aleo Developer Docs](https://developer.aleo.org)
- [Aleo Explorer](https://explorer.aleo.org)
- [Testnet Faucet](https://faucet.aleo.org)

### Community
- [Aleo Discord](https://discord.gg/aleo) - #leo-dev channel
- [Aleo GitHub](https://github.com/AleoHQ/leo)
- [Aleo Forum](https://community.aleo.org)

---

## 🤝 Contributing

We welcome contributions to improve our Leo programs!

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/improve-payroll`
3. **Make your changes** to `.leo` files
4. **Run tests**: `leo test`
5. **Commit**: `git commit -m 'Improve payroll gas efficiency'`
6. **Push**: `git push origin feature/improve-payroll`
7. **Open Pull Request**

### Areas for Improvement

- ⚡ **Gas Optimization**: Reduce proof generation time
- 🔐 **Security**: Find edge cases or vulnerabilities
- ✨ **Features**: Add support for bonuses, deductions, etc.
- 📖 **Documentation**: Improve inline comments and examples

---

## 📜 License

MIT License - See [LICENSE](../LICENSE) file for details

---

## 🙏 Acknowledgments

- **Aleo Team** for the Leo language and excellent documentation
- **Aleo Community** for feedback on program design
- **Sablier** for inspiration on streaming payment models

---

**Need Help?**

- 💬 Join [Aleo Discord](https://discord.gg/aleo) - Tag @ayomisco
- 📧 Email: [your-email]
- 🐛 [Open an Issue](https://github.com/Ayomisco/jetrpay-aleo/issues)

---

<div align="center">

**Built with Leo on Aleo Network**

*Privacy-First | Zero-Knowledge | Production-Ready*

</div>
