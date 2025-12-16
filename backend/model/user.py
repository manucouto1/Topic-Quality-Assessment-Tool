from pydantic import BaseModel, Field
from container import Container
from model.base_dao import BaseDao
from model.bsom_object import PyObjectId
from bson.objectid import ObjectId

class UserModel(BaseModel):
    id: PyObjectId = Field(alias="_id", default=None)
    username:str
    email: str 
    password: str
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        json_schema_extra = {
            "example": {
               "username": "example",
               "eamil": "example@gmail.com",
               "password": "password",
               "files": [{"title": "title", "category":"category", "ref":"ref"}]
            }
        }
        
@Container.register_dao('user_model')
class UserDao(BaseDao):
    database = None
    
    @classmethod
    def find_by_username(cls, user_name):
        if cls.database !=None:
            return cls.database.find_one({"username": user_name})
        else:
            raise Exception("Dao not properly initialized!")
        
    @classmethod
    def find_by_email(cls, email):
        if cls.database != None:
            return cls.database.find_one({"email": email})
        else:
            raise Exception("Dao not properly inititialized")
        