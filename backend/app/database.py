from pymongo import MongoClient
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

load_dotenv()

async_client = AsyncIOMotorClient('mongodb+srv://ulwan223443087:kelompok23aec4@main.pzwwnrk.mongodb.net/')
client = MongoClient('mongodb+srv://ulwan223443087:kelompok23aec4@main.pzwwnrk.mongodb.net/')

db = client["db_kopeg"]
db_async = async_client["db_kopeg"]
pembelian_collection = db["pembelian"]
penjualan_collection = db["penjualan"]
pengembalian_collection = db["pengembalian"]
