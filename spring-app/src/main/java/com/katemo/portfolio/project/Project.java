package com.katemo.portfolio.project;

import java.util.List;

public record Project(
        String id,
        String name,
        String repository,
        String domain,
        String domainLabel,
        String container,
        String description,
        List<String> tags,
        String liveDemo,
        String evidenceNote
) {
}
