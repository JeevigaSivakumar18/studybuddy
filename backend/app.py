from fastapi import FastAPI
from routes.goals import router as goals_router

app = FastAPI(
    title="StudyBuddy API",
    version="1.0.0"
)

# Register all goal-related routes
app.include_router(goals_router, prefix="/api", tags=["Goals"])


@app.get("/")
def home():
    return {
        "message": "Welcome to StudyBuddy API!"
    }