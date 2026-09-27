# 🏆 Hackathon Scores

해커톤 참가 팀의 실시간 채점 및 점수 관리 시스템입니다.

## 🌐 배포 URL

- **백엔드 API**: https://hackathon-scores-backend.onrender.com
- **프론트엔드**: https://hackathon-scores-frontend.onrender.com

## 📋 주요 기능

- **교사 콘솔**: 팀 정보 관리, 채점 진행 상황 모니터링, 순위 공개 제어
- **학생 채점**: 실시간 점수 입력 (기획우수성, 구현우수성, 실현가능성, 발표능력, 팀워크)
- **결과 화면**: 대형 스크린용 실시간 순위 및 최종 결과 표시
- **최종 결과**: 팀별 순위, 총점, 기준별 세부 점수 조회

## 🚀 로컬 실행 (개발)

### 백엔드 실행

```bash
cd backend
npm install
npm run dev          # 포트 3000
```

### 프론트엔드 실행

```bash
cd frontend
npm install
npm run dev          # 포트 5173
```

브라우저에서 `http://localhost:5173` 접속

## 📚 문서

- [백엔드 설정](./backend/README.md)
- [프론트엔드 설정](./frontend/README.md)
- [전체 설정 가이드](./SETUP_GUIDE.md)

## 🛠 기술 스택

- **백엔드**: Node.js + Express + Socket.io + SQLite
- **프론트엔드**: React + Vite + React Router + Tailwind CSS
- **배포**: Render (무료 티어)

## 📝 라이선스

ISC
