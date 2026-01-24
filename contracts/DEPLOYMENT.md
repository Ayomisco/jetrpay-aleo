# Deployment Guide for JetrPay Aleo

This guide covers building and deploying the `jetrpay_payroll` smart contract to the Aleo Testnet.

## Prerequisites
- [Leo Language](https://developer.aleo.org/leo/installation) installed.
- [SnarkOS](https://developer.aleo.org/snarkos/installation) installed.
- An Aleo account with credits (faucet) for gas fees.

## 1. Build the Contract
Navigate to the contract directory:
```bash
cd contracts/jetrpay_payroll
leo build
```

## 2. Deploy to Testnet3
Set your private key:
```bash
export PRIVATE_KEY="APrivateKey1..."
```

Deploy the program:
```bash
leo deploy jetrpay_payroll_testnet_v1.aleo
```
*Note: Ensure the program name `jetrpay_payroll_testnet_v1.aleo` is unique. If it fails, change the name in `program.json` and `src/main.leo`.*

## 3. Interact

### Mint Initial Supply (Test Only)
```bash
leo run mint_private aleo1... 1000000u64
```

### Create a Salary Stream
```bash
leo run create_stream aleo1employee_address... 5u64 500000u64
```

### Claim Salary
To claim, the employee must use the record output from `create_stream`.
```bash
leo run claim_salary "{ ...record_data... }" 1000u64
```
