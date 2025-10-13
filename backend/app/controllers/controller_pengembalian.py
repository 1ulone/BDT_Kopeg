from fastapi import APIRouter, HTTPException
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
        "No": item["No"],
        "Kode_Item": item["Kode_Item"],
        "Nama_Item": item["Nama_Item"],
        "Jml": item["Jml"],
        "Satuan": item["Satuan"],
        "Harga": item["Harga"],
        "Potongan": item["Potongan"],
        "Total_Harga": item["Total_Harga"],
        "Bulan": item["Bulan"],
        "Tahun": item["Tahun"]
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
