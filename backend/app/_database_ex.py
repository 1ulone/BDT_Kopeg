from pymongo import MongoClient
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

load_dotenv()

async_client = AsyncIOMotorClient('mongodb://admin:password@localhost:27017/')
client = MongoClient('mongodb://admin:password@localhost:27017/')

db = client["db_kopeg"]
db_async = async_client["db_kopeg"]
pembelian_collection = db["pembelian"]
penjualan_collection = db["penjualan"]
pengembalian_collection = db["pengembalian"]
