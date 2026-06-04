from flask import Flask, request, jsonify, Response, stream_with_context
from flask_cors import CORS
import sqlite3
import json
import anthropic
import os
from datetime import datetime
import uuid

app = Flask(__name__)
CORS(app)

client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))
DB_PATH = "mirrorself.db"

# ── DB 초기화 ──────────────────────────────────────────────
def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.executescript("""
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT,
            created_at TEXT
        );
        CREATE TABLE IF NOT EXISTS sessions (
            id TEXT PRIMARY KEY,
            user_id TEXT,
            module TEXT,
            step INTEGER DEFAULT 0,
            started_at TEXT,
            completed_at TEXT,
            notes TEXT
        );
        CREATE TABLE IF NOT EXISTS entries (
            id TEXT PRIMARY KEY,
            session_id TEXT,
            user_id TEXT,
            module TEXT,
            step_key TEXT,
            content TEXT,
            ai_response TEXT,
            emotion_score INTEGER,
            created_at TEXT
        );
        CREATE TABLE IF NOT EXISTS growth_log (
            id TEXT PRIMARY KEY,
            user_id TEXT,
            week TEXT,
            projection_count INTEGER DEFAULT 0,
            regulation_count INTEGER DEFAULT 0,
            insight TEXT,
            created_at TEXT
        );
    """)
    conn.commit()
    conn.close()

init_db()

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

# ── 시스템 프롬프트 ────────────────────────────────────────
SYSTEM_PROMPTS = {
    "projection": """당신은 심리 전문가 AI 'Mirror'입니다. 전문 분야는 방어 기제 중 '투사(Projection)'입니다.
투사란 자신이 받아들이기 어려운 감정이나 생각을 타인에게 귀인하는 무의식적 방어 기제입니다.

역할:
1. 사용자의 이야기에서 투사 패턴을 부드럽게, 비판단적으로 탐지합니다
2. 소크라테스식 질문으로 자기 인식을 유도합니다
3. 내면의 감정을 '나 전달법(I-message)'으로 표현하도록 안내합니다
4. 한국어로 따뜻하고 전문적으로 응답합니다

절대 하지 말 것:
- 직접적으로 "당신이 투사하고 있습니다"라고 단정 짓기
- 비판이나 판단
- 과도하게 긴 응답 (3-4 문단 이내)

응답 마지막에는 항상 하나의 성찰 질문을 포함하세요.""",

    "regulation": """당신은 감정 조절 전문가 AI 'Mirror'입니다.
근거 기반 기법(DBT, ACT, CBT)을 활용하여 감정 조절 프로토콜을 안내합니다.

현재 단계별 접근:
- 감정 인식 및 명명 (affect labeling)
- 신체 감각 탐지
- 인지 재구성
- 행동 활성화

한국어로 따뜻하고 실용적으로 응답하세요. 
각 응답에는 즉시 실행 가능한 구체적 기법 하나를 포함하세요.""",

    "insight": """당신은 심리 통찰 AI 'Mirror'입니다.
사용자의 감정 패턴과 성장 여정을 분석하고, 핵심 인사이트와 성장 방향을 제시합니다.
따뜻하고 격려적인 톤으로 한국어로 응답하세요."""
}

# ── API 라우트 ─────────────────────────────────────────────

@app.route("/api/user", methods=["POST"])
def create_user():
    data = request.json
    user_id = str(uuid.uuid4())
    conn = get_db()
    conn.execute("INSERT INTO users VALUES (?, ?, ?)",
                 (user_id, data.get("name", "익명"), datetime.now().isoformat()))
    conn.commit()
    conn.close()
    return jsonify({"user_id": user_id})

@app.route("/api/session", methods=["POST"])
def create_session():
    data = request.json
    session_id = str(uuid.uuid4())
    conn = get_db()
    conn.execute("INSERT INTO sessions VALUES (?, ?, ?, ?, ?, ?, ?)",
                 (session_id, data["user_id"], data["module"], 0,
                  datetime.now().isoformat(), None, None))
    conn.commit()
    conn.close()
    return jsonify({"session_id": session_id})

@app.route("/api/chat/stream", methods=["POST"])
def chat_stream():
    data = request.json
    module = data.get("module", "projection")
    messages = data.get("messages", [])
    session_id = data.get("session_id")
    user_id = data.get("user_id")
    user_input = data.get("user_input", "")

    system = SYSTEM_PROMPTS.get(module, SYSTEM_PROMPTS["projection"])

    def generate():
        full_response = ""
        with client.messages.stream(
            model="claude-sonnet-4-20250514",
            max_tokens=800,
            system=system,
            messages=messages
        ) as stream:
            for text in stream.text_stream:
                full_response += text
                yield f"data: {json.dumps({'text': text})}\n\n"

        # 응답 저장
        if session_id and user_id:
            entry_id = str(uuid.uuid4())
            conn = get_db()
            conn.execute(
                "INSERT INTO entries VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                (entry_id, session_id, user_id, module, "chat",
                 user_input, full_response, None, datetime.now().isoformat())
            )
            conn.commit()
            conn.close()

        yield f"data: {json.dumps({'done': True})}\n\n"

    return Response(stream_with_context(generate()),
                    mimetype="text/event-stream",
                    headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"})

@app.route("/api/entries/<user_id>", methods=["GET"])
def get_entries(user_id):
    conn = get_db()
    rows = conn.execute(
        "SELECT * FROM entries WHERE user_id=? ORDER BY created_at DESC LIMIT 50",
        (user_id,)
    ).fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])

@app.route("/api/growth/<user_id>", methods=["GET"])
def get_growth(user_id):
    conn = get_db()
    rows = conn.execute(
        "SELECT module, COUNT(*) as count, DATE(created_at) as day FROM entries WHERE user_id=? GROUP BY module, day ORDER BY day DESC",
        (user_id,)
    ).fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])

@app.route("/api/insight/stream", methods=["POST"])
def insight_stream():
    data = request.json
    user_id = data.get("user_id")

    conn = get_db()
    entries = conn.execute(
        "SELECT content, module, created_at FROM entries WHERE user_id=? ORDER BY created_at DESC LIMIT 20",
        (user_id,)
    ).fetchall()
    conn.close()

    if not entries:
        def empty():
            yield f"data: {json.dumps({'text': '아직 기록된 세션이 없습니다. 먼저 투사 인식이나 감정 조절 모듈을 진행해보세요.'})}\n\n"
            yield f"data: {json.dumps({'done': True})}\n\n"
        return Response(stream_with_context(empty()), mimetype="text/event-stream")

    summary = "\n".join([f"[{r['module']}] {r['content'][:100]}" for r in entries])
    prompt = f"다음은 사용자의 최근 세션 기록입니다:\n{summary}\n\n이 패턴을 분석하여 핵심 성장 인사이트와 다음 단계를 제시해주세요."

    def generate():
        with client.messages.stream(
            model="claude-sonnet-4-20250514",
            max_tokens=600,
            system=SYSTEM_PROMPTS["insight"],
            messages=[{"role": "user", "content": prompt}]
        ) as stream:
            for text in stream.text_stream:
                yield f"data: {json.dumps({'text': text})}\n\n"
        yield f"data: {json.dumps({'done': True})}\n\n"

    return Response(stream_with_context(generate()), mimetype="text/event-stream",
                    headers={"Cache-Control": "no-cache"})

@app.route("/health")
def health():
    return jsonify({"status": "ok"})

if __name__ == "__main__":
    app.run(debug=True, port=5000)
