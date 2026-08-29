import re

def extract_topics(text: str) -> list[str]:
    """
    Extract topics from syllabus text.
    Handles multiple formats:
      - Unit - I Topic Name (same line)
      - Unit – I\nTopic Name (next line)
      - Chapter 1: Topic Name
      - Module 1 - Topic Name
      - 1. Topic Name
    """
    topics = []
    lines = [line.strip() for line in text.split("\n") if line.strip()]
    seen = set()

    i = 0
    while i < len(lines):
        line = lines[i]

        # ---- Pattern A: Single line unit ----
        # "Unit - I Lexical Analysis" or "Unit–I Lexical Analysis"
        single_match = re.match(
            r"^(?:Unit|UNIT)\s*[-–]?\s*[IVX\d]+\s+(.+?)(?:\s+\d+\s*)?$",
            line,
            re.IGNORECASE
        )
        if single_match:
            topic = _clean_topic(single_match.group(1))
            if topic and topic not in seen:
                topics.append(topic)
                seen.add(topic)
            i += 1
            continue

        # ---- Pattern B: Multi-line unit ----
        # "Unit – I" on one line, "Lexical Analysis" on the next
        multi_header = re.match(
            r"^(?:Unit|UNIT)\s*[-–]?\s*[IVX\d]+\s*$",
            line,
            re.IGNORECASE
        )
        if multi_header and i + 1 < len(lines):
            next_line = lines[i + 1]

            # Skip if next line is just a number (hours/credits like "9")
            if re.match(r"^\d+$", next_line):
                i += 1
                continue

            # Skip if next line looks like another header or section
            skip_patterns = [
                r"^(Unit|Chapter|Module|CO\d|Course|TEXT|REFERENCES|Total|Programme|Sem\.|Preamble|B\.E\.|COURSEOUTCOMES|Test/Bloom)",
                r"^(Introduction|Overview|Conclusion|Summary)$",
            ]
            if any(re.match(p, next_line, re.IGNORECASE) for p in skip_patterns):
                i += 1
                continue

            topic = _clean_topic(next_line)
            if topic and len(topic) > 2 and topic not in seen:
                topics.append(topic)
                seen.add(topic)
            i += 2
            continue

        # ---- Pattern C: Chapter ----
        chapter_match = re.match(
            r"^(?:Chapter|CHAPTER|Ch)\s*[-–]?\s*\d+\s*[-–:.]?\s*(.+)$",
            line,
            re.IGNORECASE
        )
        if chapter_match:
            topic = _clean_topic(chapter_match.group(1))
            if topic and topic not in seen:
                topics.append(topic)
                seen.add(topic)
            i += 1
            continue

        # ---- Pattern D: Module ----
        module_match = re.match(
            r"^(?:Module|MODULE|Mod)\s*[-–]?\s*\d+\s*[-–:.]?\s*(.+)$",
            line,
            re.IGNORECASE
        )
        if module_match:
            topic = _clean_topic(module_match.group(1))
            if topic and topic not in seen:
                topics.append(topic)
                seen.add(topic)
            i += 1
            continue

        # ---- Pattern E: Numbered heading (1. Introduction) ----
        numbered_match = re.match(r"^\d+(?:\.\d+)?\s+([A-Z][A-Za-z\s\-]+)$", line)
        if numbered_match:
            topic = _clean_topic(numbered_match.group(1))
            if topic and topic not in seen:
                topics.append(topic)
                seen.add(topic)
            i += 1
            continue

        i += 1

    return topics


def _clean_topic(raw: str) -> str:
    """Clean up extracted topic text."""
    topic = raw.strip()
    # Remove trailing numbers (like "Lexical Analysis 9")
    topic = re.sub(r"\s+\d+\s*$", "", topic)
    # Remove trailing punctuation
    topic = re.sub(r"[\.:;]+$", "", topic)
    # Remove "Introduction –" or similar prefixes
    topic = re.sub(r"^Introduction\s*[-–]\s*", "", topic, flags=re.IGNORECASE)
    return topic