import json
import hashlib
import time
import os

WORDLIST_PATH = os.path.join(os.path.dirname(__file__), '..', 'wordlists', 'passwords.txt')
RAINBOW_TABLE_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'rainbow_table.json')

def generate_rainbow_table():
    if not os.path.exists(WORDLIST_PATH):
        return {"status": "ERROR", "message": "Wordlist not found"}

    with open(WORDLIST_PATH, 'r') as f:
        words = f.read().splitlines()

    # Create a small educational mapping table
    # Precomputing for the base words, plus a few simple mutations just like the hybrid attack
    # to show that rainbow tables can cover a defined keyspace.
    mutations = ["", "1", "123"]
    
    rainbow_table = {}
    for word in words:
        for m in mutations:
            candidate = word + m
            h = hashlib.sha256(candidate.encode()).hexdigest()
            rainbow_table[h] = candidate
            
    with open(RAINBOW_TABLE_PATH, 'w') as f:
        json.dump(rainbow_table, f)
        
    return {"status": "SUCCESS", "message": "Rainbow table generated", "entries": len(rainbow_table)}

def run_rainbow_attack(target_hash: str):
    start_time = time.time()
    
    if not os.path.exists(RAINBOW_TABLE_PATH):
        # Fallback to generating it on the fly if it hasn't been generated yet for seamless experience,
        # but normally the user should click "Generate Rainbow Table"
        generate_rainbow_table()

    with open(RAINBOW_TABLE_PATH, 'r') as f:
        rainbow_table = json.load(f)

    # In a rainbow table attack, lookup is O(1) in a hash map
    attempts = 1
    
    if target_hash in rainbow_table:
        end_time = time.time()
        return {
            "status": "FOUND",
            "recovered_password": rainbow_table[target_hash],
            "attempts": attempts,
            "time_taken": round(end_time - start_time, 5)
        }
    else:
        end_time = time.time()
        return {
            "status": "NOT_FOUND",
            "recovered_password": None,
            "attempts": attempts,
            "time_taken": round(end_time - start_time, 5)
        }

def get_rainbow_table_data():
    if not os.path.exists(RAINBOW_TABLE_PATH):
        generate_rainbow_table()
        
    with open(RAINBOW_TABLE_PATH, 'r') as f:
        rainbow_table = json.load(f)
        
    return {
        "total_entries": len(rainbow_table),
        "entries": [{"hash": h, "plaintext": p} for h, p in rainbow_table.items()]
    }

