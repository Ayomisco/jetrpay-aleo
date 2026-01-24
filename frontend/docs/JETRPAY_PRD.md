# JetrPay (Aleo) - Product Requirements Document

## Executive Summary
**JetrPay** on Aleo is a Zero-Knowledge Payroll platform. It proves that a payment was made and that the sender had sufficient funds, WITHOUT revealing who the sender was, who the recipient is, or how much was sent. This is the "Holy Grail" of compliant corporate crypto payments.

## 1. Product Vision
*   **Problem**: Compliance requires proof, but business logic requires secrecy.
*   **Solution**: Use ZK-SNARKs to satisfy both.
*   **Network**: Aleo Testnet 3.

## 2. Core Features

### 2.1 ZK-Payroll
*   **Record Model**: Money exists as encrypted "Records".
*   **Private Transitions**: The `pay` function consumes a record and outputs a new record to the employee.
*   **On-Chain Privacy**: Validated by the network, but payload is fully encrypted.

### 2.2 Proof of Solvency
*   **Feature**: A company can prove they have sufficient funds to pay next month's payroll without revealing the actual amount.

## 3. Technical Architecture (Aleo)
*   **Frontend**: Next.js 14 + Tailwind.
*   **Wallet Integration**: Leo Wallet Adapter.
*   **Smart Contract**: **Leo Language**.
    *   `payroll.leo`: Defines the `Record` structs and `transition` functions.
*   **Proving**: Client-side WASM proving (Web Worker).

## 4. User Flow
1.  **Connect**: Employer connects Leo Wallet.
2.  **Deploy**: Employer deploys a unique Payroll Record.
3.  **Execute**: Employer inputs Employee address.
4.  **Prove**: Browser generates ZK proof (takes ~5-30s).
5.  **Submit**: Transaction sent to Aleo. Recipient receives an encrypted record.
