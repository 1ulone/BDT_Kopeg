from fastapi import APIRouter, UploadFile, File, HTTPException
import pandas as pd
from bson import ObjectId
from app.models.model_pengembalian import Pengembalian
from app.database import db

router = APIRouter(
    prefix="/pengembalian",
    tags=["Pengembalian"]
)
collection = db["pengembalian"]

# Helper: ubah ObjectId MongoDB jadi string
def pengembalian_serializer(item) -> dict:
    return {
        "id": str(item["_id"]),
        "No": item.get("No"),
        "Kode_Item": item.get("Kode_Item"),
        "Nama_Item": item.get("Nama_Item"),
        "Jml": item.get("Jml"),
        "Satuan": item.get("Satuan"),
        "Harga": item.get("Harga"),
        "Potongan": item.get("Potongan"),
        "Total_Harga": item.get("Total_Harga"),
        "Bulan": item.get("Bulan"),
        "Tahun": item.get("Tahun"),
    }

# GET semua data pengembalian
@router.get("/")
def get_all_pengembalian():
    pengembalians = list(collection.find())
    return [pengembalian_serializer(item) for item in pengembalians]

# POST tambah data pengembalian
@router.post("/")
def add_pengembalian(data: Pengembalian):
    inserted = collection.insert_one(data.dict())
    new_data = collection.find_one({"_id": inserted.inserted_id})
    return pengembalian_serializer(new_data)

# ✅ UPLOAD CSV ke MongoDB
@router.post("/upload-csv")
async def upload_csv(file: UploadFile = File(...)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="File harus berformat CSV")

    # Baca CSV menggunakan pandas
    try:
        df = pd.read_csv(file.file)
    except Exception:
        raise HTTPException(status_code=400, detail="Gagal membaca file CSV")

    # Pastikan kolom sesuai dengan koleksi
    required_columns = ["No", "Kode_Item", "Nama_Item", "Jml", "Satuan", "Harga", "Potongan", "Total_Harga", "Bulan", "Tahun"]
    for col in required_columns:
        if col not in df.columns:
            raise HTTPException(status_code=400, detail=f"Kolom '{col}' tidak ditemukan di CSV")

    # Konversi DataFrame ke list of dict
    data_dicts = df.to_dict(orient="records")

    # Simpan semua data ke MongoDB
    if data_dicts:
        collection.insert_many(data_dicts)

    return {"message": f"Berhasil mengimpor {len(data_dicts)} data dari CSV"}

# PUT edit data pengembalian
@router.put("/{id}")
def update_pengembalian(id: str, data: Pengembalian):
    updated = collection.update_one({"_id": ObjectId(id)}, {"$set": data.dict()})
    if updated.modified_count == 0:
        raise HTTPException(status_code=404, detail="Data tidak ditemukan")
    new_data = collection.find_one({"_id": ObjectId(id)})
    return pengembalian_serializer(new_data)

# DELETE hapus data pengembalian
@router.delete("/{id}")
def delete_pengembalian(id: str):
    deleted = collection.delete_one({"_id": ObjectId(id)})
    if deleted.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Data tidak ditemukan")
    return {"message": "Data pengembalian berhasil dihapus"}
