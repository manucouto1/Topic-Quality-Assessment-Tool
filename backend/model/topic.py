from typing import Annotated, Any, List, Tuple, Optional
from pydantic import BaseModel, Field
from container import Container
from model.base_dao import BaseDao
from model.bsom_object import PyObjectId
from bson.objectid import ObjectId

class TopicModel(BaseModel):
    model_name: str
    database_name: str
    k: int
    topic_number: Annotated[int, Field(gt=-2)]
    # llm_header: Tuple[str, Optional[int]]
    top_words:  Tuple[List[Optional[str]], Optional[int]]
    top_words_desc: Optional[str] = None
    ordered_docs: Tuple[List[str], Optional[int]]
    top_docs_desc: Optional[str] = None
    overall_coh: Optional[int] = None
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        json_schema_extra = {
            "example": {
                "model_name": "Bertopic",
                "database_name": "rsdd",
                "k": 50,
                "llm_header": "Diferentes frutas y sus beneficios",
                "top_words": ["manzana", "pera", "melón", "naranja", "limón"],
                "ordered_docs": ["Me encanta comer manzanas y todo tipo de frutas", "Una alimentación variada incluye 3 piezas de frutas distintas al día", "Ayer me comí una naranja deliciosa"]
            }
        }
        
class UserEvaluationModel(BaseModel):
    id: PyObjectId = Field(alias="_id", default=None)
    user: Optional[PyObjectId] = None
    last_index: Optional[int] = 0
    description: str 
    evaluation: List[TopicModel]
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
    
    

@Container.register_dao('user_evaluation')
class UserEvaluationDao(BaseDao):
    database = None
    
    @classmethod
    def find_by_user(cls, user_id:str):
        if cls.database !=None:
            return cls.database.find({"user": user_id})
        else:
            raise Exception("Dao not properly initialized!")
    