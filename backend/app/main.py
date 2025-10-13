from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.controllers.controller_pengembalian import router as pengembalian_router

from app.controllers import (
    controller_pembelian,
    controller_penjualan
    # controller_pengembalian  ← sementara dinonaktifkan
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(pengembalian_router)
app.include_router(controller_pembelian.router)
app.include_router(controller_penjualan.router)

@app.get("/")
def home():
    return {"message": "API sudah berjalan dengan baik 🚀"}


