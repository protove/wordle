# Security Architecture & Decision Records

Cosmic Wordle 프로젝트의 보안 아키텍처 결정 근거와 향후 확장 방안을 문서화합니다.

---

## 1. JWT 전략: HMAC-SHA256 단일 방식 선택

### 결정
RSA 기반 OAuth2 Authorization Server를 제거하고, **HMAC-SHA256(HS256) 단일 JWT 방식**을 채택했습니다.

### 근거

| 관점 | RSA + Authorization Server | HMAC-SHA256 (현재) |
|------|---------------------------|-------------------|
| 클라이언트 구조 | 멀티 클라이언트, 써드파티 연동 | **단일 클라이언트 (Next.js SPA)** |
| 토큰 발급/검증 | 발급: 개인키, 검증: 공개키 (분리) | 발급/검증 모두 동일 비밀키 |
| 운영 오버헤드 | 키 로테이션, 키스토어 관리, AS 인프라 | 환경변수 1개 (`JWT_SECRET`) |
| 서비스 규모 | 마이크로서비스, 대규모 | **모놀리식, 소규모 게임 서비스** |
| 성능 | RSA 서명 느림 (~1ms) | HMAC 서명 빠름 (~0.01ms) |

Wordle은 단일 백엔드 + 단일 프론트엔드 구조이므로, JWT 발급과 검증이 같은 서버에서 이루어집니다. RSA의 공개키/개인키 분리가 제공하는 이점(검증 서버 분리)이 필요하지 않으며, Authorization Server 운영에 따른 복잡도만 증가시킵니다.

---

## 2. 각 보안 결정의 근거

### 2.1 BCrypt 패스워드 해싱

**선택:** `BCryptPasswordEncoder` (Spring Security 기본)

- Work factor 기본값 10 (약 100ms/해시) — 브루트포스 공격에 충분한 저항성
- 솔트 자동 생성으로 레인보우 테이블 공격 무효화
- OWASP 권장 알고리즘 중 하나

### 2.2 Rate Limiting 전략

**선택:** `ConcurrentHashMap` + 슬라이딩 윈도우 방식 (인메모리)

- **적용 경로:** `/api/auth/*` (로그인/회원가입)
- **제한:** IP당 분당 20회
- **구현:** 외부 의존성 없이 JVM 내장 자료구조 활용
- **한계:** 단일 인스턴스 기준. 수평 확장 시 Redis 기반 솔루션(Bucket4j + Redis)으로 전환 필요

### 2.3 CORS 정책

**선택:** 환경변수 기반 Origin 제한 (`CorsConfig.kt`)

- 개발: `http://localhost:3000`, `http://127.0.0.1:3000`
- 프로덕션: `.env.prod`에서 실제 도메인으로 제한
- `allowedOriginPatterns = listOf("*")` 와일드카드 패턴 제거 — Credential 포함 요청에서 보안 위험

### 2.4 HTTPS

**선택:** 인프라 레벨 처리 (ALB, nginx 등 리버스 프록시)

애플리케이션 레벨에서 `requiresSecure()` 같은 HTTPS 강제는 하지 않습니다. 이유:
- TLS 인증서 관리는 인프라 계층의 책임
- 컨테이너 간 통신(Docker network)은 이미 격리됨
- ALB/nginx에서 HTTPS → HTTP 오프로딩이 표준적

### 2.5 Security Filter Chain 구조

```
@Order(2) ApiSecurityFilterChain     → /api/** (HMAC JWT 인증)
@Order(3) ResourceServerFilterChain  → /stats/**, /actuator/health (HMAC JWT 인증)
@Order(4) DefaultSecurityFilterChain → 나머지 (폼 로그인)
```

모든 JWT 보호 filter chain에 `@Qualifier("hmacJwtDecoder")`를 명시적으로 주입하여, 디코더 의도를 코드 레벨에서 명확히 합니다.

---

## 3. 향후 확장 포인트

### 멀티 클라이언트 / 써드파티 연동이 필요해질 때

다음 조건 중 하나라도 해당되면 **RSA + OAuth2 Authorization Server** 전환을 검토합니다:

1. **써드파티 앱**이 Wordle API에 접근해야 하는 경우 (공개키 기반 검증 필요)
2. **마이크로서비스 분리** — 토큰 발급 서버와 검증 서버가 물리적으로 나뉠 때
3. **SSO(Single Sign-On)** — 여러 서비스에서 동일 인증 체계를 공유할 때

### 전환 방법

1. `spring-boot-starter-oauth2-authorization-server` 의존성 재추가
2. RSA 키페어 생성 및 키스토어 설정
3. `AuthorizationServerConfig` 구성 (PKCE, 클라이언트 등록)
4. Resource Server filter chain의 JwtDecoder를 RSA 공개키 기반으로 전환
5. 기존 HMAC JWT와의 하위 호환을 위한 마이그레이션 기간 설정

### Rate Limiting 수평 확장

단일 인스턴스를 넘어서면:
1. Bucket4j + Redis proxy 조합으로 분산 Rate Limiting
2. API Gateway(Kong, AWS API Gateway) 레벨에서 처리

---

## 변경 이력

| 날짜 | 변경 내용 |
|------|----------|
| 2026-03-17 | RSA dead code 제거, HMAC 단일 방식 확정 |
| 2026-03-17 | Rate Limiting 구현 (IP별 분당 20회) |
| 2026-03-17 | CORS 와일드카드 제거, env 기반 통일 |
| 2026-03-17 | JWT secret fallback 제거, 환경변수 필수화 |
