from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import hashlib
from typing import List

import models, schemas, database
from attacks.dictionary import run_dictionary_attack
from attacks.hybrid import run_hybrid_attack
from attacks.rainbow import run_rainbow_attack, generate_rainbow_table, get_rainbow_table_data


models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Password Cracking Tool API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/register", response_model=schemas.UserResponse)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    password_hash = hashlib.sha256(user.password.encode()).hexdigest()
    
    new_user = models.User(
        username=user.username,
        password_hash=password_hash,
        hash_algorithm="SHA-256"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/login")
def login(request: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == request.username).first()
    if not user:
        return {"success": False, "message": "Invalid Username or Password"}
    
    hashed_password = hashlib.sha256(request.password.encode()).hexdigest()
    if hashed_password == user.password_hash:
        return {"success": True, "message": "Login Successful"}
    else:
        return {"success": False, "message": "Invalid Username or Password"}

@app.get("/users", response_model=List[schemas.UserResponse])
def get_users(db: Session = Depends(get_db)):
    users = db.query(models.User).all()
    return users

@app.post("/attack/dictionary")
def attack_dictionary(req: schemas.AttackRequest, db: Session = Depends(get_db)):
    result = run_dictionary_attack(req.target_hash)
    
    # Save result
    user = db.query(models.User).filter(models.User.password_hash == req.target_hash).first()
    user_id = user.id if user else None
    
    attack_result = models.AttackResult(
        user_id=user_id,
        attack_type="Dictionary Attack",
        target_hash=req.target_hash,
        status=result["status"],
        attempts=result["attempts"],
        time_taken=result["time_taken"]
    )
    db.add(attack_result)
    db.commit()
    
    return {
        "attack_type": "Dictionary Attack",
        "target_hash": req.target_hash,
        **result
    }

@app.post("/attack/hybrid")
def attack_hybrid(req: schemas.AttackRequest, db: Session = Depends(get_db)):
    result = run_hybrid_attack(req.target_hash)
    
    user = db.query(models.User).filter(models.User.password_hash == req.target_hash).first()
    user_id = user.id if user else None
    
    attack_result = models.AttackResult(
        user_id=user_id,
        attack_type="Hybrid Attack",
        target_hash=req.target_hash,
        status=result["status"],
        attempts=result["attempts"],
        time_taken=result["time_taken"]
    )
    db.add(attack_result)
    db.commit()
    
    return {
        "attack_type": "Hybrid Attack",
        "target_hash": req.target_hash,
        **result
    }

@app.post("/attack/rainbow")
def attack_rainbow(req: schemas.AttackRequest, db: Session = Depends(get_db)):
    result = run_rainbow_attack(req.target_hash)
    
    user = db.query(models.User).filter(models.User.password_hash == req.target_hash).first()
    user_id = user.id if user else None
    
    attack_result = models.AttackResult(
        user_id=user_id,
        attack_type="Rainbow Table Attack",
        target_hash=req.target_hash,
        status=result["status"],
        attempts=result["attempts"],
        time_taken=result["time_taken"]
    )
    db.add(attack_result)
    db.commit()
    
    return {
        "attack_type": "Rainbow Table Attack",
        "target_hash": req.target_hash,
        **result
    }

@app.post("/rainbow-table/generate")
def api_generate_rainbow_table():
    return generate_rainbow_table()

@app.get("/rainbow-table")
def get_rainbow_table():
    return get_rainbow_table_data()


@app.get("/attack-results", response_model=List[schemas.AttackResultResponse])
def get_attack_results(db: Session = Depends(get_db)):
    results = db.query(models.AttackResult).order_by(models.AttackResult.created_at.desc()).all()
    return results
