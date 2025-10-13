from pydantic import BaseModel
from typing import Optional

class Pengembalian(BaseModel):
    No: int
    Kode_Item: int
    Nama_Item: str
    Jml: int
    Satuan: str
    Harga: float
    Potongan: float
    Total_Harga: float
    Bulan: str
    Tahun: int
