package com.katemo.portfolio.project;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class ProjectCatalogTest {
    private final ProjectCatalog catalog = new ProjectCatalog();

    @Test
    void exposesAllFourteenCuratedProjects() {
        assertThat(catalog.all()).hasSize(14);
    }

    @Test
    void filtersProjectsByDomain() {
        assertThat(catalog.search("api", ""))
                .extracting(Project::id)
                .containsExactly("api-docs-portfolio-v2", "orders-api-mcp", "technical-writing-portfolio");
    }

    @Test
    void searchesProjectNamesDescriptionsAndTagsCaseInsensitively() {
        assertThat(catalog.search("", "oracle olap"))
                .extracting(Project::id)
                .containsExactly("global11-demo-data-platform");
    }

    @Test
    void returnsProjectByStableRepositorySlug() {
        assertThat(catalog.findById("global11-demo-data-platform"))
                .isPresent()
                .get()
                .extracting(Project::name)
                .isEqualTo("Global11 Demo Data Platform");
    }

    @Test
    void unknownDomainDoesNotReturnProjects() {
        assertThat(catalog.search("unknown-domain", "")).isEmpty();
    }
}
