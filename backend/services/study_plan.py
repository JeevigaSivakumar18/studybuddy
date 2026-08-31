# backend/services/study_plan.py
from datetime import date, timedelta

def calculate_priorities(topics_with_difficulty: list[dict]) -> list[dict]:
    """
    Assign priority scores and recommended study days based on difficulty.
    """
    difficulty_scores = {"Easy": 1, "Medium": 2, "Hard": 3}

    results = []
    for item in topics_with_difficulty:
        score = difficulty_scores.get(item["difficulty"], 2)
        recommended_days = score * 2  # Easy=2 days, Medium=4 days, Hard=6 days

        results.append({
            "topic": item["topic"],
            "difficulty": item["difficulty"],
            "priority_score": score,
            "recommended_days": recommended_days
        })

    return results


def generate_roadmap(topics_with_priority, exam_date, daily_hours) -> list[dict]:
    """
    Generate a day-by-day study roadmap.
    Harder topics come first. ALL topics are included.
    """
    today = date.today()
    days_until_exam = (exam_date - today).days if exam_date else 30

    if days_until_exam <= 0:
        days_until_exam = 7

    # Sort by priority descending (hardest topics first)
    sorted_topics = sorted(
        topics_with_priority,
        key=lambda x: x["priority_score"],
        reverse=True
    )

    roadmap = []
    current_day = 0

    for topic in sorted_topics:
        days_needed = topic["recommended_days"]

        # If running out of days before exam, still give at least 1 day
        if current_day + days_needed > days_until_exam:
            days_needed = max(1, days_until_exam - current_day)
            if days_needed <= 0:
                days_needed = 1  # force 1 day even if past exam date

        start_offset = current_day
        end_offset = current_day + days_needed - 1

        roadmap.append({
            "topic": topic["topic"],
            "difficulty": topic["difficulty"],
            "priority_score": topic["priority_score"],
            "start_day_offset": start_offset,
            "end_day_offset": end_offset,
            "daily_hours": daily_hours,
            "status": "pending"
        })

        current_day += days_needed

    return roadmap