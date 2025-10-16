from fastapi import APIRouter, HTTPException, UploadFile, File 
from app.database import db
import pandas as pd
import numpy as np
import re

router = APIRouter(prefix="/predict", tags=["Predict"])

def predict_next_month_sales(df: pd.DataFrame, month_col="Bulan", qty_col="Jumlah", item_col="Kode_Item"):
    # Ensure correct types
    # normalize Bulan values
    df[month_col] = df[month_col].astype(str).str.strip().str.upper()

    bulan_map = {
        "JANUARI": "01", "FEBRUARI": "02", "MARET": "03", "APRIL": "04",
        "MEI": "05", "JUNI": "06", "JULI": "07", "AGUSTUS": "08",
        "SEPTEMBER": "09", "OKTOBER": "10", "NOVEMBER": "11", "DESEMBER": "12"
    }

    for name, num in bulan_map.items():
        df[month_col] = df[month_col].replace(name, f"2025-{num}")

    df = df.copy()
    df[month_col] = pd.to_datetime(df[month_col], errors="coerce", format="%Y-%m")
    df[qty_col] = pd.to_numeric(df[qty_col], errors="coerce").fillna(0)

    # Sort by date for safety
    df.sort_values(by=[item_col, month_col], inplace=True)

    # Weights for last 3 months (oldest -> newest)
    recency_weights = np.array([0.5, 0.8, 1.0])

    predictions = []

    for kode, group in df.groupby(item_col):
        group = group.tail(3)  # last 3 months
        if len(group) == 0:
            continue

        # Compute weighted moving average
        weights = recency_weights[-len(group):]
        weighted_avg = np.average(group[qty_col].values, weights=weights)

        # Calculate basic confidence (how stable recent sales are)
        if len(group) > 1:
            trend = np.corrcoef(range(len(group)), group[qty_col].values)[0, 1]
            stability = 1 - (np.std(group[qty_col]) / (np.mean(group[qty_col]) + 1e-6))
            confidence = max(0, (0.6 * (trend if not np.isnan(trend) else 0)) + 0.4 * stability)
        else:
            confidence = 0.5  # fallback for insufficient data

        predictions.append({
            "Kode_Item": kode,
            "Prediksi_Penjualan": round(weighted_avg, 2),
            "Confidence": round(confidence, 3)
        })

    hasil = pd.DataFrame(predictions)
    hasil = hasil[hasil["Prediksi_Penjualan"] > 100]
    hasil = hasil.merge(df[["Kode_Item", "Nama_Item"]], on="Kode_Item", how="left")

    # Rank by confidence descending
    hasil["Rank"] = hasil["Confidence"].rank(ascending=False, method="dense").astype(int)
    hasil.sort_values(by="Rank", inplace=True)


    return hasil.reset_index(drop=True)

def get_predicted_month(df, month_col="Bulan"):
    if df.empty or month_col not in df.columns:
        return {"error": "Kolom Bulan tidak ditemukan atau dataset kosong."}

    bulan_map = {
        "JAN": 1, "JANUARI": 1,
        "FEB": 2, "FEBRUARI": 2,
        "MAR": 3, "MARET": 3,
        "APR": 4, "APRIL": 4,
        "MEI": 5, "MAY": 5,
        "JUN": 6, "JUNI": 6,
        "JUL": 7, "JULI": 7,
        "AGU": 8, "AGUSTUS": 8,
        "SEP": 9, "SEPTEMBER": 9,
        "OKT": 10, "OKTOBER": 10,
        "NOV": 11, "NOVEMBER": 11,
        "DES": 12, "DESEMBER": 12,
    }

    import re

    df[month_col] = df[month_col].astype(str).str.strip().str.upper()

    def parse_bulan(val):
        val = str(val).strip().upper()

        # numeric month support
        match = re.search(r"\d+", val)
        if match:
            num = int(match.group(0))
            if 1 <= num <= 12:
                return num

        # fuzzy text match (e.g. NOVEMBER → NOV)
        for key, num in bulan_map.items():
            if key in val:
                return num

        return None

    df["Bulan_num"] = df[month_col].apply(parse_bulan)

    valid = df["Bulan_num"].dropna()
    if valid.empty:
        invalid = df[df["Bulan_num"].isna()][month_col].unique().tolist()
        return {"error": f"Tidak ada bulan yang valid ditemukan. Invalid values: {invalid}"}

    latest_month = int(valid.max())
    next_month = (latest_month % 12) + 1

    bulan_reverse = {
        1: "Januari", 2: "Februari", 3: "Maret", 4: "April", 5: "Mei", 6: "Juni",
        7: "Juli", 8: "Agustus", 9: "September", 10: "Oktober", 11: "November", 12: "Desember"
    }

    return {"predicted_month": bulan_reverse[next_month]}

@router.get("/")
def predictions():
    df = pd.DataFrame(list(db.penjualan.find({}, {"_id": 0, "Kode_Item":1, "Bulan": 1, "Jumlah":1, "Nama_Item":1})))

    pred = predict_next_month_sales(df.copy())  # <--- add .copy()
    pred = pred.map(lambda x: x.item() if isinstance(x, (np.generic,)) else x)
    month = get_predicted_month(df)  # this df still has original "November", etc.

    return {
        "data": pred.to_dict(orient="records"),
        "nextMonth": month
    }
