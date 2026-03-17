# 🟩 Cosmic Wordle

> **5글자 영단어 추리 게임** — Spring Boot 3.3 + Next.js 14 풀스택 프로젝트

[![Kotlin](https://img.shields.io/badge/Kotlin-2.0-7F52FF?logo=kotlin&logoColor=white)](https://kotlinlang.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3-6DB33F?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)](https://docs.docker.com/compose/)

---

## 📌 프로젝트 개요

Cosmic Wordle은 NYT Wordle에서 영감을 받은 풀스택 웹 게임입니다.  
매일 새로운 단어가 출제되며, 6번의 기회 안에 5글자 영단어를 맞추는 것이 목표입니다.

**팀 협업** 환경에서 백엔드 보안 아키텍처 설계, API 개발, 인프라 구성을 담당했습니다.

### 주요 기능
- 🎮 **일일 Wordle 게임** — 매일 자정에 새로운 단어 출제
- 🔐 **JWT 기반 인증/인가** — 회원가입, 로그인, 토큰 갱신
- 📊 **플레이어 통계** — 승률, 연승 기록, 추측 분포 차트
- 🛡️ **Rate Limiting** — IP 기반 인증 엔드포인트 보호
- 🐳 **Docker Compose** — 원커맨드 개발 환경 구성

---

## 🏗️ 아키텍처

```
┌─────────────┐       ┌──────────────────────────────────────────┐
│  Next.js 14 │──────▶│          Spring Boot 3.3 Backend         │
│  (SPA)      │ REST  │                                          │
│  Port 3000  │◀──────│  ┌─────────┐  ┌──────┐  ┌────────────┐  │
└─────────────┘       │  │Auth API │  │Game  │  │Stats API   │  │
                      │  │/api/auth│  │/api/ │  │/api/stats  │  │
                      │  │         │  │games │  │            │  │
                      │  └────┬────┘  └──┬───┘  └─────┬──────┘  │
                      │       │          │            │          │
                      │  ┌────▼──────────▼────────────▼──────┐  │
                      │  │     Spring Security Filter Chain   │  │
                      │  │  @Order(2) /api/** → JWT 인증     │  │
                      │  │  @Order(3) /stats/** → JWT 인증   │  │
                      │  │  @Order(4) 기타 → 폼 로그인       │  │
                      │  └───────────────┬───────────────────┘  │
                      │                  │                       │
                      │         ┌────────▼────────┐             │
                      │         │  PostgreSQL 15   │             │
                      │         │  (AWS RDS)       │             │
                      │         └─────────────────┘             │
                      └──────────────────────────────────────────┘
```

### 기술 스택

| 계층 | 기술 | 비고 |
|------|------|------|
| **Frontend** | Next.js 14, React 18, TailwindCSS, SWR | TypeScript |
| **Backend** | Kotlin 2.0, Spring Boot 3.3, Spring Security | Gradle Kotlin DSL |
| **인증** | HMAC-SHA256 JWT (Nimbus JOSE) | OAuth2 Resource Server |
| **DB** | PostgreSQL 15 (AWS RDS), Flyway | JPA / Hibernate |
| **인프라** | Docker Compose, AWS (RDS, ALB) | 환경별 분리 (dev/test/prod) |
| **코드 품질** | ktlint, Ehcache | 자동 포맷 + 캐싱 |

---

## 📁 프로젝트 구조

```
wordle/
├── backend/
│   ├── src/main/kotlin/com/example/wordle/
│   │   ├── auth/           # 인증/인가 (User, AuthService, JWT)
│   │   ├── game/           # 게임 로직 (Game, WordEvaluator, 추측 판정)
│   │   ├── stats/          # 통계 (승률, 연승, 추측 분포)
│   │   ├── word/           # 단어 관리 (오늘의 단어, 유효성 검증)
│   │   ├── security/       # Spring Security (JWT, CORS, RateLimit)
│   │   └── common/         # 공통 예외 처리
│   ├── src/main/resources/
│   │   ├── application-{dev,test,prod}.yml
│   │   ├── db/migration/   # Flyway V001~V006
│   │   └── words.txt       # 단어 사전
│   └── build.gradle.kts
├── frontend/
│   ├── src/
│   │   ├── app/            # Next.js App Router
│   │   ├── components/     # GameBoard, Keyboard, Tile 등
│   │   ├── hooks/          # useWordle, useAuth
│   │   └── lib/            # API 클라이언트, 게임 로직
│   └── package.json
├── docker-compose.yml
└── docs/
    └── SECURITY-IMPROVEMENTS.md
```

---

## 🔐 보안 아키텍처 & 트러블슈팅

이 프로젝트에서 가장 중점을 둔 부분은 **보안 아키텍처의 설계와 리팩터링**입니다.  
실제 운영 환경을 고려한 보안 결정과, 그 과정에서 발생한 트러블슈팅을 정리합니다.

---

### 🔧 트러블슈팅 1: RSA → HMAC-SHA256 JWT 전환

#### 문제 상황
초기에 `spring-boot-starter-oauth2-authorization-server`를 도입하여 RSA 기반 JWT를 구성했습니다.  
하지만 단일 백엔드 + 단일 프론트엔드 구조에서 RSA의 이점(공개키/개인키 분리)이 전혀 활용되지 않았고,  
키스토어 관리 · Authorization Server 설정 등 불필요한 복잡도만 가중되었습니다.

#### 해결 과정
1. **의존성 제거** — `spring-boot-starter-oauth2-authorization-server` 삭제
2. **Dead code 제거** — `AuthorizationServerConfig`, `OAuth2ServiceConfig`, `OAuth2Tables` 등 6개 파일 삭제
3. **Flyway 마이그레이션** — `V006__drop_oauth2_tables.sql`로 미사용 OAuth2 테이블 Drop
4. **키스토어 인프라 제거** — `entrypoint.sh`의 keytool 로직, docker-compose 환경변수 정리
5. **HMAC 단일 방식 채택** — `JwtConfig.kt`에서 `hmacJwtEncoder()`/`hmacJwtDecoder()` Bean만 유지

#### 핵심 코드
```kotlin
// JwtConfig.kt — HMAC-SHA256 단일 JWT 인코더/디코더
@Configuration
class JwtConfig(
    @Value("\${app.jwt.secret}") private val jwtSecret: String,
) {
    @Bean
    @Qualifier("hmacJwtEncoder")
    fun hmacJwtEncoder(): JwtEncoder {
        val key = OctetSequenceKey.Builder(jwtSecret.toByteArray(Charsets.UTF_8))
            .algorithm(JWSAlgorithm.HS256)
            .build()
        return NimbusJwtEncoder(ImmutableJWKSet(JWKSet(key)))
    }

    @Bean
    @Qualifier("hmacJwtDecoder")
    fun hmacJwtDecoder(): JwtDecoder {
        val secretKey = SecretKeySpec(jwtSecret.toByteArray(Charsets.UTF_8), "HmacSHA256")
        return NimbusJwtDecoder.withSecretKey(secretKey)
            .macAlgorithm(MacAlgorithm.HS256)
            .build()
    }
}
```

#### 결정 근거

| 관점 | RSA + Authorization Server | HMAC-SHA256 (채택) |
|------|---------------------------|-------------------|
| 클라이언트 구조 | 멀티 클라이언트, 써드파티 | **단일 클라이언트 (SPA)** |
| 운영 오버헤드 | 키스토어 관리, AS 인프라 | 환경변수 1개 (`JWT_SECRET`) |
| 성능 | RSA 서명 ~1ms | HMAC 서명 ~0.01ms |
| 서비스 규모 | 마이크로서비스 | **모놀리식 소규모** |

---

### 🔧 트러블슈팅 2: JwtDecoder Bean 충돌 (`@Qualifier` 누락)

#### 문제 상황
Spring Security의 `@Order(3)` filter chain에서 `JwtDecoder`가 주입될 때,  
`@Qualifier`가 누락되어 **어떤 디코더가 주입되는지 보장할 수 없는 상태**였습니다.  
Spring Boot 자동 설정이 만드는 기본 `JwtDecoder`와 충돌할 위험이 존재했습니다.

#### 해결
```kotlin
// Before — @Qualifier 누락, 어떤 디코더가 주입될지 비결정적
@Order(3)
fun resourceServerSecurityFilterChain(
    http: HttpSecurity,
    jwtDecoder: JwtDecoder,  // ❌ 어떤 JwtDecoder?
)

// After — 명시적 @Qualifier로 의도를 코드에 기록
@Order(3)
fun resourceServerSecurityFilterChain(
    http: HttpSecurity,
    @Qualifier("hmacJwtDecoder") hmacJwtDecoder: JwtDecoder,  // ✅ HMAC 전용
)
```

#### 교훈
> 동일 타입의 Bean이 여러 개 존재할 가능성이 있으면, **항상 `@Qualifier`를 명시**해야 합니다.  
> 현재는 동작하더라도, 의존성 추가나 자동 설정 변경으로 언제든 깨질 수 있습니다.

---

### 🔧 트러블슈팅 3: CORS 설정 중복 정리

#### 문제 상황
`CorsConfig.kt`에서 전역 `CorsConfigurationSource` Bean을 이미 정의하고 있었지만,  
`JwtSecurityConfig.kt`에도 **동일한 CORS 설정을 인라인으로 중복 정의**하고 있었습니다.  
설정 변경 시 두 곳을 모두 수정해야 하는 유지보수 문제가 발생했습니다.

#### 해결
- `JwtSecurityConfig`의 인라인 `corsConfigurationSource()` 메서드 삭제
- 생성자 주입으로 `CorsConfigurationSource` Bean을 받아 모든 filter chain에서 공유

```kotlin
@Configuration
class JwtSecurityConfig(
    private val corsConfigurationSource: CorsConfigurationSource,  // ← 생성자 주입
) {
    @Bean @Order(2)
    fun apiSecurityFilterChain(http: HttpSecurity, ...): SecurityFilterChain {
        return http
            .cors { it.configurationSource(corsConfigurationSource) }  // ← 공유
            // ...
    }
}
```

---

### 🔧 트러블슈팅 4: Rate Limiting 구현

#### 문제 상황
인증 엔드포인트(`/api/auth/login`, `/api/auth/signup`)에 **요청 제한이 없어**  
브루트포스 공격이나 계정 생성 남용에 취약했습니다.

#### 해결
Spring Security filter chain **외부**에 `OncePerRequestFilter`를 등록하여,  
Spring Security 처리 전에 IP 기반으로 요청을 차단합니다.

```kotlin
// RateLimitingFilter.kt — ConcurrentHashMap 기반 슬라이딩 윈도우
class RateLimitingFilter(
    private val maxRequests: Int = 20,      // IP당 최대 요청 수
    private val windowMs: Long = 60_000L,   // 윈도우 크기 (1분)
) : OncePerRequestFilter() {
    private val requestLog = ConcurrentHashMap<String, CopyOnWriteArrayList<Long>>()

    override fun doFilterInternal(request, response, filterChain) {
        val clientIp = resolveClientIp(request)  // X-Forwarded-For 지원
        val timestamps = requestLog.computeIfAbsent(clientIp) { CopyOnWriteArrayList() }
        timestamps.removeIf { it < System.currentTimeMillis() - windowMs }

        if (timestamps.size >= maxRequests) {
            response.status = 429  // Too Many Requests
            return
        }
        timestamps.add(System.currentTimeMillis())
        filterChain.doFilter(request, response)
    }
}
```

**설계 결정:**
- 외부 의존성(Redis, Bucket4j) 없이 JVM 내장 자료구조만 사용
- 수평 확장 시 Redis 기반으로 전환 가능 (현재 단일 인스턴스 전제)

---

### 🔧 트러블슈팅 5: JWT Secret Fallback 값 제거

#### 문제 상황
`application-dev.yml`과 `docker-compose.yml`에 JWT 시크릿 **하드코딩 fallback** 값이 존재했습니다:
```yaml
# Before — 프로덕션에서도 이 값이 사용될 위험
JWT_SECRET: ${JWT_SECRET:-my-super-secret-jwt-key-that-is-at-least-32-characters}
```

#### 해결
모든 환경의 fallback 값을 제거하고, 환경변수가 없으면 **앱이 시작되지 않도록** 강제합니다:
```yaml
# After — 환경변수 미설정 시 즉시 실패
JWT_SECRET: ${JWT_SECRET}
```

`.env.*.template` 파일에 안전한 시크릿 생성 가이드를 추가:
```bash
# 최소 32자 이상, 아래 명령으로 생성 가능:
# openssl rand -base64 48
JWT_SECRET=여기에_반드시_32자_이상의_시크릿을_설정하세요
```

---

### 🔧 트러블슈팅 6: User.kt JVM Platform Declaration Clash

#### 문제 상황
`User` 엔티티가 `UserDetails`를 구현하면서, 생성자 파라미터명 `username`, `password`, `enabled`가  
`UserDetails` 인터페이스의 `getUsername()`, `getPassword()`, `isEnabled()` 메서드와 **JVM 시그니처 충돌**을 일으켰습니다:

```
Platform declaration clash: The following declarations have the same JVM signature
  fun getUsername(): String  (UserDetails)
  val username: String       (User constructor)
```

#### 해결
생성자 파라미터명을 `_username`, `_password`, `_enabled`로 변경하고,  
`UserDetails` 인터페이스 메서드를 명시적으로 `override`합니다:

```kotlin
@Entity
class User(
    private val _username: String,
    private val _password: String,
    private val _enabled: Boolean = true,
) : UserDetails {
    override fun getUsername(): String = _username
    override fun getPassword(): String = _password
    override fun isEnabled(): Boolean = _enabled
}
```

#### 교훈
> Kotlin에서 `val username`은 자동으로 `getUsername()` getter를 생성합니다.  
> Java 인터페이스와 같은 시그니처의 getter가 이미 존재하면 **플랫폼 선언 충돌**이 발생합니다.  
> `private val _prefix` + 명시적 `override fun` 패턴으로 회피합니다.

---

## 🎮 핵심 게임 로직

### Word Evaluator (2-Pass 알고리즘)

Wordle의 핵심인 글자 판정 로직은 **2-Pass 방식**으로 구현했습니다:

```kotlin
object WordEvaluator {
    fun evaluate(guess: String, target: String): List<LetterResult> {
        val result = Array(5) { LetterResult.ABSENT }
        val targetRemaining = target.toCharArray()

        // Pass 1: 정확한 위치 (CORRECT)
        for (i in 0..4) {
            if (guess[i] == target[i]) {
                result[i] = LetterResult.CORRECT
                targetRemaining[i] = '\u0000'  // 사용된 글자 제거
            }
        }

        // Pass 2: 다른 위치에 존재 (PRESENT)
        for (i in 0..4) {
            if (result[i] == LetterResult.CORRECT) continue
            val idx = targetRemaining.indexOf(guess[i])
            if (idx != -1) {
                result[i] = LetterResult.PRESENT
                targetRemaining[idx] = '\u0000'
            }
        }

        return result.toList()
    }
}
```

**왜 2-Pass인가?**
- 1-Pass로 처리하면, 같은 글자가 중복될 때 `PRESENT`가 과다 표시됩니다
- Pass 1에서 `CORRECT`를 먼저 확정 → Pass 2에서 남은 글자만 `PRESENT` 판정

---

## 🚀 실행 방법

### 사전 요구사항
- Docker & Docker Compose
- (선택) JDK 21, Node.js 20

### Docker Compose로 실행

```bash
# 1. 환경변수 설정
cp .env.dev.template .env.dev

# 2. .env.dev 편집 (필수: JWT_SECRET, DB 정보)
vi .env.dev

# 3. 실행
docker compose --env-file .env.dev up --build
```

| 서비스 | URL |
|--------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8080 |
| Health Check | http://localhost:8080/actuator/health |

### 로컬 개발 (Gradle)

```bash
cd backend
export JWT_SECRET="$(openssl rand -base64 48)"
./gradlew bootRun --args='--spring.profiles.active=dev'
```

---

## 📊 API 엔드포인트

### 인증
| Method | Path | 설명 | 인증 |
|--------|------|------|------|
| POST | `/api/auth/signup` | 회원가입 | - |
| POST | `/api/auth/login` | 로그인 (JWT 발급) | - |

### 게임
| Method | Path | 설명 | 인증 |
|--------|------|------|------|
| POST | `/api/games` | 오늘의 게임 시작/조회 | JWT |
| POST | `/api/games/{id}/guesses` | 추측 제출 | JWT |
| GET | `/api/games/{id}` | 게임 상세 조회 | JWT |
| GET | `/api/games/history` | 게임 이력 조회 | JWT |

### 통계
| Method | Path | 설명 | 인증 |
|--------|------|------|------|
| GET | `/api/stats` | 플레이어 통계 조회 | JWT |
| POST | `/api/stats` | 게임 결과 기록 | JWT |

### 단어 관리
| Method | Path | 설명 | 인증 |
|--------|------|------|------|
| GET | `/api/words` | 오늘의 단어 조회 | JWT |
| POST | `/api/words` | 단어 추가 | ADMIN |
| DELETE | `/api/words/{id}` | 단어 삭제 | ADMIN |

---

## 🗄️ DB 마이그레이션 (Flyway)

| 버전 | 파일 | 내용 |
|------|------|------|
| V001 | `V001__auth_tables.sql` | users 테이블 생성 |
| V002 | `V002__create_player_stats.sql` | player_stats 테이블 생성 |
| V003 | `V003__create_words_table.sql` | words 테이블 생성 |
| V004 | `V004__create_games_tables.sql` | games, game_guesses 테이블 생성 |
| V005 | `V005__seed_words.sql` | 초기 단어 데이터 시드 |
| V006 | `V006__drop_oauth2_tables.sql` | 미사용 OAuth2 테이블 제거 |

---

## 🧪 테스트

```bash
cd backend
./gradlew test
```

- `StatsServiceTest` — 통계 서비스 단위 테스트
- `StatsControllerTest` — MockMvc 기반 통합 테스트 (H2 인메모리)

---

## 📝 환경별 설정

| 환경 | 프로파일 | DB | 특이사항 |
|------|---------|-----|---------|
| **dev** | `application-dev.yml` | AWS RDS (dev) | Flyway 자동 마이그레이션 |
| **test** | `application-test.yml` | H2 인메모리 | ddl-auto: create-drop |
| **prod** | `application-prod.yml` | AWS RDS (prod) | Flyway only, 로깅 최소화 |

---

## 👤 담당 역할

- **백엔드 보안 아키텍처** — JWT 전략 설계 (RSA → HMAC 전환), Security Filter Chain 구성
- **Rate Limiting** — 인메모리 슬라이딩 윈도우 방식 IP 기반 요청 제한
- **API 설계 및 구현** — Auth / Game / Stats / Word 전체 REST API
- **인프라 구성** — Docker Compose, 환경별 분리 (dev/test/prod), AWS RDS 연동
- **코드 품질** — ktlint 적용, 빈 파일 정리, wildcard import 제거

---

## 📄 라이선스

이 프로젝트는 학습 및 포트폴리오 목적으로 작성되었습니다.
