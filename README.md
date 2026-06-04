# MirrorSelf — 투사 방지 & 감정 조절 프로그램

> **부적절한 투사를 인식하고, 감정을 스스로 조절하는 사람으로 성장하는 AI 기반 심리 성장 플랫폼**
> *An AI-powered psychological growth platform for recognizing projection and developing emotional self-regulation.*

---

## 공익 목적 선언 / Public Benefit Statement

본 프로젝트는 심리 교육 및 자기 성장을 위한 공익 목적의 오픈소스 프로그램입니다.  
상업적 이용 전 사전 문의가 필요합니다. AI 응답은 전문 심리 상담을 대체하지 않습니다.

*This project is an open-source program for psychological education and personal growth. Commercial use requires prior contact. AI responses do not replace professional counseling.*

---

## 핵심 프로토콜 / Core Protocol

```
01 정지 (Pause)     → 반응하기 전 3초 멈추기
02 탐지 (Detect)    → 지금 내 감정은 무엇인가?
03 귀인 (Attribute) → 이 감정의 주인은 누구인가?
04 표현 (Express)   → 나 전달법으로 표현하기
05 조절 (Regulate)  → 감정 조절 기술 적용하기
```

---

## 모듈 구성 / Modules

| 모듈 | 설명 | 근거 이론 |
|------|------|-----------|
| **투사 인식 (Projection Recognition)** | 무의식적 귀인 패턴 탐색, 나 전달법 훈련 | 정신분석, 대상관계이론 |
| **감정 조절 (Emotion Regulation)** | 단계별 감정 조절 프로토콜, 4-7-8 호흡법, 5감 그라운딩 | DBT, ACT, CBT |
| **성장 통찰 (Growth Insight)** | 세션 패턴 분석, AI 통찰 생성 | 내러티브 치료 |

---

## 기술 스택 / Tech Stack

**Frontend**
- React 18 + Vite
- Tailwind CSS
- Framer Motion
- React Router

**Backend**
- Flask (Python)
- SQLite
- Anthropic Claude API (SSE Streaming)

---

## 설치 및 실행 / Installation & Setup

### 1. 저장소 클론
```bash
git clone https://github.com/your-username/mirrorself.git
cd mirrorself
```

### 2. 백엔드 설정
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# .env 파일에 ANTHROPIC_API_KEY 입력
```

### 3. 프론트엔드 설정
```bash
cd ../frontend
npm install
```

### 4. 실행
```bash
# 터미널 1 — 백엔드
cd backend && python app.py

# 터미널 2 — 프론트엔드
cd frontend && npm run dev
```

브라우저에서 `http://localhost:5173` 접속

---

## 환경 변수 / Environment Variables

| 변수명 | 설명 |
|--------|------|
| `ANTHROPIC_API_KEY` | Anthropic API 키 (필수) |

---

## 사용 정책 / Usage Policy

| 목적 | 허용 여부 |
|------|-----------|
| 개인 사용 / 학습 | ✅ 자유 이용 |
| 학술 연구 | ✅ 자유 이용 |
| 비영리 심리 교육 | ✅ 자유 이용 |
| 상업적 이용 | ⚠️ 사전 문의 필요 |

---

## 윤리적 고지 / Ethical Notice

- 본 프로그램의 AI 응답은 심리 **교육적** 목적이며, 전문 심리 상담 및 치료를 대체하지 않습니다
- 심각한 심리적 고통을 경험하고 있다면 전문가의 도움을 받으시길 권장합니다
- 대화 내용은 로컬 SQLite에만 저장되며 외부 서버로 전송되지 않습니다 (API 호출 제외)

*AI responses are for educational purposes only and do not replace professional psychological counseling or treatment.*

---

## 라이선스 / License

MIT License — 자세한 내용은 [LICENSE](./LICENSE) 파일 참조
