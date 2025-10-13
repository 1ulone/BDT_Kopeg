from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.controllers.controller_pengembalian import router as pengembalian_router

app = FastAPI()

# Allow React frontend to talk to FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or specify ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(pengembalian_router)

@app.get("/api/hello")
def hello():
    return {"message": "Hello from FastAPI!"}

