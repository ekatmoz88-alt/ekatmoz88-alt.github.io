# Kate Mo — Enterprise Technical Documentation Portfolio

Server-rendered portfolio application built with Java 21, Spring Boot 4.1.2 and Thymeleaf.

## Requirements

- JDK 21
- Maven 3.6.3+
- Docker (optional)

## Run locally

```bash
cd spring-app
mvn spring-boot:run
```

Open http://localhost:8080.

## Build and test

```bash
mvn clean verify
```

## Run the packaged application

```bash
mvn package
java -jar target/enterprise-documentation-portfolio-1.0.0-SNAPSHOT.jar
```

## Docker

From the repository root:

```bash
docker build -t kate-mo-portfolio -f spring-app/Dockerfile spring-app
docker run --rm -p 8080:8080 kate-mo-portfolio
```

## Deployment

The repository-level `render.yaml` describes a Docker-based Render web service with `spring-app` as its root directory. Connect the repository to Render and create a Blueprint from that file. The service uses the platform-provided `PORT` environment variable and exposes the Actuator health endpoint at `/actuator/health`.

The existing GitHub Pages/Vite site remains unchanged while the Spring Boot version is developed and validated. Production cutover and custom-domain configuration are separate deployment decisions.

## Architecture

- `web`: Spring MVC controllers and request handling.
- `project`: immutable project model and in-memory catalogue.
- `templates`: Thymeleaf server-rendered pages.
- `static/css`: responsive engineering-style visual system.
- `projects/global11.html`: detailed Oracle OLAP Cube_1111 case study.

The first release intentionally has no database, login, admin UI or write operations. Portfolio metadata is curated in code and can later be moved to a database or YAML-backed repository.
