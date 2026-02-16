"""
FAISS Vector Store Service
Manages vector embeddings and similarity search
"""
import faiss
import numpy as np
import pickle
from pathlib import Path
from typing import List, Tuple, Optional
from ..config import settings


class FAISSStore:
    """Service for managing FAISS vector index"""
    
    def __init__(self):
        self.index_path = Path(settings.FAISS_INDEX_PATH)
        self.index_path.mkdir(parents=True, exist_ok=True)
        
        self.dimension = settings.VECTOR_DIMENSION
        self.index: Optional[faiss.Index] = None
        self.id_map: List[int] = []  # Maps FAISS index to database IDs
        
        self.index_file = self.index_path / "index.faiss"
        self.map_file = self.index_path / "id_map.pkl"
    
    def initialize_index(self):
        """Create a new FAISS index"""
        # Using IndexFlatL2 for exact search (good for small-medium datasets)
        # For larger datasets, consider IndexIVFFlat or IndexHNSWFlat
        self.index = faiss.IndexFlatL2(self.dimension)
        self.id_map = []
        print(f"Initialized new FAISS index with dimension {self.dimension}")
    
    def load_index(self) -> bool:
        """
        Load existing index from disk
        
        Returns:
            True if loaded successfully, False otherwise
        """
        try:
            if self.index_file.exists() and self.map_file.exists():
                self.index = faiss.read_index(str(self.index_file))
                with open(self.map_file, 'rb') as f:
                    self.id_map = pickle.load(f)
                print(f"Loaded FAISS index with {self.index.ntotal} vectors")
                return True
        except Exception as e:
            print(f"Failed to load index: {e}")
        
        return False
    
    def save_index(self):
        """Save index to disk"""
        try:
            faiss.write_index(self.index, str(self.index_file))
            with open(self.map_file, 'wb') as f:
                pickle.dump(self.id_map, f)
            print(f"Saved FAISS index with {self.index.ntotal} vectors")
        except Exception as e:
            print(f"Failed to save index: {e}")
    
    def add_vectors(self, vectors: np.ndarray, db_ids: List[int]) -> List[int]:
        """
        Add vectors to the index
        
        Args:
            vectors: Numpy array of shape (n, dimension)
            db_ids: Database IDs corresponding to each vector
            
        Returns:
            List of FAISS indices for the added vectors
        """
        if self.index is None:
            if not self.load_index():
                self.initialize_index()
        
        # Ensure vectors are float32
        vectors = vectors.astype('float32')
        
        # Normalize vectors for cosine similarity (optional)
        faiss.normalize_L2(vectors)
        
        # Get starting index
        start_idx = self.index.ntotal
        
        # Add to index
        self.index.add(vectors)
        
        # Update ID mapping
        self.id_map.extend(db_ids)
        
        # Save periodically
        if self.index.ntotal % 100 == 0:
            self.save_index()
        
        # Return FAISS indices
        return list(range(start_idx, start_idx + len(vectors)))
    
    def search(
        self,
        query_vector: np.ndarray,
        k: int = 5,
        threshold: Optional[float] = None
    ) -> List[Tuple[int, float]]:
        """
        Search for similar vectors
        
        Args:
            query_vector: Query vector (1D array)
            k: Number of results to return
            threshold: Optional distance threshold
            
        Returns:
            List of (db_id, distance) tuples
        """
        if self.index is None or self.index.ntotal == 0:
            return []
        
        # Reshape and normalize
        query_vector = query_vector.reshape(1, -1).astype('float32')
        faiss.normalize_L2(query_vector)
        
        # Search
        distances, indices = self.index.search(query_vector, min(k, self.index.ntotal))
        
        # Convert to results
        results = []
        for dist, idx in zip(distances[0], indices[0]):
            if idx < len(self.id_map):
                db_id = self.id_map[idx]
                
                # Apply threshold if specified
                if threshold is None or dist <= threshold:
                    results.append((db_id, float(dist)))
        
        return results
    
    def delete_vectors(self, db_ids: List[int]):
        """
        Remove vectors by database ID
        Note: FAISS doesn't support efficient deletion, so we rebuild the index
        """
        if self.index is None:
            return
        
        # Get all vectors except those to delete
        keep_indices = [i for i, db_id in enumerate(self.id_map) if db_id not in db_ids]
        
        if not keep_indices:
            self.initialize_index()
            return
        
        # Rebuild index with remaining vectors
        old_index = self.index
        self.initialize_index()
        
        # Re-add vectors
        for idx in keep_indices:
            vector = old_index.reconstruct(idx)
            self.index.add(vector.reshape(1, -1))
            self.id_map.append(self.id_map[idx])
        
        self.save_index()
    
    def get_stats(self) -> dict:
        """Get index statistics"""
        return {
            "total_vectors": self.index.ntotal if self.index else 0,
            "dimension": self.dimension,
            "index_type": type(self.index).__name__ if self.index else None
        }


# Global instance
faiss_store = FAISSStore()
