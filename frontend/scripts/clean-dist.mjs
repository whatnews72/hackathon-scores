// 빌드 전에 dist 폴더를 미리 삭제한다 (npm의 prebuild 훅으로 자동 실행)
//
// 우회 이유:
// Windows + Node 24에서 경로에 한글 등 비ASCII 문자가 있으면 fs.rmSync가
// 프로세스를 강제 종료시킨다(0xC0000409). Vite는 빌드 시 기존 dist를
// fs.rmSync로 비우기 때문에, dist가 이미 있으면 빌드가 크래시한다.
// 비동기 fs.promises.rm은 같은 경로에서도 정상 동작하므로 이것으로 먼저 지운다.
// 참고: https://github.com/nodejs/node/issues/61067
import { rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const distDir = fileURLToPath(new URL('../dist', import.meta.url));

await rm(distDir, { recursive: true, force: true });
