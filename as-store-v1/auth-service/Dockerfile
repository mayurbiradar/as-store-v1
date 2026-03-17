# auth-service/Dockerfile
# -------------------------------------------------------------
FROM eclipse-temurin:21-jdk AS builder
WORKDIR /app

# Build dependencies first (Maven wrapper)
COPY .mvn/ .mvn
COPY pom.xml .
COPY mvnw .
RUN ./mvnw -B dependency:go-offline

# Copy source & compile
COPY src ./src
RUN ./mvnw -B package -DskipTests

# Runtime
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java","-jar","app.jar"]
