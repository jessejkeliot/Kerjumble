<script lang="ts">
  import { page } from "$app/state";

  let {
    header = "Sketches",
    rootroute = "/sketches",
    elements = []
  }: {
    header?: string;
    rootroute?: string;
    elements?: Array<{ title: string; route: string }>;
  } = $props();

  const currentPath = $derived(page.url.pathname);
</script>

<aside class="sidebar">
  <div class="sidebar-header">
    <a href="/" class="home-link" title="Back to Home">
      <span class="home-arrow">‹</span> Home
    </a>
    <a href={rootroute} class="title-link">
      <h1 class="header-title">{header}</h1>
    </a>
  </div>

  <nav class="sidebar-nav">
    <ul>
      {#each elements as example (example.route)}
        {@const isActive = currentPath === example.route}
        <li>
          <a
            href={example.route}
            class="nav-link"
            class:active={isActive}
          >
            <span class="dot"></span>
            <span class="link-text">{example.title}</span>
          </a>
        </li>
      {/each}
    </ul>
  </nav>
</aside>

<style>
  @import url("https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300..900;1,300..900&display=swap");

  .sidebar {
    position: relative;
    width: 240px;
    min-width: 200px;
    height: 100%;
    background: rgba(18, 14, 28, 0.85);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-right: 1px solid rgba(255, 255, 255, 0.15);
    box-shadow: 4px 0 24px rgba(0, 0, 0, 0.4);
    display: flex;
    flex-direction: column;
    padding: 1.25rem 1rem;
    box-sizing: border-box;
    font-family: Helvetica, "Rubik", sans-serif;
    z-index: 20;
  }

  .sidebar-header {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding-bottom: 1.25rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    margin-bottom: 1rem;
  }

  .home-link {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    color: rgba(255, 255, 255, 0.65);
    font-size: 0.9rem;
    text-decoration: none;
    transition: all 0.2s ease;
    width: fit-content;
    padding: 0.25rem 0.5rem;
    border-radius: 0.35rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  /* .home-link:hover {
    color: #fff;
    background: rgba(79, 38, 115, 0.6);
    border-color: rgba(255, 255, 255, 0.3);
    transform: translateX(-2px);
  } */

  .home-arrow {
    font-size: 1.1rem;
    line-height: 1;
  }

  .title-link {
    text-decoration: none;
  }

  .header-title {
    color: #fff;
    font-size: 1.6rem;
    font-style: italic;
    font-weight: 700;
    margin: 0;
    padding: 0;
    text-shadow: 0 0 12px rgba(255, 255, 255, 0.7);
    letter-spacing: -0.02em;
  }

  .sidebar-nav {
    flex: 1;
    overflow-y: auto;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  li {
    margin: 0;
  }

  .nav-link {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    padding: 0.65rem 0.85rem;
    color: rgba(255, 255, 255, 0.75);
    text-decoration: none;
    border-radius: 0.5rem;
    border: 1px solid transparent;
    background: transparent;
    transition: all 0.2s ease;
    font-size: 1rem;
    font-weight: 500;
    backdrop-filter: blur(0);
  }

  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transition: all 0.2s ease;
  }

  /* .nav-link:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.2);
    font-style: italic;
    backdrop-filter: blur(8px);
    text-shadow: 0 0 5px #fff;
    box-shadow: inset 0 0 10px rgba(79, 38, 115, 0.4);
    transform: translateX(3px);
  } */

  .nav-link:hover .dot {
    background: #fff;
    box-shadow: 0 0 6px #fff;
  }

  .nav-link.active {
    color: #fff;
    background: rgba(79, 38, 115, 0.6);
    border-color: rgba(255, 255, 255, 0.4);
    font-style: italic;
    font-weight: 600;
    text-shadow: 0 0 8px #fff;
  }

  .nav-link.active .dot {
    background: #ff55bb;
    box-shadow: 0 0 8px #ff55bb;
    transform: scale(1.3);
  }

    .sidebar {
      width: 100%;
      height: auto;
      border-right: none;
      border-bottom: 1px solid rgba(255, 255, 255, 0.15);
      padding: 0.75rem 1rem;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }

    .sidebar-header {
      flex-direction: row;
      align-items: center;
      gap: 0.75rem;
      padding-bottom: 0;
      border-bottom: none;
      margin-bottom: 0;
    }

    .header-title {
      font-size: 1.25rem;
    }

    .sidebar-nav {
      overflow-x: auto;
      flex: 1;
    }

    ul {
      flex-direction: row;
      gap: 0.35rem;
    }

    .nav-link {
      padding: 0.4rem 0.65rem;
      font-size: 0.85rem;
      white-space: nowrap;
    }
</style>
