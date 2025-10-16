from fastapi import APIRouter, HTTPException
from app.database import db
import pandas as pd

router = APIRouter(prefix="/statistik", tags=["Pembelian"])

@router.get("/")
def get_statistik_pembelian():
    try:
        # 🧩 Fetch pembelian data
        penjualan_data = list(db.penjualan.find({}, {"_id": 0}))
        if not penjualan_data:
            raise HTTPException(status_code=404, detail="Tidak ada data pembelian di database")

        df_penjualan = pd.DataFrame(penjualan_data)
        df_penjualan["Jumlah"] = pd.to_numeric(df_penjualan["Jumlah"], errors="coerce")
        df_penjualan["Total_Harga"] = pd.to_numeric(df_penjualan["Total_Harga"], errors="coerce")

        # 🔹 Top 5 items by total price
        top_items = df_penjualan.nlargest(5, "Total_Harga")[
            ["Kode_Item", "Nama_Item", "Jenis", "Jumlah", "Satuan", "Total_Harga", "Bulan", "Tahun"]
        ]

        # 🔹 Monthly total purchase (Total Harga per Bulan)
        total_per_bulan = df_penjualan.groupby("Bulan")["Total_Harga"].sum().reset_index()

        # 🧩 Fetch penjualan data (for comparison chart)
        pembelian_data = list(db.pembelian.find({}, {"_id": 0, "Nama_Item": 1, "Jumlah": 1}))
        df_pembelian = pd.DataFrame(pembelian_data)
        if df_pembelian.empty:
            df_pembelian = pd.DataFrame(columns=["Nama_Item", "Jumlah"])

        # 🧩 Prepare aggregated totals for both penjualan and pembelian
        pembelian_sum = (
            df_pembelian.groupby("Nama_Item", as_index=False)["Jumlah"]
            .sum()
            .sort_values(by="Jumlah", ascending=False)
        )
        penjualan_sum = (
            df_penjualan.groupby("Nama_Item", as_index=False)["Jumlah"]
            .sum()
            .sort_values(by="Jumlah", ascending=False)
        )

        # ✅ Return all results in one object
        return {
            "top_items": top_items.to_dict(orient="records"),
            "total_per_bulan": total_per_bulan.to_dict(orient="records"),
            "penjualan": penjualan_sum.to_dict(orient="records"),
            "pembelian": pembelian_sum.to_dict(orient="records"),
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal menghasilkan statistik: {e}")

