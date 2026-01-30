program jetrpay_payroll_testnet_v1.aleo;

record Token:
    owner as address.private;
    amount as u64.private;

record SalaryStream:
    owner as address.private;
    issuer as address.private;
    rate_per_block as u64.private;
    start_block as u32.private;
    last_updated_block as u32.private;
    max_cap as u64.private;
    total_claimed as u64.private;
    unclaimed_balance as u64.private;

function mint_private:
    input r0 as address.public;
    input r1 as u64.public;
    cast r0 r1 into r2 as Token.record;
    output r2 as Token.record;

function create_stream:
    input r0 as address.public;
    input r1 as u64.public;
    input r2 as u64.public;
    input r3 as u32.public;
    cast r0 self.caller r1 r3 r3 r2 0u64 0u64 into r4 as SalaryStream.record;
    output r4 as SalaryStream.record;

function claim_salary:
    input r0 as SalaryStream.record;
    input r1 as u64.private;
    input r2 as u32.public;
    sub r2 r0.last_updated_block into r3;
    cast r3 into r4 as u64;
    mul r4 r0.rate_per_block into r5;
    add r0.unclaimed_balance r5 into r6;
    lte r1 r6 into r7;
    assert.eq r7 true;
    add r0.total_claimed r1 into r8;
    lte r8 r0.max_cap into r9;
    assert.eq r9 true;
    sub r6 r1 into r10;
    cast r0.owner r0.issuer r0.rate_per_block r0.start_block r2 r0.max_cap r8 r10 into r11 as SalaryStream.record;
    cast r0.owner r1 into r12 as Token.record;
    output r11 as SalaryStream.record;
    output r12 as Token.record;
