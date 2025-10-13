from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client = MongoClient(MONGO_URI)

db = client["db_kopeg"]
<<<<<<< HEAD
=======

# koleksi
>>>>>>> 05e6dc6d01178dc51659a3a605825321225dbc9b
pembelian_collection = db["pembelian"]
penjualan_collection = db["penjualan"]
pengembalian_collection = db["pengembalian"]
