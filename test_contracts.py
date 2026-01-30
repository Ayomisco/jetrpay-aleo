import subprocess
import re
import json
import os

CONTRACT_DIR = "contracts/jetrpay_payroll"
CONTRACT_NAME = "jetrpay_payroll_testnet_v1"

def run_leo(command, args):
    full_cmd = f"leo run {command} {' '.join(args)}"
    print(f"Running: {full_cmd}")
    result = subprocess.run(
        full_cmd, 
        shell=True, 
        cwd=CONTRACT_DIR, 
        capture_output=True, 
        text=True
    )
    if result.returncode != 0:
        print("Error:")
        print(result.stderr)
        raise Exception(f"Command failed: {full_cmd}")
    return result.stdout

def parse_record(output, record_name):
    matches = list(re.finditer(r"(\{[\s\S]*?owner:[\s\S]*?\})", output))
    if matches:
        return matches[-1].group(1)
    else:
        print("Could not find record in output.")
        return None

def set_private_key(private_key):
    env_path = os.path.join(CONTRACT_DIR, ".env")
    with open(env_path, "w") as f:
        f.write(f"PRIVATE_KEY={private_key}\n")
    print(f"Updated .env with key ending in ...{private_key[-6:]}")

def test_payroll_flow():
    print("=== Starting Payroll Test Flow ===")
    
    # 1. Setup Identities
    # Employer (Sender) - Matches the address that worked earlier
    employer_pk = "APrivateKey1zkp2kYUrU4BkmM5VDNn4M6yqyPsgGygfiXv6scy3LWXrqNQ" 
    employer = "aleo1s9pvupqdm6h6avt40qx49le87ccxdl67djqts0uqv8pv4d207spqddqhwv"
    
    # Employee (Receiver)
    employee_pk = "APrivateKey1zkpA5u23adZcMsKyeqK1mCbwVNvXa1MhMd9Ujd3wi2DdxJq"
    employee = "aleo1lv904qfe2en9x5xh80hn7fpped2y5hyearkzz9urh3rgz30dcu9suvg63l"
    
    # Set default key for Mint and Create Stream (Employer actions)
    set_private_key(employer_pk)
    
    # 2. Mint Tokens
    print("\n--- Step 1: Minting Tokens ---")
    # Mint to EMPLOYER so they can pay? 
    # Actually create_stream just creates a record, doesn't transfer tokens in this simple V1 logic yet
    # But let's mint to employer for completeness.
    run_leo("mint_private", [employer, "1000000u64"])
    
    # 3. Create Stream
    print("\n--- Step 2: Creating Stream ---")
    rate = "10u64"
    max_amount = "10000u64"
    start_time = "0u32"
    
    output = run_leo("create_stream", [employee, rate, max_amount, start_time])
    stream_record = parse_record(output, "SalaryStream")
    
    if not stream_record:
        print("Failed to get stream record.")
        return

    print(f"Stream Created! Record:\n{stream_record}")
    
    # 4. Claim Salary
    print("\n--- Step 3: Claiming Salary ---")
    
    # SWITCH TO EMPLOYEE KEY
    set_private_key(employee_pk)
    
    claim_amount = "50u64"
    current_height = "100u32"
    
    clean_record = " ".join(stream_record.split())
    
    args = [f"'{clean_record}'", claim_amount, current_height]
    
    output = run_leo("claim_salary", args)

    print("Claim Output:")
    print(output)
    
    if "owner:" in output and "amount:" in output:
        print(f"\nSUCCESS! Salary Claimed.")
    else:
        print("Failed to parse claim outputs.")

if __name__ == "__main__":
    test_payroll_flow()
