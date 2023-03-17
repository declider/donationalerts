from fastapi import FastAPI, Request, Response
import requests, json, os
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from starlette.middleware.cors import CORSMiddleware


limiter = Limiter(key_func=get_remote_address)
app = FastAPI(penapi_url=None, docs_url=None, redoc_url=None)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


origins = [
    "https://declider.github.io",
    "https://declider.github.io/",
    "https://declider.github.io/donationalerts",
    "https://declider.github.io/donationalerts/",
    "declider.github.io",
    "declider.github.io/",
    "declider.github.io/donationalerts",
    "declider.github.io/donationalerts/",
]



@app.get("/auth")
@limiter.limit("1/second")
async def donategoal(request: Request, access_token: str):
    headers = {'Authorization': 'Bearer '+access_token}

    response = requests.get(
        "https://www.donationalerts.com/api/v1/user/oauth",
        headers=headers
        )

    data = json.loads(response.text)['data']
    socket_connection_token = data['socket_connection_token']
    id = data['id']

    return {"socket_connection_token": socket_connection_token, "id": id}


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["get"],
    allow_headers=["*"],
)
