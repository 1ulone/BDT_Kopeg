from fastapi import APIRouter, HTTPException
from app.models.model_penjualan import Penjualan
from app.database import db

router = APIRouter(prefix="/penjualan", tags=["Penjualan"])

# CREATE
@router.post("/")
def tambah_penjualan(data: Penjualan):
    db.penjualan.insert_one(data.dict())
    return {"message": "Data penjualan berhasil ditambahkan"}

# READ
@router.get("/")
def ambil_semua_penjualan():
    items = list(db.penjualan.find({}, {"_id": 0}))
    return {"data": items}

# UPDATE
@router.put("/{kode_item}")
def update_penjualan(kode_item: int, data: Penjualan):
    result = db.penjualan.update_one(
        {"Kode_Item": kode_item},
        {"$set": data.dict()}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Data tidak ditemukan")
    return {"message": "Data penjualan berhasil diperbarui"}

# DELETE
@router.delete("/{kode_item}")
def hapus_penjualan(kode_item: int):
    result = db.penjualan.delete_one({"Kode_Item": kode_item})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Data tidak ditemukan")
    return {"message": "Data penjualan berhasil dihapus"}
