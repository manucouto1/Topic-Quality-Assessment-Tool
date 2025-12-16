from typing import List, Optional, Dict
from fastapi import APIRouter

from service.dto.topic import TopicDto
from model.topic import UserEvaluationModel, UserEvaluationDao, TopicModel

router = APIRouter(
    prefix="/topics",
    tags=["topics"],
    responses={404: {"description": "Not found"}},
)


@router.get('/one/{user_id}', response_model=Optional[List[UserEvaluationModel]])
def get_evals(user_id:str):
    sessions = list(UserEvaluationDao.find_by_user(user_id))
    if sessions is None:
        return None
    
    return sessions


@router.get('/all', response_model=Optional[List[UserEvaluationModel]])
def get_all_evals():
    doc = UserEvaluationDao.findAll()
    if doc is None:
        return None
    return list(doc)

@router.post('/update')
def update_topics(evaluation: TopicDto):

    print(evaluation)

    response = UserEvaluationDao.update(
        evaluation.id, {
            f'evaluation.{evaluation.topicNum}': dict(evaluation.evaluation),
            'last_index': evaluation.lastIndex
        }
    )

    if response.modified_count > 0:
        return {"ok": True}
    
    else:
        return {"ok": False}