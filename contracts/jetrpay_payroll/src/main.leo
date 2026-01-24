program jetrpay_payroll_testnet_v1.aleo {
    // The Token record representing private value (e.g. pUSDC)
    record Token {
        owner: address,
        amount: u64,
    }

    // The Salary Stream record owned by the employee
    record SalaryStream {
        owner: address,
        issuer: address,
        rate_per_block: u64,     // Salary accrual rate per block
        start_block: u32,        // When the stream started
        last_updated_block: u32, // Last time we calculated accrual
        max_cap: u64,           // Total contract value limit
        total_claimed: u64,     // How much has been withdrawn so far
        unclaimed_balance: u64, // Accrued but not yet withdrawn
    }

    // -----------------------------------------------------------------------
    // SETUP & ADMIN
    // -----------------------------------------------------------------------

    // Setup: Mint initial tokens for the employer (Simulating a deposit)
    transition mint_private(public receiver: address, public amount: u64) -> Token {
        return Token {
            owner: receiver,
            amount: amount,
        };
    }

    // -----------------------------------------------------------------------
    // PAYROLL LOGIC
    // -----------------------------------------------------------------------

    // 1. Create Stream
    // Employer creates a stream for an employee.
    transition create_stream(
        public employee: address,
        public rate: u64,
        public max_amount: u64
    ) -> SalaryStream {
        return SalaryStream {
            owner: employee,
            issuer: self.caller,
            rate_per_block: rate,
            start_block: block.height,
            last_updated_block: block.height,
            max_cap: max_amount,
            total_claimed: 0u64,
            unclaimed_balance: 0u64,
        };
    }

    // 2. Claim Salary
    // Employee claims a specific amount of their accrued salary.
    // Logic:
    // - Calculate new accrual since last update
    // - Add to existing unclaimed balance
    // - Subtract claim amount
    // - Return new Stream record and new Token record
    transition claim_salary(
        stream: SalaryStream,
        amount_to_claim: u64
    ) -> (SalaryStream, Token) {
        // Calculate time delta
        // Ensure strictly monotonic time to prevent underflow if block height is weird (unlikely but safe)
        let current_height: u32 = block.height;
        let delta_blocks: u32 = current_height - stream.last_updated_block;
        
        // Calculate value generated in this delta
        let newly_accrued: u64 = (delta_blocks as u64) * stream.rate_per_block;
        
        // Total available buffer (previously stored + newly generated)
        let total_available: u64 = stream.unclaimed_balance + newly_accrued;

        // Check against Max Cap globally
        // Remaining cap = Max Cap - Total Claimed
        // We can't let them accrue more than the remaining cap allows theoretically
        // But simpler: just check if (total_claimed + amount_to_claim) <= max_cap
        
        // Ensure sufficient balance
        assert(amount_to_claim <= total_available);
        
        // Update stats
        let new_total_claimed: u64 = stream.total_claimed + amount_to_claim;
        assert(new_total_claimed <= stream.max_cap);

        let remaining_unclaimed: u64 = total_available - amount_to_claim;

        // Output 1: Updated Stream Record
        let new_stream: SalaryStream = SalaryStream {
            owner: stream.owner,
            issuer: stream.issuer,
            rate_per_block: stream.rate_per_block,
            start_block: stream.start_block,
            last_updated_block: current_height,
            max_cap: stream.max_cap,
            total_claimed: new_total_claimed,
            unclaimed_balance: remaining_unclaimed,
        };

        // Output 2: The Payment (Fresh Token)
        let payment: Token = Token {
            owner: stream.owner,
            amount: amount_to_claim,
        };

        return (new_stream, payment);
    }
}
