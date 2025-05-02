<script lang="ts">
    // Adjust import paths based on where you keep shared components/types
    // Using $lib alias is recommended for shared items across routes
    import Header from './header.svelte'; // If header.svelte is also in /kerjumble
    // OR import Header from '$lib/components/kerjumble/Header.svelte'; // If using $lib
    import { page } from '$app/stores';
    import "./style.css";
    // Import any necessary types or global game styles if needed here
    // import './kerjumble-global.css';
  
    // Determine Header title based on the specific page within kerjumble/
    // Note: $page.data needs corresponding load functions in +page.js/+layout.js
    // Using pathname might be simpler if you don't need loaded data
    $: path = $page.url.pathname;
    $: headerNumber = path.includes('/stats') ? 'Stats' : ($page.data.day ?? 'Kerjumble'); // Example logic
  
    // Note: State for modals (helpOpen, settingsOpen) managed by the layout
    // can be complex if they should *only* show on the main game page.
    // It might be simpler to keep modal toggles *within* src/routes/kerjumble/+page.svelte
    // and have the Header buttons emit events or use a store if needed.
  
  </script>
  
  <Header number={headerNumber} />
  
  <main>
    <slot />
  </main>