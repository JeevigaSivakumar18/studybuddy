from datetime import date

def reschedule_roadmap(roadmap_items, exam_date: date):
    """
    Recalculate day offsets for all non-completed topics based on:
    - Days remaining until exam
    - Priority scores (harder topics get more days)

    Completed topics keep their original offsets.
    """
    today = date.today()
    days_remaining = (exam_date - today).days if exam_date else 30

    completed = [item for item in roadmap_items if item.status == "completed"]
    remaining = [item for item in roadmap_items if item.status != "completed"]

    if not remaining:
        return roadmap_items

    if days_remaining <= 0:
        days_remaining = len(remaining)

    total_priority = sum(item.priority_score for item in remaining)
    remaining.sort(key=lambda x: x.priority_score, reverse=True)

    current_day = 0

    for item in remaining:
        if total_priority > 0:
            share = item.priority_score / total_priority
            allocated_days = max(1, round(share * days_remaining))
        else:
            allocated_days = 1

        if current_day + allocated_days > days_remaining:
            allocated_days = max(1, days_remaining - current_day)

        item.start_day_offset = current_day
        item.end_day_offset = current_day + allocated_days - 1
        current_day += allocated_days

        if current_day >= days_remaining:
            break

    return roadmap_items