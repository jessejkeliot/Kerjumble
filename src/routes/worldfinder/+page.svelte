<script lang="ts">
    import { enhance } from "$app/forms";
    import type { SubmitFunction } from "@sveltejs/kit";
    import type { Country } from "./types";
    import { fly } from "svelte/transition";
    import { resolveRoute } from "$app/paths";

    let loading = $state(false);
    let imageLoaded = $state(false);

    let { data } = $props();

    $effect(() => {
        if (data.result) {
            imageLoaded = false;
        }
    });
    const handleEnhance: SubmitFunction = ({ formData, cancel }) => {
        loading = true; // Start loading
        const country = formData.get("country")?.toString().trim();
        if (!country) {
            cancel();
        }
        return async ({ update }) => {
            await update(); // Wait for the SvelteKit form action to finish
            loading = false; // Stop loading
        };
    };

    let country: Country | undefined = $derived(data.result);
</script>

<div class="whole">
    <h1>Country Finder</h1>
    <form method="post" use:enhance={handleEnhance}>
        <input type="text" name="country" placeholder="Greenland" />
        <input type="submit" value="Look" />
    </form>

    {#if data.success === false}
        <div class="error">
            <p>Could not find that country. Try again!</p>
        </div>
    {:else if loading || (data.result && !imageLoaded)}
        <p>Loading...</p>
    {/if}
    <div class="country-container" class:hidden={!imageLoaded} in:fly={{ duration: 500, delay: 0 }}>
        {#if country}
            <!-- content here -->
            {#key country.name.common}
                <div class="countrybox">
                    <h1>{country.name.common}</h1>
                    <h2>Population: {country.population}</h2>
                    <img
                        src={country.flags.svg}
                        alt={country.flags.alt}
                        onload={() => (imageLoaded = true)}
                    />
                </div>
            {/key}
        {/if}
    </div>
</div>

<style>
    :root {
        --bg-app: #282828ff;
        --bg-card: #333333;
        --primary: #006f98ff;
        --text-main: #cccbc7ff;
        --text-muted: #aaaaaa;
        --error: #f24300ff;
        --radius: 3px;
        --shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    }
    .hidden {
        visibility: hidden;
        position: absolute; /* Prevents the invisible box from taking up space */
        pointer-events: none;
    }

    .whole {
        min-height: 100vh;
        width: 100%;
        background-color: var(--bg-app);
        color: var(--text-main);
        font-family:
            "Inter",
            system-ui,
            -apple-system,
            sans-serif;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    h1 {
        font-weight: 800;
        letter-spacing: -1px;
        margin-bottom: 2rem;
        background: linear-gradient(to top, var(--error), var(--text-main));
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    /* 2. Search Area Styling */
    form {
        display: flex;
        gap: 0;
        width: 100%;
        max-width: 450px;
        margin-bottom: 3rem;
        filter: drop-shadow(var(--shadow));
    }

    input[type="text"] {
        flex: 1;
        background: #444;
        border: 2px solid #555;
        border-right: none;
        padding: 1rem 1.5rem;
        color: white;
        border-radius: var(--radius) 0 0 var(--radius);
        font-size: 1rem;
        transition: border-color 0.3s;
    }

    input[type="text"]:focus {
        outline: none;
        border-color: var(--primary);
    }

    input[type="submit"] {
        background: var(--primary);
        color: #003b47;
        border: 2px solid var(--primary);
        padding: 0 1.5rem;
        font-weight: bold;
        text-transform: uppercase;
        cursor: pointer;
        border-radius: 0 var(--radius) var(--radius) 0;
        transition: all 0.2s;
    }

    /* 3. Country Card Styling */
    .countrybox {
        background: var(--bg-card);
        padding: 2.5rem;
        border-radius: var(--radius);
        box-shadow: var(--shadow);
        text-align: center;
        border: 1px solid #444;
        max-width: 500px;
        width: 100%;
    }

    .countrybox h1 {
        margin: 0;
        font-size: 2.5rem;
        -webkit-text-fill-color: initial;
        background: none;
        color: white;
    }

    .countrybox h2 {
        color: var(--text-muted);
        font-weight: 400;
        margin-bottom: 2rem;
        font-size: 1.1rem;
    }
    .country-container {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    img {
        width: 100%;
        max-width: 350px;
        height: auto;
        border-radius: var(--radius);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
        border: 1px solid rgba(255, 255, 255, 0.1);
    }

    /* 4. Feedback States */
    .error {
        color: var(--error);
        background: rgba(255, 95, 95, 0.1);
        padding: 1rem 2rem;
        border-radius: 8px;
        border: 1px solid var(--error);
    }
</style>
