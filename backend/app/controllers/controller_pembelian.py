from fastapi import APIRouter, HTTPException
from app.models.model_pembelian import Pembelian
from app.database import db

router = APIRouter(prefix="/pembelian", tags=["Pembelian"])

# CREATE
@router.post("/")
def tambah_pembelian(data: Pembelian):
    db.pembelian.insert_one(data.dict())
    return {"message": "Data pembelian berhasil ditambahkan"}

# READ
@router.get("/")
def ambil_semua_pembelian():
    items = list(db.pembelian.find({}, {"_id": 0}))
    return {"data": items}

# UPDATE
@router.put("/{kode_item}")
def update_pembelian(kode_item: int, data: Pembelian):
    result = db.pembelian.update_one(
        {"Kode_Item": kode_item},
        {"$set": data.dict()}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Data tidak ditemukan")
    return {"message": "Data pembelian berhasil diperbarui"}

# DELETE
@router.delete("/{kode_item}")
def hapus_pembelian(kode_item: int):
    result = db.pembelian.delete_one({"Kode_Item": kode_item})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Data tidak ditemukan")
    return {"message": "Data pembelian berhasil dihapus"}
