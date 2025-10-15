from fastapi import APIRouter, HTTPException, UploadFile, File
from app.models.model_pembelian import Pembelian
from app.database import db
import pandas as pd
import io

router = APIRouter(prefix="/pembelian", tags=["Pembelian"])

# =====================================================
# CRUD
# =====================================================

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

# =====================================================
# UPLOAD CSV
# =====================================================

@router.post("/upload-csv")
async def upload_csv(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        df = pd.read_csv(io.StringIO(contents.decode("utf-8")))

        # cek apakah kolom CSV sesuai dengan model
        expected_columns = {"Kode_Item", "Nama_Item", "Jenis", "Jumlah", "Satuan", "Total_Harga", "Bulan", "Tahun"}
        if not expected_columns.issubset(df.columns):
            raise HTTPException(status_code=400, detail=f"Kolom CSV harus mengandung: {expected_columns}")

        data_dict = df.to_dict(orient="records")
        if not data_dict:
            raise HTTPException(status_code=400, detail="File CSV kosong")

        # masukkan ke database
        db.pembelian.insert_many(data_dict)
        return {"message": f"Berhasil mengunggah {len(data_dict)} data pembelian dari CSV"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



# =====================================================
# STATISTIK (untuk grafik di React)
# =====================================================

@router.get("/statistik")
def get_statistik_pembelian():
    try:
        # Ambil semua data dari MongoDB
        data = list(db.pembelian.find({}, {"_id": 0}))
        if not data:
            raise HTTPException(status_code=404, detail="Tidak ada data pembelian di database")

        df = pd.DataFrame(data)

        # Pastikan kolom numerik dikonversi dengan benar
        df["Jumlah"] = pd.to_numeric(df["Jumlah"], errors="coerce")
        df["Total_Harga"] = pd.to_numeric(df["Total_Harga"], errors="coerce")

        # === ANALISIS UTAMA ===
        total_per_jenis = df.groupby("Jenis")["Total_Harga"].sum().reset_index()
        jumlah_per_jenis = df.groupby("Jenis")["Jumlah"].sum().reset_index()
        top_items = df.nlargest(5, "Total_Harga")[["Kode_Item", "Nama_Item", "Jenis", "Jumlah", "Satuan", "Total_Harga", "Bulan", "Tahun"]]
        total_per_bulan = df.groupby("Bulan")["Total_Harga"].sum().reset_index()

        # (opsional) total per tahun
        total_per_tahun = df.groupby("Tahun")["Total_Harga"].sum().reset_index()

        # === RETURN ===
        return {
            "total_per_jenis": total_per_jenis.to_dict(orient="records"),
            "jumlah_per_jenis": jumlah_per_jenis.to_dict(orient="records"),
            "top_items": top_items.to_dict(orient="records"),
            "total_per_bulan": total_per_bulan.to_dict(orient="records"),
            "total_per_tahun": total_per_tahun.to_dict(orient="records")
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal menghasilkan statistik: {e}")
