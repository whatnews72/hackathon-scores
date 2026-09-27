# 해커톤 점수 관리 시스템 - 백엔드

Express.js 기반의 해커톤 팀 점수 관리 API 서버입니다.

## 설치

```bash
npm install
```

## 실행

### 개발 환경
```bash
npm run dev
```

개발 서버는 포트 3000에서 실행됩니다.

### 프로덕션 환경
```bash
npm start
```

## 환경 설정

`.env` 파일을 생성하여 다음과 같이 설정합니다:

```
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3001,http://localhost:5173
```

`.env.example` 파일을 참고하세요.

## API 엔드포인트

### 팀 관리
- `GET /api/v1/teams` - 모든 팀 조회
- `GET /api/v1/teams/:id` - 팀 상세 조회
- `POST /api/v1/teams` - 팀 생성
- `PUT /api/v1/teams/:id` - 팀 수정
- `DELETE /api/v1/teams/:id` - 팀 삭제

### 심사위원 관리
- `GET /api/v1/judges` - 모든 심사위원 조회
- `GET /api/v1/judges/:id` - 심사위원 상세 조회
- `POST /api/v1/judges` - 심사위원 생성
- `PUT /api/v1/judges/:id` - 심사위원 수정
- `DELETE /api/v1/judges/:id` - 심사위원 삭제

### 점수 관리
- `GET /api/v1/scores` - 모든 점수 조회
- `GET /api/v1/scores/:id` - 점수 상세 조회
- `GET /api/v1/scores/team/:teamId` - 팀별 점수 조회
- `GET /api/v1/scores/judge/:judgeId` - 심사위원별 점수 조회
- `POST /api/v1/scores` - 점수 생성
- `PUT /api/v1/scores/:id` - 점수 수정
- `DELETE /api/v1/scores/:id` - 점수 삭제

### 결과 및 순위
- `GET /api/v1/results` - 최종 결과 및 순위 조회
- `GET /api/v1/results/team/:teamId` - 팀별 최종 결과 조회
- `POST /api/v1/results/calculate` - 최종 결과 계산 및 순위 결정

## 프로젝트 구조

```
backend/
├── src/
│   ├── models/          # 데이터 모델 (Team, Judge, Score, Result)
│   ├── routes/          # API 라우트 정의
│   ├── services/        # 비즈니스 로직 (데이터 관리, 계산)
│   ├── utils/           # 유틸리티 함수 (검증, 도우미)
│   ├── middleware/      # 미들웨어 (인증, 에러 처리 등)
│   ├── app.js           # Express 앱 설정
│   └── index.js         # 서버 진입점
├── tests/               # 테스트 파일
├── .env.example         # 환경 변수 템플릿
└── package.json         # 프로젝트 의존성
```

## 데이터 모델

### Team (팀)
- `id`: 고유 ID
- `name`: 팀명
- `members`: 팀원 목록 (배열)
- `createdAt`: 생성 시간

### Judge (심사위원)
- `id`: 고유 ID
- `name`: 이름
- `category`: 평가 카테고리
- `createdAt`: 생성 시간

### Score (점수)
- `id`: 고유 ID
- `teamId`: 팀 ID
- `judgeId`: 심사위원 ID
- `score`: 점수 (0-100)
- `comment`: 평가 의견
- `createdAt`: 생성 시간

### Result (최종 결과)
- `teamId`: 팀 ID
- `totalScore`: 총점 (평균)
- `rank`: 순위
- `createdAt`: 계산 시간

## 점수 계산 방식

현재는 **산술평균** 방식을 사용합니다:
```
팀의 최종 점수 = (모든 심사위원의 점수 합) / 심사위원 수
```

## 향후 개선 사항

- [ ] 데이터베이스 연동 (SQLite, PostgreSQL 등)
- [ ] 인증/인가 구현
- [ ] 점수 가중치 설정
- [ ] 데이터 내보내기 (CSV, Excel)
- [ ] 실시간 순위 업데이트 (WebSocket)
- [ ] 테스트 코드 작성
- [ ] API 문서화 (Swagger/OpenAPI)
