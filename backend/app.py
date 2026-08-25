from fastapi import FastAPI
from routes.goals import router as goals_router
from routes.auth import router as auth_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="StudyBuddy API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all goal-related routes
app.include_router(goals_router, prefix="/api", tags=["Goals"])

app.include_router(
    auth_router,
    prefix="/api/auth",
    tags=["Authentication"]
)


@app.get("/")
def home():
    return {
        "message": "Welcome to StudyBuddy API!"
    }