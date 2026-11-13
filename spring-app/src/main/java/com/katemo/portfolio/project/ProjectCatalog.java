package com.katemo.portfolio.project;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;
import java.util.Optional;

@Service
public class ProjectCatalog {
    private final List<Project> projects = List.of(
            project("api-docs-portfolio-v2", "API Documentation Portfolio V2", "api", "API & Integrations",
                    "OpenAPI 3.0 / SOAP / WSDL",
                    "Bilingual EN/RU developer portal covering REST API specifications, legacy SOAP/WSDL contracts and error-handling scenarios.",
                    "OpenAPI", "SOAP", "WSDL", "EN/RU",
                    "https://ekatmoz88-alt.github.io/api-docs-portfolio-v2/"),
            project("orders-api-mcp", "Orders API MCP", "api", "API & Integrations",
                    "TypeScript / Model Context Protocol",
                    "MCP connector for integrating AI agents with the Supabase Orders API.",
                    "TypeScript", "MCP", "Supabase", "API"),
            project("technical-writing-portfolio", "Technical Writing Portfolio", "api", "API & Integrations",
                    "OpenAPI 3.1 / Webhooks",
                    "API reference, webhook architecture, authentication and integration guidance in a developer-focused documentation workstream.",
                    "OpenAPI 3.1", "Webhooks", "Authentication", "EN/RU"),
            project("territory-descriptor-unified", "Territory — System Documentation", "enterprise", "Enterprise & SCADA Architecture",
                    "System Architecture / Database / API",
                    "Consolidated technical documentation for the Territory software system: module architecture, database structures, integration protocols and data exchange.",
                    "Architecture", "SQL", "Data Model", "Integration", "Mermaid",
                    "https://ekatmoz88-alt.github.io/territory-descriptor-unified/"),
            project("global11-demo-data-platform", "Global11 Demo Data Platform", "enterprise", "Enterprise & SCADA Architecture",
                    "Oracle / SQLite / Data Dictionary",
                    "Oracle data-model documentation, SQLite access layer, data dictionary and the Cube_1111 Oracle OLAP metadata case study.",
                    "Oracle", "SQL", "Oracle OLAP", "Cube_1111", "Data Dictionary"),
            project("fintech-docs-demo", "Fintech Documentation Demo", "enterprise", "Enterprise & SCADA Architecture",
                    "Security Specifications / Threat Matrix",
                    "Security and UX specifications for a crypto-processing console, including PII classification, data-leakage controls, RFID threat analysis and L1/L2 flows.",
                    "Security", "PII", "Threat Modeling", "UX", "RFID"),
            project("deshifrator-docs", "Deshifrator Software Documentation", "enterprise", "Enterprise & SCADA Architecture",
                    "Software Documentation / VitePress",
                    "Technical and operational documentation for the Deshifrator software suite.",
                    "VitePress", "Software Docs", "Operations", "Architecture"),
            project("viwi-vsm-architecture", "ViWi VSM Architecture", "enterprise", "Enterprise & SCADA Architecture",
                    "Automotive / Infotainment Systems",
                    "Architecture description and service specifications for an in-vehicle infotainment system (Volkswagen Infotainment Web Interface).",
                    "Automotive", "Service Architecture", "API", "System Design"),
            project("adp201p4-hardware-spec", "ADP201P4 Hardware Specification", "hardware", "Hardware & Embedded Specs",
                    "DSP Clustering / Memory Map",
                    "System architecture of the ADP201P4 hardware module: DSP clustering, memory map and interface specifications.",
                    "DSP", "Memory Map", "Hardware", "Interfaces"),
            project("icao-mrtd-documentation", "ICAO MRTD Documentation", "hardware", "Hardware & Embedded Specs",
                    "ISO/IEC / ICAO 9303",
                    "Technical specification of machine-readable travel documents, cryptographic protection and data structures.",
                    "ICAO 9303", "ISO/IEC", "Cryptography", "Data Structures"),
            project("ss-tmk-specification", "SS-TMK Specification", "hardware", "Hardware & Embedded Specs",
                    "Engineering Specification / ESKD",
                    "Engineering and operational documentation for the SS-TMK system.",
                    "ESKD", "Engineering", "Technical Specification", "Operations"),
            project("interference-coatings-analysis-synthesis", "Interference Coatings Analysis & Synthesis", "hardware", "Hardware & Embedded Specs",
                    "Optical Engineering / Mathematical Model",
                    "Engineering documentation for calculation, analysis and synthesis of multilayer interference coatings.",
                    "Optical Engineering", "Mathematical Model", "Analysis", "Synthesis"),
            project("technical-writing-workflows", "Technical Writing Workflows", "tooling", "Docs-as-Code & Tooling",
                    "CI/CD / GitHub Actions / Linters",
                    "Docs-as-Code pipelines for automated documentation validation, Vale/Spectral linting and GitHub Actions publishing workflows.",
                    "CI/CD", "GitHub Actions", "Vale", "Spectral", "Docs-as-Code"),
            project("autocad-coordinate-exporter", "AutoCAD Coordinate Exporter", "tooling", "Docs-as-Code & Tooling",
                    "AutoLISP / CAD Automation",
                    "AutoLISP utility that exports text labels and WCS coordinates from AutoCAD drawings to CSV.",
                    "AutoLISP", "AutoCAD", "WCS", "CSV")
    );

    public List<Project> all() {
        return projects;
    }

    public List<Project> search(String domain, String query) {
        String normalizedDomain = normalize(domain);
        String normalizedQuery = normalize(query);
        return projects.stream()
                .filter(project -> normalizedDomain.isBlank() || project.domain().equals(normalizedDomain))
                .filter(project -> normalizedQuery.isBlank()
                        || normalize(project.name() + " " + project.description() + " "
                        + project.container() + " " + String.join(" ", project.tags())).contains(normalizedQuery))
                .toList();
    }

    public Optional<Project> findById(String id) {
        return projects.stream().filter(project -> project.id().equals(id)).findFirst();
    }

    private static Project project(String id, String name, String domain, String domainLabel,
                                   String container, String description, String... metadata) {
        List<String> values = List.of(metadata);
        String demo = null;
        if (!values.isEmpty() && values.get(values.size() - 1).startsWith("https://")) {
            demo = values.get(values.size() - 1);
            values = values.subList(0, values.size() - 1);
        }
        String evidence = id.equals("icao-mrtd-documentation")
                ? "Repository is listed in the portfolio source set; detailed artefact status is not asserted here."
                : "";
        return new Project(id, name, "https://github.com/ekatmoz88-alt/" + id, domain,
                domainLabel, container, description, values, demo, evidence);
    }

    private static String normalize(String value) {
        return value == null ? "" : value.toLowerCase(Locale.ROOT).trim();
    }
}
