from datetime import date

def reschedule_roadmap(roadmap_items, exam_date: date):
    """
    Recalculate day offsets for all non-completed topics based on:
    - Days remaining until exam
    - Priority scores (harder topics get more days)

    Completed topics keep their original offsets.
    """

    today = date.today()
    days_remaining = (exam_date - today).days

    # Separate completed vs remaining topics
    completed = [item for item in roadmap_items if item.status == "completed"]
    remaining = [item for item in roadmap_items if item.status != "completed"]

    if not remaining:
        return roadmap_items  # Everything is done!

    # Safety: if exam is today or past, give each remaining topic 1 day
    if days_remaining <= 0:
        days_remaining = len(remaining)

    # Calculate total priority score of remaining topics
    total_priority = sum(item.priority_score for item in remaining)

    # Sort by priority descending (hardest topics first)
    remaining.sort(key=lambda x: x.priority_score, reverse=True)

    current_day = 0

    for item in remaining:
        # Distribute days proportionally by priority
        # Example: if a topic has priority 3 out of total 8, it gets 3/8 of remaining days
        if total_priority > 0:
            share = item.priority_score / total_priority
            allocated_days = max(1, round(share * days_remaining))
        else:
            allocated_days = 1

        # Don't let the schedule run past the exam date
        if current_day + allocated_days > days_remaining:
            allocated_days = max(1, days_remaining - current_day)

        item.start_day_offset = current_day
        item.end_day_offset = current_day + allocated_days - 1
        current_day += allocated_days

    # Combine completed (unchanged) + rescheduled remaining
    return completed + remaining