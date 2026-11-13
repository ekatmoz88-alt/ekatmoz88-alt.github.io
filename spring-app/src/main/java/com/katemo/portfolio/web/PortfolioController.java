package com.katemo.portfolio.web;

import com.katemo.portfolio.project.Project;
import com.katemo.portfolio.project.ProjectCatalog;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Controller
public class PortfolioController {
    private static final List<DomainFilter> DOMAINS = List.of(
            new DomainFilter("api", "API & Integrations"),
            new DomainFilter("enterprise", "Enterprise & SCADA Architecture"),
            new DomainFilter("hardware", "Hardware & Embedded Specs"),
            new DomainFilter("tooling", "Docs-as-Code & Tooling")
    );

    private final ProjectCatalog catalog;

    public PortfolioController(ProjectCatalog catalog) {
        this.catalog = catalog;
    }

    @GetMapping("/")
    public String index(@RequestParam(required = false) String domain,
                        @RequestParam(required = false) String q,
                        Model model) {
        List<Project> visibleProjects = catalog.search(domain, q);
        model.addAttribute("projects", visibleProjects);
        model.addAttribute("totalProjects", catalog.all().size());
        model.addAttribute("visibleCount", visibleProjects.size());
        model.addAttribute("domains", DOMAINS);
        model.addAttribute("activeDomain", domain == null ? "" : domain);
        model.addAttribute("query", q == null ? "" : q);
        return "index";
    }

    @GetMapping("/projects/{id}")
    public String project(@PathVariable String id, Model model) {
        Project project = catalog.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));
        model.addAttribute("project", project);
        return "global11-demo-data-platform".equals(id) ? "projects/global11" : "projects/detail";
    }

    public record DomainFilter(String slug, String label) {
    }
}
