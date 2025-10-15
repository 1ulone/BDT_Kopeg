from fastapi import APIRouter, HTTPException, UploadFile, File, Query
from app.models.model_pembelian import Pembelian
from app.database import db
from app.database import db_async
import pandas as pd
import io
from fastapi.responses import JSONResponse
from typing import List

router = APIRouter(prefix="/pembelian", tags=["Pembelian"])

# =====================================================
# CRUD
# =====================================================

@router.post("/")
def tambah_pembelian(data: Pembelian):
    db.pembelian.insert_one(data.dict())
    return {"message": "Data pembelian berhasil ditambahkan"}

@router.get("/")
def ambil_semua_pembelian():
    items = list(db.pembelian.find({}, {"_id": 0}))
    return {"data": items}

@router.put("/{kode_item}")
def update_pembelian(kode_item: int, data: Pembelian):
    result = db.pembelian.update_one(
        {"Kode_Item": kode_item},
        {"$set": data.dict()}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Data tidak ditemukan")
    return {"message": "Data pembelian berhasil diperbarui"}

@router.delete("/{kode_item}")
def hapus_pembelian(kode_item: int):
    result = db.pembelian.delete_one({"Kode_Item": kode_item})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Data tidak ditemukan")
    return {"message": "Data pembelian berhasil dihapus"}


# =====================================================
# UPLOAD FILE (CSV atau XLSX)
# =====================================================

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        filename = file.filename.lower()

        # Cek format file
        if filename.endswith(".csv"):
            df = pd.read_csv(io.StringIO(contents.decode("utf-8")))
        elif filename.endswith(".xlsx"):
            df = pd.read_excel(io.BytesIO(contents))
        else:
            raise HTTPException(status_code=400, detail="Format file tidak didukung. Hanya CSV atau XLSX yang diperbolehkan.")

        # Normalisasi nama kolom biar sesuai model
        df.rename(columns={
            "Nama_Barang": "Nama_Item",
            "Qty_SO": "Jumlah"
        }, inplace=True)

        # Validasi kolom sesuai model
        expected_columns = {"Kode_Item", "Nama_Item", "Jenis", "Jumlah", "Satuan", "Total_Harga", "Bulan", "Tahun"}
        if not expected_columns.issubset(df.columns):
            raise HTTPException(status_code=400, detail=f"Kolom file harus mengandung: {expected_columns}")

        # Ubah ke dictionary untuk disimpan di MongoDB
        data_dict = df.to_dict(orient="records")
        if not data_dict:
            raise HTTPException(status_code=400, detail="File kosong atau tidak memiliki data valid")

        # Masukkan ke database
        db.pembelian.insert_many(data_dict)
        return {"message": f"Berhasil mengunggah {len(data_dict)} data pembelian dari file {filename}"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal memproses file: {str(e)}")


# =====================================================
# STATISTIK (untuk grafik di React)
# =====================================================

@router.get("/statistik")
def get_statistik_pembelian():
    try:
        data = list(db.pembelian.find({}, {"_id": 0}))
        if not data:
            raise HTTPException(status_code=404, detail="Tidak ada data pembelian di database")

        df = pd.DataFrame(data)
        df["Jumlah"] = pd.to_numeric(df["Jumlah"], errors="coerce")
        df["Total_Harga"] = pd.to_numeric(df["Total_Harga"], errors="coerce")

        total_per_jenis = df.groupby("Jenis")["Total_Harga"].sum().reset_index()
        jumlah_per_jenis = df.groupby("Jenis")["Jumlah"].sum().reset_index()
        top_items = df.nlargest(5, "Total_Harga")[["Kode_Item", "Nama_Item", "Jenis", "Jumlah", "Satuan", "Total_Harga", "Bulan", "Tahun"]]
        total_per_bulan = df.groupby("Bulan")["Total_Harga"].sum().reset_index()
        total_per_tahun = df.groupby("Tahun")["Total_Harga"].sum().reset_index()

        return {
            "total_per_jenis": total_per_jenis.to_dict(orient="records"),
            "jumlah_per_jenis": jumlah_per_jenis.to_dict(orient="records"),
            "top_items": top_items.to_dict(orient="records"),
            "total_per_bulan": total_per_bulan.to_dict(orient="records"),
            "total_per_tahun": total_per_tahun.to_dict(orient="records")
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal menghasilkan statistik: {e}")


# =====================================================
# OPNAME PRODUK (Upload CSV + Bandingkan Data Lama)
# =====================================================

@router.post("/opname")
async def upload_opname(
    file: UploadFile = File(...),
    page: int = Query(1, ge=1),
    per_page: int = Query(500, ge=1, le=5000)
):
    try:
        # --- 1️⃣ Read uploaded file ---
        contents = await file.read()
        filename = file.filename.lower()

        if filename.endswith(".csv"):
            df_new = pd.read_csv(io.StringIO(contents.decode("utf-8")))
        elif filename.endswith(".xlsx"):
            df_new = pd.read_excel(io.BytesIO(contents))
        else:
            raise HTTPException(status_code=400, detail="Format file tidak didukung. Hanya CSV atau XLSX.")

        # Normalize column names
        df_new.rename(columns={
            "Nama_Barang": "Nama_Item",
            "Qty_SO": "Jumlah"
        }, inplace=True)

        expected_cols = {"Kode_Item", "Nama_Item", "Jumlah"}
        if not expected_cols.issubset(df_new.columns):
            raise HTTPException(status_code=400, detail=f"File harus memiliki kolom: {expected_cols}")

        # Ensure correct types
        df_new["Kode_Item"] = df_new["Kode_Item"].astype(str)
        df_new["Nama_Item"] = df_new["Nama_Item"].astype(str)
        df_new["Jumlah"] = pd.to_numeric(df_new["Jumlah"], errors="coerce").fillna(0)

        # --- 2️⃣ Fetch relevant DB records ---
        kode_items = df_new["Kode_Item"].unique().tolist()
        cursor = db_async.pembelian.find(
            {"Kode_Item": {"$in": kode_items}},
            {"_id": 0, "Kode_Item": 1, "Nama_Item": 1, "Jumlah": 1}
        )
        data_lama: List[dict] = await cursor.to_list(length=None)

        df_old = pd.DataFrame(data_lama)
        if df_old.empty:
            df_old = pd.DataFrame(columns=["Kode_Item", "Nama_Item", "Jumlah"])

        df_old["Kode_Item"] = df_old["Kode_Item"].astype(str)
        df_old["Nama_Item"] = df_old["Nama_Item"].astype(str)
        df_old["Jumlah"] = pd.to_numeric(df_old["Jumlah"], errors="coerce").fillna(0)

        # --- 3️⃣ Merge and compute difference ---
        merged = pd.merge(
            df_old, df_new,
            on="Kode_Item",
            how="outer",
            suffixes=("_lama", "_baru")
        )

        merged["Nama_Item"] = merged["Nama_Item_baru"].fillna(merged["Nama_Item_lama"])
        merged["Jumlah_lama"] = merged["Jumlah_lama"].fillna(0)
        merged["Jumlah_baru"] = merged["Jumlah_baru"].fillna(0)
        merged["Selisih"] = merged["Jumlah_baru"] - merged["Jumlah_lama"]
        merged["Stock_Fisik"] = merged["Jumlah_baru"]

        hasil = merged[["Kode_Item", "Nama_Item", "Jumlah_lama", "Stock_Fisik", "Selisih"]]

        # --- 4️⃣ Pagination ---
        total = len(hasil)
        start = (page - 1) * per_page
        end = start + per_page

        paginated = hasil.iloc[start:end].to_dict(orient="records")

        return JSONResponse({
            "message": f"Berhasil memproses opname dari file {filename}",
            "page": page,
            "per_page": per_page,
            "total_produk": total,
            "data": paginated
        })

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal memproses opname: {str(e)}")