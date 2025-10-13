from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

client = MongoClient('mongodb://admin:password@localhost:27017/')

db = client["db_kopeg"]
pembelian_collection = db["pembelian"]
penjualan_collection = db["penjualan"]
pengembalian_collection = db["pengembalian"]
