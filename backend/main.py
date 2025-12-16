from app import MainApp
from service.router import users, topics

MainApp.app.include_router(users.router)
MainApp.app.include_router(topics.router)

app = MainApp.app