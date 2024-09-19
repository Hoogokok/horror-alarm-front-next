# Spooky Town

Spooky Town은 모든 공포 콘텐츠를 소개하는 종합 애플리케이션입니다. 영화, 책, 게임 등 다양한 공포 미디어를 탐험하고 공유할 수 있는 플랫폼입니다.

## 기술 스택

- Frontend Framework: Next.js 15 (RC 버전)
- React: 19.0.0 (RC 버전)
- 상태 관리: React Query (Tanstack Query)
- 데이터베이스: Supabase
- 타입 체킹: TypeScript
- 폼 검증: Zod
- 개발 도구:
  - Storybook: UI 컴포넌트 개발 및 테스트
  - Vitest: 단위 테스트
  - ESLint: 코드 품질 관리
- 유틸리티:
  - use-debounce: 디바운스 기능 구현

## 주요 기능

- 다양한 공포 콘텐츠 카테고리 (영화, TV 시리즈, 책, 게임 등)
- 사용자 리뷰 및 평점 시스템

## API 요구사항

이 프로젝트는 다음과 같은 API를 사용합니다:

1. Supabase API: 사용자 인증 및 데이터베이스 관리를 위해 사용됩니다.

2. 영화 정보 API: 공포 영화 데이터를 가져오기 위해 사용됩니다. 이 API는 [horror-alarm-backend-ts](https://github.com/Hoogokok/horror-alarm-backend-ts) 프로젝트에서 구현되었으며, 다음과 같은 엔드포인트를 제공합니다:

   - GET `/api/releasing`: 상영 중인 영화 정보
   - GET `/api/upcoming`: 상영 예정 영화 정보
   - GET `/api/streaming/expired`: 스트리밍 종료 예정 영화 정보
   - GET `/api/streaming/expired/detail/{id}`: 스트리밍 종료 예정 영화 상세 정보
   - GET `/api/streaming`: 스트리밍 서비스의 총 페이지 수
   - GET `/api/streaming/page`: 스트리밍 서비스의 특정 페이지 영화 정보
   - GET `/api/movie/{id}`: 영화의 상세 정보

   이 API는 영화 제목, 개봉일, 포스터 이미지, 줄거리, 평점, 리뷰 등의 정보를 제공합니다.

## 환경 설정

1. `.env.local` 파일을 생성하고 다음 환경 변수를 설정하세요:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

2. 필요한 패키지를 설치하세요:

```bash
pnpm install
```

## 테스트

테스트 실행:

```bash
pnpm test
```

## 배포

이 프로젝트는 Vercel Platform을 통해 쉽게 배포할 수 있습니다. 자세한 내용은 [Next.js 배포 문서](https://nextjs.org/docs/deployment)를 참조하세요.

## 기여하기

프로젝트에 기여하고 싶으시다면 pull request를 보내주세요. 모든 기여를 환영합니다!

## 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다.
