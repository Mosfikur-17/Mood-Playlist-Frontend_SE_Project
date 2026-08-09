import logging
from typing import Optional
from pymongo import MongoClient, ASCENDING, DESCENDING
from pymongo.database import Database
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
from app.core.config import settings

logger = logging.getLogger("mood_playlist.database")

class MongoDBManager:
    client: Optional[MongoClient] = None
    db: Optional[Database] = None
    is_connected: bool = False

    def connect(self) -> bool:
        """Connects to MongoDB server and initializes database & collections."""
        try:
            logger.info(f"Connecting to MongoDB at {settings.MONGODB_URI}...")
            self.client = MongoClient(
                settings.MONGODB_URI,
                serverSelectionTimeoutMS=3000,
                connectTimeoutMS=3000
            )
            # Trigger server info check to test connection
            self.client.admin.command('ping')
            self.db = self.client[settings.DATABASE_NAME]
            self.is_connected = True
            logger.info(f"Successfully connected to MongoDB database '{settings.DATABASE_NAME}'.")
            
            # Setup indexes
            self.setup_indexes()
            return True
        except (ConnectionFailure, ServerSelectionTimeoutError, Exception) as e:
            logger.warning(f"Could not connect to MongoDB: {e}. Running with graceful memory fallback support.")
            self.is_connected = False
            return False

    def setup_indexes(self):
        """Creates indexes for users, mood_sessions, playlists, and recommendations collections."""
        if not self.is_connected or self.db is None:
            return
        try:
            # Users indexes
            self.db.users.create_index("email", unique=True, sparse=True)
            self.db.users.create_index("created_at", direction=DESCENDING)

            # Mood Sessions indexes
            self.db.mood_sessions.create_index("user_id", direction=ASCENDING)
            self.db.mood_sessions.create_index("created_at", direction=DESCENDING)

            # Playlists indexes
            self.db.playlists.create_index("user_id", direction=ASCENDING)
            self.db.playlists.create_index("mood", direction=ASCENDING)
            self.db.playlists.create_index("created_at", direction=DESCENDING)

            # Recommendations indexes
            self.db.recommendations.create_index("user_id", direction=ASCENDING)
            self.db.recommendations.create_index("mood", direction=ASCENDING)
            self.db.recommendations.create_index("created_at", direction=DESCENDING)

            logger.info("MongoDB indexes verified successfully.")
        except Exception as e:
            logger.warning(f"Error creating indexes: {e}")

    def close(self):
        """Closes the MongoDB client connection."""
        if self.client:
            self.client.close()
            self.is_connected = False
            logger.info("MongoDB client connection closed.")

db_manager = MongoDBManager()

def get_database() -> Optional[Database]:
    """Dependency helper to get active database instance."""
    if not db_manager.is_connected:
        db_manager.connect()
    return db_manager.db
