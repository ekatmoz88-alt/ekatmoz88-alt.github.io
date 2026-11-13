# Technical Writing Portfolio Website Hub

[English](README.md) | [Русский](README.ru.md)

This repository contains the source for the public GitHub Pages portfolio website. It is the website hub, not the React/Vite GitHub profile dashboard and not an API specification repository.

## Published site

- [Portfolio website](https://ekatmoz88-alt.github.io/)
- [English portfolio](https://ekatmoz88-alt.github.io/portfolio-en.html)
- [Russian portfolio](https://ekatmoz88-alt.github.io/portfolio-ru.html)
- [Interactive GitHub dashboard](https://github-profile-dashboard-vite.vercel.app/)
- [Bilingual repository audit](https://github-profile-dashboard-vite.vercel.app/portfolio-audit.html)

## Repository contents

- `portfolio-en.md` and `portfolio-ru.md` — bilingual portfolio content.
- `projects/` — project-specific pages and supporting material.
- `src/`, `index.html`, `vite.config.js` — website source and build configuration.
- `filmmgr-schema.md`, `mib3-navigation-api.md` — technical portfolio artifacts.

## Scope

The website presents selected technical-writing work and links to independent repositories. It is not a source-of-truth for project architecture; each project repository owns its technical content.

## Tags

`portfolio-hub` · `technical-writing` · `developer-documentation` · `api-documentation` · `github-pages` · `en-ru`

## Java 21 server-rendered portfolio

A standalone Spring Boot + Thymeleaf application is being developed in `spring-app/`. It includes the C4-style portfolio landing page, curated project catalogue, project detail routes and the Global11_demo / Cube_1111 case study.

- Stack: Java 21, Spring Boot 4.1.2, Spring MVC, Thymeleaf, Maven.
- Local run: `cd spring-app && mvn spring-boot:run`.
- Tests/build: `cd spring-app && mvn clean verify`.
- Server deployment blueprint: `render.yaml` (Docker-based Render web service).
- The current GitHub Pages/Vite site is kept independent until the Java application is validated and a production cutover is approved.
