import { useEffect, useMemo, useState } from 'react';

const USERNAME = 'ekatmoz88-alt';
const API = 'https://api.github.com';

async function githubGet(path, signal) {
  const response = await fetch(`${API}${path}`, {
    headers: { Accept: 'application/vnd.github+json' },
    signal,
  });
  if (!response.ok) {
    const message = response.status === 403
      ? 'GitHub API rate limit reached. Please try again later.'
      : `GitHub API request failed (${response.status}).`;
    throw new Error(message);
  }
  return response.json();
}

function formatNumber(value = 0) {
  return new Intl.NumberFormat('en', { notation: value > 9999 ? 'compact' : 'standard' }).format(value);
}

function timeAgo(date) {
  const days = Math.max(0, Math.floor((Date.now() - new Date(date).getTime()) / 86400000));
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 30) return `${days} days ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
}

function eventDescription(event) {
  const repo = event.repo?.name?.replace(`${USERNAME}/`, '') || 'a repository';
  switch (event.type) {
    case 'PushEvent': return `Pushed ${event.payload?.commits?.length || 1} commit(s) to ${repo}`;
    case 'CreateEvent': return `Created ${event.payload?.ref_type || 'a resource'} in ${repo}`;
    case 'PullRequestEvent': return `${event.payload?.action || 'Updated'} a pull request in ${repo}`;
    case 'IssuesEvent': return `${event.payload?.action || 'Updated'} an issue in ${repo}`;
    case 'WatchEvent': return `Starred ${repo}`;
    case 'ForkEvent': return `Forked ${repo}`;
    case 'ReleaseEvent': return `Published a release in ${repo}`;
    default: return `${event.type?.replace('Event', '') || 'Activity'} in ${repo}`;
  }
}

function websiteUrl(value) {
  if (!value) return '';
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

export default function App() {
  const [profile, setProfile] = useState(null);
  const [repositories, setRepositories] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('updated');

  async function loadDashboard(signal) {
    setLoading(true);
    setError('');
    try {
      const [userData, repoData, eventData] = await Promise.all([
        githubGet(`/users/${USERNAME}`, signal),
        githubGet(`/users/${USERNAME}/repos?sort=updated&per_page=100&type=owner`, signal),
        githubGet(`/users/${USERNAME}/events/public?per_page=30`, signal),
      ]);
      setProfile(userData);
      setRepositories(repoData);
      setEvents(eventData);
    } catch (err) {
      if (err.name !== 'AbortError') setError(err.message || 'Unable to load GitHub data.');
    } finally {
      if (!signal.aborted) setLoading(false);
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    loadDashboard(controller.signal);
    return () => controller.abort();
  }, []);

  const totalStars = repositories.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  const totalForks = repositories.reduce((sum, repo) => sum + repo.forks_count, 0);

  const languages = useMemo(() => {
    const counts = {};
    repositories.forEach((repo) => {
      if (repo.language) counts[repo.language] = (counts[repo.language] || 0) + 1;
    });
    const total = Object.values(counts).reduce((sum, count) => sum + count, 0) || 1;
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count, percent: Math.round((count / total) * 100) }))
      .sort((a, b) => b.count - a.count);
  }, [repositories]);

  const visibleRepos = useMemo(() => {
    const filtered = repositories.filter((repo) =>
      `${repo.name} ${repo.description || ''} ${repo.language || ''}`.toLowerCase().includes(query.toLowerCase())
    );
    return [...filtered].sort((a, b) => {
      if (sort === 'stars') return b.stargazers_count - a.stargazers_count;
      if (sort === 'name') return a.name.localeCompare(b.name);
      return new Date(b.updated_at) - new Date(a.updated_at);
    });
  }, [repositories, query, sort]);

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="https://github.com" target="_blank" rel="noreferrer">
          <span className="brand-mark">⌘</span> GitHub Insights
        </a>
        <div className="topbar-right">
          <span className="live-dot" /> Live public data
          <button className="refresh-button" onClick={() => {
            const controller = new AbortController();
            loadDashboard(controller.signal);
          }}>↻ Refresh</button>
        </div>
      </header>

      <main className="dashboard">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">DEVELOPER OVERVIEW</p>
            <h1>GitHub dashboard</h1>
            <p className="hero-subtitle">A live snapshot of repositories, reach and recent public activity.</p>
          </div>
          <a className="github-link" href={`https://github.com/${USERNAME}`} target="_blank" rel="noreferrer">
            View GitHub profile ↗
          </a>
        </section>

        {error && <div className="error-banner" role="alert">{error}</div>}
        {loading && !profile && <div className="loading-panel"><span className="spinner" /> Loading GitHub profile…</div>}

        {profile && (
          <>
            <section className="profile-panel">
              <img className="avatar" src={profile.avatar_url} alt={`${profile.login} avatar`} />
              <div className="profile-details">
                <h2>{profile.name || profile.login}</h2>
                <a href={profile.html_url} target="_blank" rel="noreferrer">@{profile.login}</a>
                <p>{profile.bio || 'No public bio has been added yet.'}</p>
                <div className="profile-meta">
                  {profile.company && <span>▣ {profile.company}</span>}
                  {profile.location && <span>⌖ {profile.location}</span>}
                  {profile.blog && <a href={websiteUrl(profile.blog)} target="_blank" rel="noreferrer">↗ Website</a>}
                  <span>Joined {new Date(profile.created_at).toLocaleDateString('en', { month: 'short', year: 'numeric' })}</span>
                </div>
              </div>
              <div className="follow-stats">
                <strong>{formatNumber(profile.followers)}</strong><span>Followers</span>
                <strong>{formatNumber(profile.following)}</strong><span>Following</span>
              </div>
            </section>

            <section className="stats-grid" aria-label="GitHub statistics">
              <article className="stat-card"><span className="stat-icon">▤</span><span className="stat-label">Public repositories</span><strong>{formatNumber(profile.public_repos)}</strong><small>On this account</small></article>
              <article className="stat-card"><span className="stat-icon">★</span><span className="stat-label">Total stars</span><strong>{formatNumber(totalStars)}</strong><small>Across loaded repositories</small></article>
              <article className="stat-card"><span className="stat-icon">⑂</span><span className="stat-label">Total forks</span><strong>{formatNumber(totalForks)}</strong><small>Across loaded repositories</small></article>
              <article className="stat-card"><span className="stat-icon">◷</span><span className="stat-label">Public events</span><strong>{formatNumber(events.length)}</strong><small>Recent events returned by GitHub</small></article>
            </section>

            <section className="content-grid">
              <div className="panel repositories-panel">
                <div className="panel-heading">
                  <div><p className="eyebrow">PROJECTS</p><h2>Repositories <span>{repositories.length}</span></h2></div>
                </div>
                <div className="repo-controls">
                  <input aria-label="Search repositories" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search repositories…" />
                  <select aria-label="Sort repositories" value={sort} onChange={(e) => setSort(e.target.value)}>
                    <option value="updated">Recently updated</option>
                    <option value="stars">Most stars</option>
                    <option value="name">Name A–Z</option>
                  </select>
                </div>
                <div className="repo-list">
                  {visibleRepos.map((repo) => (
                    <article className="repo-item" key={repo.id}>
                      <div className="repo-main">
                        <a href={repo.html_url} target="_blank" rel="noreferrer">{repo.name} ↗</a>
                        <p>{repo.description || 'No description provided.'}</p>
                        <div className="repo-meta">
                          {repo.language && <span className="language-dot">{repo.language}</span>}
                          <span>★ {formatNumber(repo.stargazers_count)}</span>
                          <span>⑂ {formatNumber(repo.forks_count)}</span>
                          <span>Updated {timeAgo(repo.updated_at)}</span>
                          {repo.homepage && <a className="repo-website" href={websiteUrl(repo.homepage)} target="_blank" rel="noreferrer">Live site ↗</a>}
                        </div>
                      </div>
                      <span className={repo.private ? 'visibility private' : 'visibility'}>{repo.private ? 'Private' : 'Public'}</span>
                    </article>
                  ))}
                  {!visibleRepos.length && <p className="empty-state">No repositories match that search.</p>}
                </div>
              </div>

              <aside className="side-column">
                <section className="panel language-panel">
                  <div className="panel-heading"><div><p className="eyebrow">TECH STACK</p><h2>Languages</h2></div></div>
                  <p className="panel-note">Primary language by repository count</p>
                  {languages.length ? languages.map((language) => (
                    <div className="language-row" key={language.name}>
                      <div><span>{language.name}</span><strong>{language.percent}%</strong></div>
                      <div className="bar-track"><span style={{ width: `${language.percent}%` }} /></div>
                    </div>
                  )) : <p className="empty-state">No language data available.</p>}
                </section>

                <section className="panel activity-panel">
                  <div className="panel-heading"><div><p className="eyebrow">WHAT'S HAPPENING</p><h2>Recent activity</h2></div></div>
                  <div className="activity-list">
                    {events.slice(0, 8).map((event) => (
                      <div className="activity-item" key={event.id}>
                        <span className="activity-marker" />
                        <div><p>{eventDescription(event)}</p><time>{timeAgo(event.created_at)}</time></div>
                      </div>
                    ))}
                    {!events.length && <p className="empty-state">No recent public events found.</p>}
                  </div>
                  <a className="all-activity" href={`https://github.com/${USERNAME}?tab=activity`} target="_blank" rel="noreferrer">View full activity ↗</a>
                </section>
              </aside>
            </section>
          </>
        )}

        <section className="panel" style={{marginTop:16}} id="portfolio">
          <div className="panel-heading"><div><p className="eyebrow">SELECTED WORK</p><h2>Portfolio projects <span>6</span></h2></div></div>
          <div className="projects-grid">
            <article className="project-card">
              <div className="project-card-top"><span className="project-type">API DOCUMENTATION</span><span className="project-number">01</span></div>
              <h3>API Documentation Portfolio V2</h3>
              <p>REST APIs, OpenAPI 3.1, SOAP/WSDL case studies, API references, documentation architecture and automated validation.</p>
              <div className="project-tags"><span>OpenAPI</span><span>REST</span><span>SOAP</span></div>
              <div className="project-links"><a className="project-link-primary" href="https://ekatmoz88-alt.github.io/api-docs-portfolio-v2/" target="_blank" rel="noreferrer">Live site <span>↗</span></a><a href="https://github.com/ekatmoz88-alt/api-docs-portfolio-v2" target="_blank" rel="noreferrer">Source ↗</a></div>
            </article>
            <article className="project-card">
              <div className="project-card-top"><span className="project-type">C++ / UI COMPONENTS</span><span className="project-number">02</span></div>
              <h3>Cobalt UI Navigation Docs</h3>
              <p>Source-based C++ component documentation: architecture, native interfaces, lifecycle, focus management, callbacks and compatibility behavior.</p>
              <div className="project-tags"><span>C++</span><span>API reference</span><span>Lifecycle</span></div>
              <div className="project-links"><a className="project-link-primary" href="https://ekatmoz88-alt.github.io/cobalt-ui-navigation-docs/" target="_blank" rel="noreferrer">Live site <span>↗</span></a><a href="https://github.com/ekatmoz88-alt/cobalt-ui-navigation-docs" target="_blank" rel="noreferrer">Source ↗</a></div>
            </article>
            <article className="project-card">
              <div className="project-card-top"><span className="project-type">DATA / SYSTEMS</span><span className="project-number">03</span></div>
              <h3>Territory System Documentation</h3>
              <p>System documentation covering Oracle database models, API endpoints, JSON structures and source-to-model mappings. Includes an overview of the technical-project document (code 53281996.425530.9-4757-3.П6.01) covering logical and physical database structure. The logical model covers 25 functional sections; the physical-structure contents list 381 numbered tables, fields, indexes and a Sybase PowerDesigner model.</p>
              <div className="project-tags"><span>Oracle</span><span>Database Documentation</span><span>Data Models</span></div>
              <div className="project-links"><a className="project-link-primary" href="https://ekatmoz88-alt.github.io/territory-docs/" target="_blank" rel="noreferrer">Live site <span>↗</span></a><a href="https://ekatmoz88-alt.github.io/territory-docs/database/physical-structure-specification" target="_blank" rel="noreferrer">Physical DB structure (2014) ↗</a><a href="https://github.com/ekatmoz88-alt/territory-docs" target="_blank" rel="noreferrer">Source ↗</a></div>
            </article>
            <article className="project-card">
              <div className="project-card-top"><span className="project-type">ORACLE DATABASE DOCUMENTATION</span><span className="project-number">04</span></div>
              <h3>Global11 — Oracle Database Documentation</h3>
              <p>Technical documentation for an Oracle Global 11g data platform, covering the relational data model, data dictionary, OLAP patterns, and SQL scripts and scenarios.</p>
              <div className="project-tags"><span>Oracle 11g</span><span>Data Modeling</span><span>SQL</span></div>
              <div className="project-links"><a className="project-link-primary" href="https://ekatmoz88-alt.github.io/global11-demo-data-platform/" target="_blank" rel="noreferrer">Live documentation <span>↗</span></a><a href="https://github.com/ekatmoz88-alt/global11-demo-data-platform" target="_blank" rel="noreferrer">Source ↗</a></div>
            </article>

            <article className="project-card">
              <div className="project-card-top"><span className="project-type">SOFTWARE ARCHITECTURE REVIEW</span><span className="project-number">04A</span></div>
              <h3>Application Suite Architecture Review</h3>
              <p>Source-based review of ModuleMobile, ModuleStationary and Printer / PassportPaint, covering component responsibilities, UMMS SOAP integration, XML-based file exchange, encryption flow and SQLite data access. Findings distinguish observed source behavior from unverified assumptions.</p>
              <div className="project-tags"><span>Software Architecture</span><span>SOAP / XML</span><span>SQLite</span></div>
              <div className="project-links"><a className="project-link-primary" href="https://ekatmoz88-alt.github.io/global11-demo-data-platform/docs/architecture/application-suite-review.md" target="_blank" rel="noreferrer">Read architecture review <span>↗</span></a><a href="https://github.com/ekatmoz88-alt/global11-demo-data-platform" target="_blank" rel="noreferrer">Source repository ↗</a></div>
            </article>

            <article className="project-card">
              <div className="project-card-top"><span className="project-type">HARDWARE SPECIFICATION</span><span className="project-number">05</span></div>
              <h3>ADP201P4 Hardware Specification</h3>
              <p>Engineering documentation for a DSP carrier board: processing architecture, memory mapping, FPGA interface, registers and connector pinouts.</p>
              <div className="project-tags"><span>DSP</span><span>FPGA</span><span>Registers</span></div>
              <div className="project-links"><a className="project-link-primary" href="https://github.com/ekatmoz88-alt/adp201p4-hardware-spec" target="_blank" rel="noreferrer">View repository <span>↗</span></a></div>
            </article>
            <article className="project-card">
              <div className="project-card-top"><span className="project-type">SOAP / ENTERPRISE API</span><span className="project-number">06</span></div>
              <h3>UMMS SOAP API Documentation</h3>
              <p>Enterprise SOAP integration and client documentation, with a clear separation between public materials and restricted NDA documentation.</p>
              <div className="project-tags"><span>SOAP</span><span>WSDL</span><span>Integration</span></div>
              <div className="project-links"><a className="project-link-primary" href="https://github.com/ekatmoz88-alt/umms-docs" target="_blank" rel="noreferrer">View repository <span>↗</span></a></div>
            </article>
          </div>
        </section>
        <footer className="footer">
          <span>Data provided by the GitHub REST API</span>
          <span>Public data · Refresh to update</span>
        </footer>
      </main>
    </div>
  );
}
