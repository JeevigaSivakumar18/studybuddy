def assess_difficulty(topics: list[str]) -> list[dict]:

    results = []

    hard_keywords = [
        "neural network",
        "convolutional",
        "recurrent",
        "autoencoder",
        "lstm"
    ]

    for topic in topics:

        topic_lower = topic.lower()

        if any(keyword in topic_lower for keyword in hard_keywords):
            difficulty = "Hard"
        else:
            difficulty = "Medium"

        results.append({
            "topic": topic,
            "difficulty": difficulty
        })

    return results