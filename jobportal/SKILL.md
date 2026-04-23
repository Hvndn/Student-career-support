# SKILL: MockMvc Testing with Spring Security & JPA Auditing

## Overview
This skill documents patterns and solutions for achieving 100% test coverage in the Controller layer of a Spring Boot application, specifically addressing context loading, security mocking, and common runtime errors.

## Key Challenges & Solutions

### 1. JPA Auditing Conflicts
**Issue**: `@EnableJpaAuditing` in the main application class causes `BeanCreationException` (JPA metamodel must not be empty) during `@WebMvcTest` because the full JPA context is not loaded.
**Solution**: Move `@EnableJpaAuditing` to a separate configuration class.
```java
@Configuration
@EnableJpaAuditing
public class JpaConfig { }
```

### 2. MockMvc Security Isolation
**Issue**: Security filters and custom filters (like `JwtAuthenticationFilter`) cause 401/403 errors or context loading failures if dependencies are not mocked.
**Solution**:
- Use `@AutoConfigureMockMvc(addFilters = false)` to simplify testing.
- Mock all security beans: `JwtTokenProvider`, `UserDetailsService`, `CustomOAuth2UserService`, `JwtAuthenticationFilter`.
- Manually provide the `Principal` using `.principal()` to ensure `authentication.getName()` does not throw NPE.

```java
mockMvc.perform(get("/api/endpoint")
    .principal(new UsernamePasswordAuthenticationToken("user@test.com", null, 
        AuthorityUtils.createAuthorityList("ROLE_STUDENT"))))
```

### 3. Avoiding 500 Internal Server Error (NPE in Map.of)
**Issue**: `Map.of()` and `Map.ofEntries()` in Java do NOT allow `null` values. If a controller uses them to package a response, and a mocked entity field (e.g., `user.getFullName()`) is null, a 500 error occurs.
**Solution**: Always initialize mandatory fields in mock entities.
```java
User user = new User();
user.setEmail("test@email.com");
user.setFullName("Default Name"); // Crucial for Map.of()
```

### 4. LazyInitializationException in Serialization
**Issue**: Serializing JPA entities in `@WebMvcTest` can fail if lazy-loaded relations are accessed by Jackson.
**Solution**: Ensure all lazily fetched relations are either `@JsonIgnore`-ed or properly initialized in the test mock.

## Best Practices for Controller Tests
1. **Mock All Services**: Use `@MockBean` for every service called by the controller.
2. **Stub with and without data**: Test both `Optional.of(data)` and `Optional.empty()` scenarios.
3. **Verify Service Calls**: Use `verify(service).method(...)` to ensure business logic is triggered.
4. **Valid DTOs**: Use a real `ObjectMapper` to serialize request bodies.
