# 해커톤 점수 관리 시스템 - 전체 설정 가이드

완벽한 풀스택 해커톤 점수 관리 시스템이 설정되었습니다! 🎉

## 📋 목차

1. [프로젝트 구조](#프로젝트-구조)
2. [빠른 시작](#빠른-시작)
3. [상세 설정](#상세-설정)
4. [API 문서](#api-문서)
5. [개발 팁](#개발-팁)
6. [배포 가이드](#배포-가이드)

## 프로젝트 구조

```
Hackaton_scores/
├── backend/                    # 백엔드 (Node.js + Express.js)
│   ├── src/
│   │   ├── models/            # 데이터 모델
│   │   ├── routes/            # API 라우트
│   │   ├── services/          # 비즈니스 로직
│   │   ├── utils/             # 유틸리티
│   │   ├── middleware/        # 미들웨어
│   │   ├── app.js             # Express 앱
│   │   └── index.js           # 진입점
│   ├── .env                   # 환경 변수
│   ├── .gitignore
│   ├── package.json
│   └── README.md              # 백엔드 문서
│
├── frontend/                  # 프론트엔드 (React + Vite)
│   ├── src/
│   │   ├── components/        # React 컴포넌트
│   │   │   ├── Layout/
│   │   │   ├── Teams/
│   │   │   ├── Judges/
│   │   │   ├── Scores/
│   │   │   └── Results/
│   │   ├── pages/             # 페이지
│   │   ├── services/          # API 클라이언트
│   │   ├── App.jsx            # 메인 앱
│   │   └── main.jsx           # 진입점
│   ├── .env.local             # 환경 변수
│   ├── package.json
│   └── README.md              # 프론트엔드 문서
│
├── CLAUDE.md                  # Claude Code 가이드
├── BACKEND_SETUP.md           # 백엔드 설정 보고서
├── FRONTEND_SETUP.md          # 프론트엔드 설정 보고서
├── SETUP_GUIDE.md             # 이 파일
└── ROADMAP.md                 # 프로젝트 로드맵
```

## 빠른 시작

### 사전 요구 사항

- Node.js 16.0.0 이상
- npm 또는 yarn

### 설치 및 실행

#### 1단계: 저장소 초기화

```bash
cd Hackaton_scores
```

#### 2단계: 백엔드 실행

**터미널 1**:
```bash
cd backend
npm install  # 이미 설치되어 있으면 스킵
npm run dev
```

백엔드가 `http://localhost:3000`에서 실행됩니다.

#### 3단계: 프론트엔드 실행

**터미널 2**:
```bash
cd frontend
npm install  # 이미 설치되어 있으면 스킵
npm run dev
```

프론트엔드가 `http://localhost:5173`에서 실행됩니다.

#### 4단계: 브라우저에서 열기

```
http://localhost:5173
```

## 상세 설정

### 백엔드 설정

**기술 스택**:
- Node.js
- Express.js
- Joi (검증)
- Morgan (로깅)
- CORS

**환경 변수** (`.env`):
```env
PORT=3000
NODE_ENV=development
API_PREFIX=/api/v1
CORS_ORIGIN=http://localhost:3001,http://localhost:5173
```

**실행 명령어**:
```bash
npm run dev      # 개발 (자동 재시작)
npm start        # 프로덕션
npm test         # 테스트 (향후)
```

**API 엔드포인트**: `/api/v1`

### 프론트엔드 설정

**기술 스택**:
- React 19
- Vite
- React Router
- Axios
- Tailwind CSS

**환경 변수** (`.env.local`):
```env
VITE_API_URL=http://localhost:3000/api/v1
```

**실행 명령어**:
```bash
npm run dev      # 개발
npm run build    # 빌드
npm run preview  # 미리보기
```

**접속 URL**: `http://localhost:5173`

## API 문서

### 기본 정보

- **베이스 URL**: `http://localhost:3000/api/v1`
- **응답 형식**: JSON
- **CORS**: 활성화됨

### 팀 API

```
GET    /teams              # 모든 팀 조회
GET    /teams/:id          # 팀 상세 조회
POST   /teams              # 팀 생성
PUT    /teams/:id          # 팀 수정
DELETE /teams/:id          # 팀 삭제
```

**팀 생성 요청 예시**:
```json
{
  "name": "팀 A",
  "members": ["Alice", "Bob", "Charlie"]
}
```

### 심사위원 API

```
GET    /judges             # 모든 심사위원 조회
GET    /judges/:id         # 심사위원 상세 조회
POST   /judges             # 심사위원 생성
PUT    /judges/:id         # 심사위원 수정
DELETE /judges/:id         # 심사위원 삭제
```

**심사위원 생성 요청 예시**:
```json
{
  "name": "Judge 1",
  "category": "기술성"
}
```

### 점수 API

```
GET    /scores             # 모든 점수 조회
GET    /scores/:id         # 점수 상세 조회
GET    /scores/team/:teamId       # 팀별 점수 조회
GET    /scores/judge/:judgeId     # 심사위원별 점수 조회
POST   /scores             # 점수 생성
PUT    /scores/:id         # 점수 수정
DELETE /scores/:id         # 점수 삭제
```

**점수 생성 요청 예시**:
```json
{
  "teamId": 1,
  "judgeId": 1,
  "score": 85,
  "comment": "매우 좋은 기술적 접근"
}
```

### 결과 API

```
GET    /results            # 최종 결과 및 순위 조회
GET    /results/team/:teamId      # 팀별 최종 결과 조회
POST   /results/calculate  # 최종 결과 계산 및 순위 결정
```

## 개발 팁

### 자동 형식 지정

코드 스타일 일관성을 위해 자동 형식 지정 도구 설정을 권장합니다.

### 핫 모듈 교체 (HMR)

프론트엔드와 백엔드 모두 파일 변경 시 자동으로 다시 로드됩니다:
- **프론트엔드**: Vite의 HMR
- **백엔드**: Nodemon

### 디버깅

**백엔드**:
```bash
NODE_DEBUG=* npm run dev
```

**프론트엔드**:
- 브라우저 개발자 도구 (F12)
- React DevTools 확장 프로그램 설치

### 테스팅

프로덕션 배포 전에 다음을 확인하세요:
1. 모든 API 엔드포인트 테스트
2. CRUD 작업 (생성/읽기/수정/삭제) 확인
3. 점수 계산 로직 확인
4. 순위 결정 로직 확인
5. 브라우저 호환성 확인

## 배포 가이드

### 사전 준비

1. **데이터베이스 설정**
   - SQLite, PostgreSQL, MongoDB 등 선택
   - 백엔드에서 데이터베이스 연동 구현

2. **인증/인가 구현**
   - JWT 또는 OAuth 추가
   - 심사위원 권한 관리

3. **환경 변수 설정**
   - 프로덕션 환경에 맞게 변경
   - API 엔드포인트 업데이트

### 백엔드 배포

**Heroku 예시**:
```bash
heroku create hackaton-scores-api
git push heroku main
```

**AWS 예시**:
```bash
# Elastic Beanstalk, EC2 등 이용
```

**환경 변수 설정**:
```env
PORT=80 (또는 할당된 포트)
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-domain.com
```

### 프론트엔드 배포

**Vercel 예시**:
```bash
npm install -g vercel
vercel
```

**Netlify 예시**:
```bash
npm install -g netlify-cli
netlify deploy
```

**환경 변수 설정**:
```env
VITE_API_URL=https://your-api-domain.com/api/v1
```

### 도메인 연결

1. 도메인 구입
2. DNS 설정
3. HTTPS 인증서 설정 (Let's Encrypt 등)
4. 프론트엔드/백엔드 URL 업데이트

## 문제 해결

### 포트 이미 사용 중

```bash
# Windows
netstat -ano | findstr :3000  # 포트 3000 확인
taskkill /PID <PID> /F        # 프로세스 종료

# macOS/Linux
lsof -i :3000                 # 포트 3000 확인
kill -9 <PID>                 # 프로세스 종료
```

### CORS 에러

`.env` 파일에서 `CORS_ORIGIN` 확인:
```env
CORS_ORIGIN=http://localhost:5173
```

### API 응답 없음

1. 백엔드 서버 실행 확인
2. API 엔드포인트 확인
3. 방화벽 설정 확인
4. 환경 변수 확인

### 데이터 저장 안 됨

현재 데이터는 메모리에 저장됩니다. 프로덕션 배포 전에 데이터베이스 연동이 필수입니다.

## 다음 단계

### 즉시 구현 가능
1. ✅ 풀스택 기본 구조 완성
2. [ ] 데이터베이스 연동
3. [ ] 사용자 인증
4. [ ] 권한 관리

### 향후 개선
1. [ ] 통계 및 차트
2. [ ] 실시간 순위 업데이트
3. [ ] 이메일 알림
4. [ ] 모바일 앱
5. [ ] API 문서화 (Swagger)
6. [ ] 테스트 커버리지

## 문서 참조

- **프로젝트 가이드**: [CLAUDE.md](./CLAUDE.md)
- **백엔드 설정**: [BACKEND_SETUP.md](./BACKEND_SETUP.md)
- **프론트엔드 설정**: [FRONTEND_SETUP.md](./FRONTEND_SETUP.md)
- **백엔드 README**: [backend/README.md](./backend/README.md)
- **프론트엔드 README**: [frontend/README.md](./frontend/README.md)

## 지원

문제가 발생하면:
1. 에러 메시지 확인
2. 해당 README.md 파일 참조
3. 환경 변수 확인
4. 포트 충돌 확인
5. 로그 파일 확인

## 라이선스

MIT

---

**마지막 업데이트**: 2026-09-27

🎉 **축하합니다! 전체 해커톤 점수 관리 시스템이 준비되었습니다!**
