from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client = MongoClient(MONGO_URI)

db = client["db_kopeg"]

# koleksi
pembelian_collection = db["pembelian"]
penjualan_collection = db["penjualan"]
pengembalian_collection = db["pengembalian"]
