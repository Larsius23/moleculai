from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import molecules

app = FastAPI(
    title="MoleculeAI Platform",
    description="AI-powered molecular property prediction API",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(molecules.router, prefix="/api/v1", tags=["molecules"])

@app.get("/")
def root():
    return {"message": "MoleculeAI API is running"}

@app.get("/health")
def health():
    return {"status": "ok"}