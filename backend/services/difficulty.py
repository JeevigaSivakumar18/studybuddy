# backend/services/difficulty.py
import re

def assess_difficulty(topics: list[str], syllabus_text: str = "") -> list[dict]:
    """
    Assess difficulty for each topic using keyword matching.
    Optionally uses the full syllabus text for extra context.
    """

    easy_keywords = [
        "introduction", "overview", "basics", "fundamentals",
        "history", "types of", "applications", "case study",
        "evolution", "what is", "definition"
    ]

    medium_keywords = [
        "architecture", "algorithm", "model", "training",
        "classification", "regression", "clustering", "feature",
        "perceptron", "feedforward", "activation", "loss function"
    ]

    hard_keywords = [
        "neural network", "deep learning", "convolutional", "recurrent",
        "autoencoder", "lstm", "gru", "transformer", "attention",
        "generative", "adversarial", "gan", "reinforcement", "backpropagation",
        "optimization", "gradient descent", "hyperparameter", "regularization",
        "dropout", "batch normalization", "fine-tuning", "transfer learning",
        "vanishing gradient", "exploding gradient", "bert", "gpt"
    ]

    results = []
    text_lower = syllabus_text.lower()

    for topic in topics:
        topic_lower = topic.lower()
        difficulty = "Medium"  # default

        # 1. Check topic title keywords
        if any(kw in topic_lower for kw in hard_keywords):
            difficulty = "Hard"
        elif any(kw in topic_lower for kw in easy_keywords):
            difficulty = "Easy"
        elif any(kw in topic_lower for kw in medium_keywords):
            difficulty = "Medium"

        # 2. Optional: use syllabus text context
        # If a topic is mentioned many times in the syllabus, bump difficulty slightly
        if syllabus_text:
            topic_words = [w for w in re.findall(r'\b\w+\b', topic_lower) if len(w) > 3]
            if topic_words:
                mention_count = sum(text_lower.count(word) for word in topic_words)
                if mention_count > 15 and difficulty == "Easy":
                    difficulty = "Medium"
                elif mention_count > 25 and difficulty == "Medium":
                    difficulty = "Hard"

        results.append({
            "topic": topic,
            "difficulty": difficulty
        })

    return results