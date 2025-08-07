<script lang="ts">
  import { page } from "$app/state";
  export let header: string = "";
  export let rootroute: string = "#";
  export let elements: SidebarElement[] = [];

  type SidebarElement = {
    title: string;
    route: string;
  };

  $: isClickable = rootroute !== "#" ? "hover:bg-white/10" : "";
</script>

<aside>
  <div>
    <a href={rootroute}>
      <h1 class="header">
        {header}
      </h1>
    </a>
  </div>
  <ul>
    {#each elements as example, i (example.route)}
      <li>
        <a
          href={example.route}>
          {example.title}
        </a>
      </li>
    {/each}
  </ul>
</aside>

<style>
  aside {
    position: sticky;
    left: 0;
    width: 15%;
    min-width: 60px;
    height: 100%;
    margin-right: 0.75rem;
    background-color: #306ab3ff;
  }
  .header {
    color: black;
    background-color: inherit;
    &:hover {
      background-color: #fff;
    }
  }
  h1 {
    padding: 0.25rem;
    margin: 0;
  }
  ul {
    padding: 0.5rem;
  }
  li {
    padding: 0.25rem;
    background: #03b6deff;
  }
  a {
    color:black;
    display: block;
    &:hover {
      background-color: #fff;
    }
  }
  /* text-p5 bg-p5/20 hover:text-white hover:bg-white/20 block px-2 py-1 mx-2 rounded  */
</style>
