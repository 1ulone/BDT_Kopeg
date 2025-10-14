from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
<<<<<<< HEAD
from app.controllers.controller_pengembalian import router as pengembalian_router
=======
>>>>>>> b4fce6d4417816ceb2aa37fbcf253688d49fdc3d

from app.controllers import (
    controller_pembelian,
    controller_penjualan,
    controller_pengembalian
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

@app.get("/")
def home():
    return {"message": "API sudah berjalan dengan baik 🚀"}


