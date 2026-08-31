import re

def extract_topics(text: str) -> list[str]:
    """
    Extract unit topics from syllabus text.
    Handles PDF line-break variations and different dash types.
    """
    topics = []
    seen = set()

    # Normalize all dash types to regular hyphen
    text = text.replace("–", "-").replace("—", "-")

    # Split into lines and clean
    lines = [line.strip() for line in text.splitlines()]

    i = 0
    while i < len(lines):
        line = lines[i]

        # Pattern 1: Unit header on its own line
        # "Unit - I" or "Unit-I" or "UNIT I"
        if re.match(r"^(Unit|UNIT)\s*[-]?\s*[IVX]+\s*$", line, re.IGNORECASE):
            # Look at next lines for the topic
            for j in range(i + 1, min(i + 4, len(lines))):
                candidate = lines[j].strip()

                # Skip empty lines
                if not candidate:
                    continue

                # Skip pure numbers like "9" (credit hours)
                if candidate.isdigit():
                    continue

                # Skip lines that start with lowercase (descriptions)
                if candidate[0].islower():
                    continue

                # Skip very long lines (paragraphs, not titles)
                if len(candidate) > 80:
                    continue

                # Skip known non-topics
                skip_words = [
                    "Introduction", "Overview", "Kongu", "B.E.", "Programme",
                    "Sem.", "CO", "Course", "TEXT", "REFERENCES", "Total",
                    "COURSEOUTCOMES", "Test", "CAT", "ESE", "Preamble",
                    "Page", "Footer", "Header", "B.E.–Computer",
                ]
                if any(candidate.startswith(sw) for sw in skip_words):
                    continue

                # Clean trailing numbers and punctuation
                topic = re.sub(r"\s+\d+$", "", candidate)
                topic = re.sub(r"[\.:;]+$", "", topic)

                if topic and len(topic) > 2 and topic not in seen:
                    topics.append(topic)
                    seen.add(topic)
                break

            i += 1
            continue

        # Pattern 2: Unit and topic on SAME line
        # "Unit - I Lexical Analysis" or "Unit-I Lexical Analysis"
        same_line = re.match(
            r"^(Unit|UNIT)\s*[-]?\s*[IVX]+\s+(.+)$",
            line,
            re.IGNORECASE,
        )
        if same_line:
            topic = same_line.group(2).strip()
            topic = re.sub(r"\s+\d+$", "", topic)
            topic = re.sub(r"[\.:;]+$", "", topic)

            # Skip if it looks like a description
            if len(topic) > 80:
                i += 1
                continue

            if topic and len(topic) > 2 and topic not in seen:
                topics.append(topic)
                seen.add(topic)
            i += 1
            continue

        i += 1

    return topics