# Instagram Chat Analyzer 📊

This project analyzes your exported Instagram messages and visualizes insights using a Python backend (FastAPI) and a React frontend.

## 💡 What It Does

- Extracts meaningful messages from Instagram's HTML archive
- Computes stats like:
  - Top messaged people
  - Late-night conversations
  - Emoji usage
  - Most shared reels
  - Most frequent words and bigrams
  - Longest message sent
- Displays the analysis with a step-by-step animated React interface

---

## 🛠️ Tech Stack

**Backend**
- Python 3
- FastAPI
- BeautifulSoup4
- NLTK
- emoji

**Frontend**
- React + TailwindCSS
- Lucide React icons
- Animated counters and transitions

---

## 📁 Folder Structure

```
/project-root
  ├── app.py (or your FastAPI file)
  ├── frontend/ (optional if your React app is in a subfolder)
  ├── README.md
  └── ...
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
```

---

### 2. Backend Setup (FastAPI)

#### Install dependencies

```bash
pip install fastapi beautifulsoup4 nltk emoji uvicorn
python -c "import nltk; nltk.download('stopwords')"
```

#### Run the backend

```bash
uvicorn app:app --reload
```

Replace `app:app` with the actual filename and FastAPI instance name if different.

---

### 3. Frontend Setup (React)

Assuming you are in the React frontend directory:

```bash
npm install
npm run dev
```

Your frontend should now be running at `http://localhost:3000`.

---

## ⚙️ Configuration

Edit the Python file to set:

```python
inbox_root = "/path/to/your/messages/inbox"
your_aliases = {"your_name", "nickname", "etc"}
```

These help filter out your own messages and avoid duplicate counting.

---

## 🌟 Example Features Displayed

- 📈 Total messages and top messaged friends
- 🌙 Messages sent after midnight
- 🎞️ Most reels shared
- 😄 Top used emojis
- ✍️ Longest message
- 🧠 Frequent words and bigrams

---

## 📝 License

This project is licensed under the MIT License.
