# 해커톤 점수 관리 시스템 - 프론트엔드

React + Vite + Tailwind CSS로 구성된 모던한 웹 UI입니다.

## 설치

```bash
npm install
```

## 실행

### 개발 환경
```bash
npm run dev
```

개발 서버는 `http://localhost:5173`에서 실행됩니다.

### 빌드
```bash
npm run build
```

## 환경 설정

`.env.local` 파일을 생성하여 백엔드 API URL을 설정합니다:

```
VITE_API_URL=http://localhost:3000/api/v1
```

`.env.example` 파일을 참고하세요.

## 프로젝트 구조

```
frontend/
├── src/
│   ├── components/
│   │   ├── Layout/              # 레이아웃 컴포넌트
│   │   │   └── Navigation.jsx
│   │   ├── Teams/               # 팀 관리 컴포넌트
│   │   │   ├── TeamList.jsx
│   │   │   └── TeamForm.jsx
│   │   ├── Judges/              # 심사위원 관리 컴포넌트
│   │   │   ├── JudgeList.jsx
│   │   │   └── JudgeForm.jsx
│   │   ├── Scores/              # 점수 관리 컴포넌트
│   │   │   ├── ScoreList.jsx
│   │   │   └── ScoreForm.jsx
│   │   └── Results/             # 결과 표시 컴포넌트
│   │       └── ResultList.jsx
│   ├── pages/
│   │   └── Home.jsx             # 홈 페이지
│   ├── services/
│   │   └── api.js               # API 호출 함수
│   ├── App.jsx                  # 메인 앱 컴포넌트 (라우팅)
│   ├── main.jsx                 # 진입점
│   └── index.css                # 전역 스타일
├── .env.local                   # 환경 변수 (로컬)
├── .env.example                 # 환경 변수 템플릿
├── vite.config.js               # Vite 설정
└── package.json                 # 프로젝트 의존성
```

## 기술 스택

- **React** - UI 라이브러리
- **Vite** - 빌드 도구 (빠른 개발 환경)
- **React Router** - 라우팅
- **Axios** - HTTP 클라이언트
- **Tailwind CSS** - CSS 유틸리티 프레임워크

## 페이지 및 기능

### 홈 페이지 (/)
- 각 섹션으로 바로가기
- 프로젝트 소개

### 팀 관리 (/teams)
- 팀 목록 조회
- 팀 추가
- 팀 수정
- 팀 삭제

### 심사위원 (/judges)
- 심사위원 목록 조회
- 심사위원 추가
- 심사위원 수정
- 심사위원 삭제

### 점수 입력 (/scores)
- 점수 목록 조회
- 팀과 심사위원별 점수 입력
- 점수 수정
- 점수 삭제

### 최종 결과 (/results)
- 최종 순위 조회
- 순위 계산 (POST)
- 메달 표시 (🏆 🥈 🥉)

## 주요 컴포넌트

### API Service (`src/services/api.js`)
모든 API 호출을 관리하는 중앙 서비스:
- `teamAPI` - 팀 관리 API
- `judgeAPI` - 심사위원 관리 API
- `scoreAPI` - 점수 관리 API
- `resultAPI` - 결과 조회 API

### Form 컴포넌트
모달 형식의 입력 폼:
- `TeamForm` - 팀 정보 입력
- `JudgeForm` - 심사위원 정보 입력
- `ScoreForm` - 점수 입력

### List 컴포넌트
데이터 표시 및 관리:
- `TeamList` - 팀 카드 형식 표시
- `JudgeList` - 심사위원 테이블 표시
- `ScoreList` - 점수 테이블 표시
- `ResultList` - 순위 카드 형식 표시

## 스타일

Tailwind CSS를 사용하여 반응형 디자인을 구현했습니다:
- 모바일 우선 접근
- 다크 모드 지원 가능
- 통일된 색상 및 레이아웃

## API 연동

프론트엔드는 백엔드 API와 다음과 같이 통신합니다:

```
http://localhost:3000/api/v1
├── /teams
├── /judges
├── /scores
└── /results
```

## 다음 단계

- [ ] 로그인/인증 기능
- [ ] 팀별 상세 점수 보기
- [ ] 점수 통계 및 차트
- [ ] 실시간 순위 업데이트 (WebSocket)
- [ ] 데이터 내보내기
- [ ] PWA 적용
- [ ] 다크 모드
