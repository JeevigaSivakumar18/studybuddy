import re


def extract_topics(text: str) -> list[str]:

    topics = []

    lines = text.split("\n")

    for line in lines:

        line = line.strip()

        if not line:
            continue

        # Match:
        # Unit - I Neural Network
        # Unit - II Learning in Neural Network
        # Unit - III Convolutional Neural Networks
        match = re.match(
            r"^Unit\s*-\s*[IVX]+\s+(.+?)(?:\s+\d+\s*)?$",
            line,
            re.IGNORECASE
        )

        if match:
            topic = match.group(1).strip()

            topics.append(topic)

    return topics