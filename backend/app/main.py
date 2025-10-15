from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.controllers import (
    controller_pembelian,
    controller_penjualan,
    controller_pengembalian,
    controller_opname
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(controller_pembelian.router)
app.include_router(controller_penjualan.router)
app.include_router(controller_pengembalian.router)
app.include_router(controller_opname.router)
