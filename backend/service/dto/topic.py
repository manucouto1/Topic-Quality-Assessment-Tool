from pydantic import BaseModel
from model.topic import TopicModel
from container import Container
from model.base_dao import BaseDao

class TopicDto(BaseModel):
    id: str
    topicNum: int
    lastIndex: int
    evaluation: TopicModel
