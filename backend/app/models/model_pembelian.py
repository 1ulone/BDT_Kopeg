from pydantic import BaseModel
from typing import Optional

class Pembelian(BaseModel):
    Kode_Item: int
    Nama_Item: str
    Jenis: str
    Jumlah: int
    Satuan: str
    Total_Harga: float
    Bulan: str
    Tahun: int