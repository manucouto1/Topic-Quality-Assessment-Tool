
from typing import Any, List
from fastapi.encoders import jsonable_encoder
from bson.objectid import ObjectId

class BaseDao:
    database:Any = None
    
    @classmethod
    def __call__(cls, database):
        if cls.database != None:
            return 
        else:
            cls.database = database
            
    @classmethod
    def update(cls, _id, params):
        if cls.database != None:
            return cls.database.update_one(
                { "_id": ObjectId(_id) },
                { "$set": params}
            )
        else:
            raise Exception("Dao Not propertly initialized")
            
            
    @classmethod
    def drop(cls):
        if cls.database != None:
            cls.database.drop()
        else:
            raise Exception("Dao Not propertly initialized")
            
    @classmethod
    def create(cls, entity:Any) -> Any:
        if cls.database != None:
            entity = entity.dict()
            if "id" in entity:
                del entity["id"]
            new_entity = cls.database.insert_one(entity)
            return new_entity
        else:
            raise Exception("Dao Not propertly initialized")
    
    @classmethod
    def delete(cls, id:str) -> Any:
        if cls.database != None:
            return cls.database.delete_one({"_id": ObjectId(id)})
        else:
            raise Exception("Dao Not propertly initialized")
        
    @classmethod
    def delete_many(cls, ids:List[str]) -> Any:
        if cls.database != None:
            return cls.database.delete_many({"_id":{"$in": list(map(lambda x: ObjectId(x), ids))}})
        else:
            raise Exception("Dao Not propertly initialized")
        
    @classmethod
    def findAll(cls) -> Any:
        if cls.database != None:
            return cls.database.find()
        else:
            raise Exception("Dao Not propertly initialized")
        
    @classmethod
    def findById(cls, id:str) -> Any:
        if cls.database != None:
            return cls.database.find_one({"_id": ObjectId(id)})
        else:
            raise Exception("Dao Not propertly initialized")