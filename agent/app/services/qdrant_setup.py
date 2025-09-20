"""
Qdrant setup and configuration service for Mem0
"""
from qdrant_client import QdrantClient
from qdrant_client.http import models
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class QdrantSetupService:
    def __init__(self):
        self.client = QdrantClient(
            url=settings.QDRANT_URL,
            api_key=settings.QDRANT_API_KEY
        )
        self.collection_name = settings.QDRANT_COLLECTION_NAME
        self.vector_size = settings.QDRANT_VECTOR_SIZE
    
    def setup_collection(self):
        """Setup Qdrant collection for Mem0"""
        try:
            # Check if collection exists
            collections = self.client.get_collections()
            collection_exists = any(
                col.name == self.collection_name 
                for col in collections.collections
            )
            
            if not collection_exists:
                logger.info(f"Creating Qdrant collection: {self.collection_name}")
                
                # Create collection
                self.client.create_collection(
                    collection_name=self.collection_name,
                    vectors_config=models.VectorParams(
                        size=self.vector_size,
                        distance=models.Distance.COSINE
                    )
                )
                
                logger.info(f"✅ Collection {self.collection_name} created successfully")
            else:
                logger.info(f"✅ Collection {self.collection_name} already exists")
            
            # Create payload index for user_id (required for Mem0)
            try:
                self.client.create_payload_index(
                    collection_name=self.collection_name,
                    field_name="user_id",
                    field_schema=models.PayloadSchemaType.KEYWORD
                )
                logger.info("✅ Payload index for user_id created")
            except Exception as e:
                if "already exists" in str(e).lower():
                    logger.info("✅ Payload index for user_id already exists")
                else:
                    logger.warning(f"⚠️ Could not create payload index: {e}")
            
            # Create other useful indexes
            indexes_to_create = [
                ("session_id", models.PayloadSchemaType.KEYWORD),
                ("topic_number", models.PayloadSchemaType.KEYWORD),
                ("timestamp", models.PayloadSchemaType.DATETIME),
                ("category", models.PayloadSchemaType.KEYWORD)
            ]
            
            for field_name, field_type in indexes_to_create:
                try:
                    self.client.create_payload_index(
                        collection_name=self.collection_name,
                        field_name=field_name,
                        field_schema=field_type
                    )
                    logger.info(f"✅ Payload index for {field_name} created")
                except Exception as e:
                    if "already exists" in str(e).lower():
                        logger.info(f"✅ Payload index for {field_name} already exists")
                    else:
                        logger.warning(f"⚠️ Could not create index for {field_name}: {e}")
            
            return True
            
        except Exception as e:
            logger.error(f"❌ Failed to setup Qdrant collection: {e}")
            return False
    
    def health_check(self):
        """Check Qdrant health"""
        try:
            collections = self.client.get_collections()
            logger.info(f"✅ Qdrant is healthy. Found {len(collections.collections)} collections")
            return True
        except Exception as e:
            logger.error(f"❌ Qdrant health check failed: {e}")
            return False
    
    def get_collection_info(self):
        """Get information about the collection"""
        try:
            info = self.client.get_collection(self.collection_name)
            return {
                "collection_name": self.collection_name,
                "vectors_count": info.vectors_count,
                "indexed_vectors_count": info.indexed_vectors_count,
                "points_count": info.points_count,
                "status": info.status
            }
        except Exception as e:
            logger.error(f"❌ Could not get collection info: {e}")
            return None

# Global setup service
qdrant_setup = QdrantSetupService()