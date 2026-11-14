package com.katemo.portfolio.web;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class PortfolioControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void rendersPortfolioLandingPageAndProjectCatalogue() throws Exception {
        mockMvc.perform(get("/"))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("Project systems")))
                .andExpect(content().string(containsString("Global11 Demo Data Platform")))
                .andExpect(content().string(containsString("14 / 14 PROJECTS")));
    }

    @Test
    void appliesDomainAndTextSearchFilters() throws Exception {
        mockMvc.perform(get("/").param("domain", "enterprise").param("q", "oracle olap"))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("Global11 Demo Data Platform")))
                .andExpect(content().string(org.hamcrest.Matchers.not(containsString("Orders API MCP"))));
    }

    @Test
    void rendersDedicatedGlobal11CaseStudy() throws Exception {
        mockMvc.perform(get("/projects/global11-demo-data-platform"))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("Cube_1111")))
                .andExpect(content().string(containsString("What remains unverified")));
    }

    @Test
    void returnsNotFoundForUnknownProject() throws Exception {
        mockMvc.perform(get("/projects/not-a-real-project"))
                .andExpect(status().isNotFound());
    }

    @Test
    void addsBaselineSecurityHeadersToHttpResponses() throws Exception {
        mockMvc.perform(get("/"))
                .andExpect(status().isOk())
                .andExpect(header().string("X-Content-Type-Options", "nosniff"))
                .andExpect(header().string("X-Frame-Options", "DENY"))
                .andExpect(header().string("Content-Security-Policy", containsString("default-src 'self'")));
    }
}
