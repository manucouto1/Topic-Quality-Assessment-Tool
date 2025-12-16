from fastapi import FastAPI
from container import Container

class MainApp:
    container = Container()
    app = FastAPI()