from fastapi import APIRouter, HTTPException, Query, UploadFile, File
from fastapi.responses import FileResponse
from app.models.model_penjualan import Penjualan
from app.database import db
from datetime import datetime
import pandas as pd
import io, re

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

@router.get("/export")
def export_data(bulan: str = Query(...)):
    if bulan == "year":
        data = list(db.pembelian.find({}, {"_id": 0}))
    else:
        data = list(db.pembelian.find({ "Bulan": bulan }, {"_id":0}))
    df = pd.DataFrame(data)
    filename = "penjualan_export.csv"
    df.to_csv(filename, index=False)
    return FileResponse(filename, media_type="text/csv", filename=filename)

# UPLOAD CSV
@router.post("/upload-csv")
async def upload_csv(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        decoded = contents.decode("utf-8")

        # 🔹 Detect delimiter automatically
        first_line = decoded.split("\n", 1)[0]
        delimiter = ";" if ";" in first_line else ","

        # 🔹 Read with the correct delimiter
        df = pd.read_csv(io.StringIO(decoded), delimiter=delimiter)

        # ---------- Detect month & year from filename ----------
        filename = (file.filename or "").lower()
        month_map = {
            "januari": "Januari", "februari": "Februari", "maret": "Maret",
            "april": "April", "mei": "Mei", "juni": "Juni", "juli": "Juli",
            "agustus": "Agustus", "september": "September", "oktober": "Oktober",
            "november": "November", "desember": "Desember",
        }
        extracted_month = next((month_map[m] for m in month_map if m in filename), None)
        year_match = re.search(r"\b(20\d{2}|19\d{2})\b", filename)
        extracted_year = int(year_match.group(0)) if year_match else datetime.now().year
        if not extracted_month:
            extracted_month = datetime.now().strftime("%B").title()

        # ---------- Force columns to exist ----------
        for col in ["Kode_Item", "Nama_Item", "Jenis", "Jumlah", "Satuan", "Total_Harga", "Bulan", "Tahun"]:
            if col not in df.columns:
                if col == "Bulan":
                    df[col] = extracted_month
                elif col == "Tahun":
                    df[col] = extracted_year
                elif col in ["Jumlah", "Total_Harga"]:
                    df[col] = 0
                else:
                    df[col] = ""

        # ---------- Sanitize data ----------
        df["Jumlah"] = pd.to_numeric(df["Jumlah"], errors="coerce").fillna(0)
        df["Total_Harga"] = pd.to_numeric(df["Total_Harga"], errors="coerce").fillna(0)
        df["Tahun"] = pd.to_numeric(df["Tahun"], errors="coerce").fillna(extracted_year).astype(int)
        df["Bulan"] = df["Bulan"].astype(str).str.strip().str.title().replace({"": extracted_month})
        df = df.replace([float("inf"), float("-inf")], 0).fillna(0)

        # ---------- Insert into DB ----------
        data_dict = df.to_dict(orient="records")
        if not data_dict:
            raise HTTPException(status_code=400, detail="File CSV kosong atau tidak valid")

        db.penjualan.insert_many(data_dict)

        return {
            "message": f"Berhasil mengunggah {len(data_dict)} baris data penjualan.",
            "detected_month": str(extracted_month),
            "detected_year": int(extracted_year),
            "used_delimiter": delimiter
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

