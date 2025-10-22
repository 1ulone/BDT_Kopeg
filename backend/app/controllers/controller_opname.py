from fastapi import APIRouter, HTTPException, UploadFile, File, Query
from fastapi.responses import JSONResponse
from app.database import db, db_async
from typing import List
import pandas as pd
import io, re

router = APIRouter(prefix="/opname", tags=["Opname"])


@router.get("/")
def get_all_produk(dbase: str = Query(...)):
    print(dbase)
    if dbase == 0:
        items = list(db.pembelian.find({}, {"_id": 0, "Kode_Item": 1, "Nama_Item": 1, "Jumlah": 1, "Satuan":1, "Bulan":1}))
    else:
        items = list(db.penjualan.find({}, {"_id": 0, "Kode_Item": 1, "Nama_Item": 1, "Jumlah": 1, "Satuan":1, "Bulan":1}))
    return {"data": items}


# --- Utility: normalize any Kode_Item safely ---
def normalize_kode_val(v):
    if pd.isna(v) or v == "":
        return ""
    s = str(v).strip()
    # handle numeric / scientific notation / trailing .0
    if re.match(r"^[\d\.\+Ee-]+$", s):
        try:
            s = str(int(float(s)))
        except Exception:
            pass
    s = re.sub(r"\.0+$", "", s)
    return s

@router.post("/check")
async def upload_opname(
    file: UploadFile = File(...),
    page: int = Query(1, ge=1),
    per_page: int = Query(500, ge=1, le=5000)
):
    try:
        contents = await file.read()
        filename = file.filename.lower()

        # --- Read file ---
        if filename.endswith(".csv"):
            df_new = pd.read_csv(io.StringIO(contents.decode("utf-8")), dtype=str)
        elif filename.endswith(".xlsx"):
            df_new = pd.read_excel(io.BytesIO(contents), dtype=str)
        else:
            raise HTTPException(status_code=400, detail="Format file tidak didukung. Hanya CSV atau XLSX.")

        df_new.columns = [c.strip() for c in df_new.columns]
        df_new.rename(columns={
            "Kode Item": "Kode_Item",
            "Nama Barang": "Nama_Item",
            "Qty_SO": "Jumlah"
        }, inplace=True)

        def normalize_kode(v):
            if pd.isna(v) or str(v).strip() == "":
                return None
            s = str(v).strip()
            if re.match(r"^[\d\.\+Ee-]+$", s):
                try:
                    s = str(int(float(s)))
                except:
                    pass
            return s

        df_new["Kode_Item"] = df_new["Kode_Item"].apply(normalize_kode)
        df_new.dropna(subset=["Kode_Item"], inplace=True)
        df_new["Jumlah"] = pd.to_numeric(df_new["Jumlah"], errors="coerce").fillna(0)

        kode_items = df_new["Kode_Item"].unique().tolist()
        kode_items_num = []
        for k in kode_items:
            try:
                kode_items_num.append(float(k))
            except:
                pass

        # --- Query DB ---
        cursor = db_async.pembelian.find(
            {
                "$or": [
                    {"Kode_Item": {"$in": kode_items}},
                    {"Kode_Item": {"$in": kode_items_num}},
                ]
            },
            {"_id": 0, "Kode_Item": 1, "Nama_Item": 1, "Jumlah": 1, "Satuan":1, "Bulan":1}
        )
        data_lama = await cursor.to_list(length=None)

        df_old = pd.DataFrame(data_lama)
        if df_old.empty:
            df_old = pd.DataFrame(columns=["Kode_Item", "Nama_Item", "Jumlah", "Satuan"])

        df_old["Kode_Item"] = df_old["Kode_Item"].apply(normalize_kode)
        df_old.dropna(subset=["Kode_Item"], inplace=True)
        df_old["Jumlah"] = pd.to_numeric(df_old["Jumlah"], errors="coerce").fillna(0)

        # --- Explicitly force dtype for merge ---
        df_old["Kode_Item"] = df_old["Kode_Item"].astype(str)
        df_new["Kode_Item"] = df_new["Kode_Item"].astype(str)

        # --- Merge ---
        merged = pd.merge(
            df_old, df_new,
            on="Kode_Item",
            how="outer",
            suffixes=("_lama", "_baru")
        )

        merged["Nama_Item"] = merged["Nama_Item_baru"].fillna(merged["Nama_Item_lama"])
        merged["Jumlah_lama"] = merged["Jumlah_lama"].fillna(0)
        merged["Jumlah_baru"] = merged["Jumlah_baru"].fillna(0)
        merged["Selisih"] = (merged["Jumlah_baru"] - merged["Jumlah_lama"])
        merged["Stock_Fisik"] = merged["Jumlah_baru"]
        merged["Satuan"] = df_old["Satuan"]
        merged["Bulan"] = df_old["Bulan"]

        hasil = merged[["Kode_Item", "Nama_Item", "Jumlah_lama", "Stock_Fisik", "Selisih", "Satuan", "Bulan"]]
        hasil = hasil.fillna({
            "Nama_Item": "",
            "Jumlah_lama": 0,
            "Stock_Fisik": 0,
            "Selisih": 0,
        })

        # --- Debug check again ---
        print("\n[VERIFY] merge result sample:")
        print(hasil.head(10).to_dict())

        total = len(hasil)
        start = (page - 1) * per_page
        end = start + per_page
        paginated = hasil.iloc[start:end].to_dict(orient="records")

        print("hasil shape:", hasil.shape)
        print("hasil columns:", hasil.columns.tolist())
        print("hasil head:", hasil.head(5).to_dict())

        try:
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
        except Exception as err:
            print("PAGINATION / RESPONSE ERROR:", repr(err))
            raise

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal memproses opname: {str(e)}")
