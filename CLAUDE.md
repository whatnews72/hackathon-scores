# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

**Hackathon Scores** - 해커톤 참가 팀의 점수 및 평가를 관리하는 시스템입니다.

이 프로젝트는 초기 단계이며, 다음과 같은 핵심 기능을 지원하도록 설계되었습니다:
- 팀 정보 관리 (등록, 수정, 삭제)
- 점수 입력 및 관리 (심사위원별 평가)
- 점수 계산 및 순위 결정
- 결과 조회 및 리포트 생성

## 개발 환경 설정

프로젝트가 아직 초기 단계이므로, 다음과 같은 스택을 권장합니다:

### 기술 스택 (권장)
- **Backend**: Node.js + Express.js 또는 Python + Flask/FastAPI
- **Frontend**: React 또는 Vue.js
- **Database**: PostgreSQL 또는 MongoDB
- **API**: RESTful API 또는 GraphQL

### 프로젝트 구조 (예상)
```
hackaton-scores/
├── backend/
│   ├── src/
│   │   ├── models/       # 데이터베이스 모델 (Team, Judge, Score, etc.)
│   │   ├── routes/       # API 라우트
│   │   ├── services/     # 비즈니스 로직
│   │   └── utils/        # 유틸리티 함수
│   ├── tests/
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/   # React/Vue 컴포넌트
│   │   ├── pages/
│   │   ├── services/     # API 호출 함수
│   │   └── styles/
│   └── package.json
├── docs/                 # 프로젝트 문서
└── ROADMAP.md
```

## 핵심 엔티티

프로젝트 구현 시 다음 엔티티를 관리해야 합니다:

### Team (팀)
- `id`: 고유 ID
- `name`: 팀명
- `members`: 팀원 정보
- `created_at`: 등록 시간

### Judge (심사위원)
- `id`: 고유 ID
- `name`: 이름
- `category`: 평가 카테고리 (기술성, 창의성, 완성도 등)

### Score (점수)
- `id`: 고유 ID
- `team_id`: 팀 ID
- `judge_id`: 심사위원 ID
- `score`: 점수 (예: 0-100)
- `comment`: 평가 의견

### Result (최종 결과)
- `team_id`: 팀 ID
- `total_score`: 총점
- `rank`: 순위
- `created_at`: 계산 시간

## 일반적인 개발 명령어

개발 환경이 설정된 후 다음 명령어들을 사용합니다:

### Backend (Node.js 기준)
```bash
npm install                 # 의존성 설치
npm run dev                 # 개발 서버 실행
npm test                    # 테스트 실행
npm run build               # 빌드
```

### Frontend
```bash
npm install                 # 의존성 설치
npm start                   # 개발 서버 실행
npm test                    # 테스트 실행
npm run build               # 빌드
```

## 데이터베이스 마이그레이션

점수 계산 로직에 따라 데이터베이스 스키마가 변경될 수 있습니다:
- 평균값 계산 방식 (산술평균, 가중평균 등)
- 특정 카테고리 점수 제외 여부
- 최종 순위 결정 방식

## 보안 고려사항

- 심사위원의 점수 입력은 권한 검증 필요
- 점수 수정/삭제는 감시 로깅 적용
- 최종 결과 발표 전까지 순위 정보 보호
- API 요청 인증/인가 구현 필수

## 성능 최적화

- 점수 계산 결과 캐싱 (변경 시 무효화)
- 팀 목록 및 순위 조회 최적화
- 대량 점수 입력 시 배치 처리 고려

## 배포

프로젝트가 성장하면서 다음을 준비하세요:
- Docker 컨테이너화
- CI/CD 파이프라인 (GitHub Actions 등)
- 환경 변수 관리 (.env 파일)
- 데이터베이스 백업 전략
