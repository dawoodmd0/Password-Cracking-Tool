import hashlib
import time
import os

WORDLIST_PATH = os.path.join(os.path.dirname(__file__), '..', 'wordlists', 'passwords.txt')

def run_dictionary_attack(target_hash: str):
    start_time = time.time()
    attempts = 0
    
    if not os.path.exists(WORDLIST_PATH):
        return {"status": "ERROR", "message": "Wordlist not found", "attempts": 0, "time_taken": 0}

    with open(WORDLIST_PATH, 'r') as f:
        words = f.read().splitlines()

    computed_entries = []
    for word in words:
        attempts += 1
        candidate_hash = hashlib.sha256(word.encode()).hexdigest()
        computed_entries.append({"candidate": word, "hash": candidate_hash})
        
        if candidate_hash == target_hash:
            end_time = time.time()
            return {
                "status": "FOUND",
                "recovered_password": word,
                "attempts": attempts,
                "time_taken": round(end_time - start_time, 5),
                "computed_entries": computed_entries
            }
            
    end_time = time.time()
    return {
        "status": "NOT_FOUND",
        "recovered_password": None,
        "attempts": attempts,
        "time_taken": round(end_time - start_time, 5),
        "computed_entries": computed_entries
    }

