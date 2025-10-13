from fastapi import APIRouter, HTTPException, UploadFile, File
from app.models.model_penjualan import Penjualan
from app.database import db
import pandas as pd
import io

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

# UPLOAD CSV
@router.post("/upload-csv")
async def upload_csv(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        df = pd.read_csv(io.StringIO(contents.decode("utf-8")))

        # Cek apakah kolom CSV sesuai model
        expected_columns = {"Kode_Item", "Nama_Item", "Jenis", "Jumlah", "Satuan", "Total_Harga", "Bulan", "Tahun"}
        if not expected_columns.issubset(df.columns):
            raise HTTPException(status_code=400, detail=f"Kolom CSV harus mengandung: {expected_columns}")

        data_dict = df.to_dict(orient="records")
        if not data_dict:
            raise HTTPException(status_code=400, detail="File CSV kosong")

        # Masukkan data ke MongoDB
        db.penjualan.insert_many(data_dict)
        return {"message": f"Berhasil mengunggah {len(data_dict)} data penjualan dari CSV"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
