# JetrPay Payroll Contract

This Leo program implements the core privacy-preserving salary streaming logic.

## Logic
- **SalaryStream Record**: Represents an active employment contract.
- **Token Record**: Represents the private value (USDC/Credits) held by users.
- **Streaming**: Salaries accrue block-by-block.
- **Claim**: Employees can claim their accrued salary at any time without admin intervention.

## Transitions
1. `mint_private`: (Test helper) Mints tokens.
2. `create_stream`: Employer authorizes a new stream.
3. `claim_salary`: Employee withdraws accumulated funds.
