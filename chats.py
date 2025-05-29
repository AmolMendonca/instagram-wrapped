import os
import string
import re
from bs4 import BeautifulSoup
from collections import Counter
from datetime import datetime
import emoji
from nltk.corpus import stopwords
from nltk import bigrams
import nltk

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

nltk.download('stopwords')

# === SETTINGS ===
inbox_root = "/Users/amolmendonca/Downloads/instagram-rajutiktok_king-2025-05-26-YjPdMj0y/your_instagram_activity/messages/inbox"
your_aliases = {"raju", "Amol Mendonca", "amol mendonca"}
excluded_from_output = {"Instagram User", "Annie"}

# === TEXT CLEANING ===
stop_words = set(stopwords.words("english"))
translator = str.maketrans("", "", string.punctuation)
skip_words = {"reels", "fyp", "viral", "explore", "explorepage", "funny", "sent", "attachment"}
bad_tokens = {
    "am", "pm", "amol", "shetty", "mendonca",
    "jan", "feb", "mar", "apr", "may", "jun",
    "jul", "aug", "sep", "oct", "nov", "dec",
    "sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"
}

def is_meaningful_text(text):
    junk_phrases = [
        "shared a story", "reacted",
        "liked a message", "story from", "post from"
    ]
    return (
        not any(p in text.lower() for p in junk_phrases)
        and len(text.strip()) > 2
        and not re.fullmatch(r"[\d\W]+", text.strip())
    )

# === FASTAPI SETUP ===
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/stats")
def get_stats():
    print("🚀 API called")
    try:
        total_message_counts = Counter()
        after_midnight_counts = Counter()
        emoji_counter = Counter()
        reel_counter = Counter()
        word_counter = Counter()
        bigram_counter = Counter()
        longest_message = {"sender": None, "length": 0, "text": ""}
        message_count = 0

        for root, dirs, files in os.walk(inbox_root):
            print("📂 Scanning:", root)
            for file in files:
                if file == "message_1.html":
                    full_path = os.path.join(root, file)
                    print("📄 Reading:", full_path)
                    try:
                        with open(full_path, "r", encoding="utf-8") as f:
                            soup = BeautifulSoup(f, "html.parser")
                            message_blocks = soup.find_all("div", class_="pam _3-95 _2ph- _a6-g uiBoxWhite noborder")

                            for block in message_blocks:
                                sender_tag = block.find("h2", class_="_3-95 _2pim _a6-h _a6-i")
                                content_tag = block.find("div", class_="_3-95 _a6-p")
                                time_tag = block.find("div", class_="_3-94 _a6-o")

                                if sender_tag and content_tag:
                                    sender = sender_tag.get_text(strip=True)

                                    total_message_counts[sender] += 1

                                    if time_tag:
                                        try:
                                            time_str = time_tag.get_text(strip=True)
                                            msg_time = datetime.strptime(time_str, "%b %d, %Y %I:%M %p")
                                            if 0 <= msg_time.hour < 6:
                                                after_midnight_counts[sender] += 1
                                        except Exception:
                                            pass

                                    for text in content_tag.stripped_strings:
                                        message_count += 1
                                        normalized_text = text.lower().replace("www.", "").replace("https://", "").replace("http://", "").strip()

                                        if sender not in your_aliases and normalized_text in {"sent an attachment", "sent"}:
                                            reel_counter[sender] += 1
                                            print(f"📎 Attachment reel assumed from {sender}: {text}")
                                            continue

                                        is_reel = (
                                            "instagram.com/reel/" in normalized_text
                                            or "instagram.com/reels/" in normalized_text
                                            or "instagram.com/p/" in normalized_text
                                            or "sent a reel" in normalized_text
                                            or "shared a reel" in normalized_text
                                            or normalized_text.startswith("reel from")
                                            or ("shared a post" in normalized_text and "instagram.com" in normalized_text)
                                        )

                                        if sender not in your_aliases and is_reel:
                                            reel_counter[sender] += 1
                                            print(f"🎞️ Reel detected from {sender}: {text}")
                                            continue

                                        if not is_meaningful_text(text):
                                            continue

                                        length = len(text)
                                        if length > longest_message["length"]:
                                            longest_message["sender"] = sender
                                            longest_message["length"] = length
                                            longest_message["text"] = text

                                        if sender in your_aliases:
                                            for char in text:
                                                if emoji.is_emoji(char):
                                                    emoji_counter[char] += 1

                                            clean_text = text.lower().translate(translator)
                                            words = clean_text.split()

                                            filtered_words = []
                                            for w in words:
                                                if (
                                                    w in stop_words
                                                    or w in skip_words
                                                    or w in bad_tokens
                                                    or len(w) <= 1
                                                    or re.search(r"\d", w)
                                                    or re.search(r"[^\w\s]", w)
                                                    or w.startswith("@")
                                                    or w.startswith("#")
                                                ):
                                                    continue
                                                filtered_words.append(w)

                                            word_counter.update(filtered_words)
                                            bigram_counter.update(bigrams(filtered_words))

                    except Exception as e:
                        print(f"❌ Failed to read {full_path}: {e}")

        print(f"✅ Processing complete — total messages parsed: {message_count}")

        return {
            "top_chatted": [
                {"name": name, "count": count}
                for name, count in total_message_counts.most_common()
                if name not in your_aliases and name not in excluded_from_output
            ][:15],
            "midnight": [
                {"name": name, "count": count}
                for name, count in after_midnight_counts.most_common()
                if name not in your_aliases and name not in excluded_from_output
            ][:10],
            "reels": [
                {"name": name, "count": count}
                for name, count in reel_counter.most_common()
                if name not in your_aliases and name not in excluded_from_output
            ][:10],
            "longest": [
                {
                    "name": longest_message["sender"],
                    "count": longest_message["length"],
                    "preview": longest_message["text"][:200],
                }
            ] if longest_message["sender"] and longest_message["sender"] not in your_aliases and longest_message["sender"] not in excluded_from_output else [],
            "emojis": emoji_counter.most_common(20),
            "words": word_counter.most_common(20),
            "bigrams": [{"phrase": " ".join(k), "count": v} for k, v in bigram_counter.most_common(20)],
        }

    except Exception as e:
        print("💥 Fatal error in /api/stats:", e)
        return {"error": str(e)}
