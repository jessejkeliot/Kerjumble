<script lang="ts">
    import { enhance } from "$app/forms";
    import type { SubmitFunction } from "@sveltejs/kit";
    import type { ActionData } from "./$types";
    import { fade } from "svelte/transition";
    import type { DictionaryEntry } from "./types";
    let { data } = $props();
    let results = $derived((data?.results ?? []) as DictionaryEntry[]);
    let loading = $state(false);
    const handleEnhance: SubmitFunction = ({ formData, cancel }) => {
        loading = true; // Start loading
        const word = formData.get("word")?.toString().trim();
        if (!word) {
            cancel();
        }

        return async ({ update }) => {
            await update(); // Wait for the SvelteKit form action to finish
            loading = false; // Stop loading
        };
    };
</script>

<svelte:head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>QuickDefine</title>
</svelte:head>
<div class="body">
    <div id="qdbox">
        <h1>QuickDefine</h1>
        <form method="post" use:enhance={handleEnhance}>
            <div id="searchbox">
                <input type="text" name="word" id="wordInput" placeholder="Enter a word" />
                <input type="submit" value="define" name="submit" />
            </div>
        </form>
        {#if loading}
            <div class="spinner">loading...</div>
        {:else if results.length > 0}
            {#key results[0].word}
                <h2>Definitions for: {results[0].word}</h2>
                {#each results as item, index}
                    <div class="entry" in:fade|global={{duration: 500, delay: 100*index}}>
                        <h3>{item.word}</h3>
                        <h3><small>{item.phonetic ?? ""}</small></h3>
                        {#each item.meanings as meaning}
                            <div class="meaning">
                                <span class="pos">{meaning.partOfSpeech}</span>
                                <ul>
                                    {#each meaning.definitions as def, i}
                                        <li>
                                            {def.definition}
                                        </li>
                                    {/each}
                                </ul>
                            </div>
                        {/each}
                    </div>
                {/each}
            {/key}
        {:else if data?.success === false}
            <p>No definition found</p>
        {/if}
    </div>
</div>

<style>
    .body {
        display: grid;
        place-items: center;
        height: 100%;
        width: 100%;
        background-color: #bbb;
        font-family: Helvetica, sans-serif;
    }

    * {
        box-sizing: border-box;
    }
    .spinner {
        animation: fade 0.5s linear 0s infinite forwards;
    }
    @keyframes fade {
        0% {
            opacity: 0;
        }
        50% {
            opacity: 1;
        }
        100% {
            opacity: 0;
        }
    }

    form {
        all: unset;
    }
    h2 {
        padding: 0;
        color: #1557ff;
        width: 100%;
    }

    #qdbox {
        width: 500px;
        height: 350px;
        overflow-y: auto;

        background: #fefefe;
        padding: 2em;

        display: flex;
        flex-direction: column;
        align-items: center;

        box-shadow: 0px 5px 10px #0008;
    }
    #qdbox::-webkit-scrollbar {
        display: none;
    }

    #searchbox {
        display: flex;
        width: auto;
    }
    #searchbox > input:focus-visible {
        outline: none;
    }

    #searchbox > input,
    #searchbox > input[type="submit"] {
        border-radius: 0;
        border: 2px solid #bbb;
        padding: 0.5em;
        border-right: none;
    }

    #searchbox > input[type="submit"] {
        background-color: #1557ff;
        color: #fff;
        border-right: 2px solid #bbb;
        border-left: none;
    }

    #definitionbox {
        display: block;
        width: 100%;
    }

    h1 {
        margin: 0;
        padding: 0.5em 0;
        text-align: center;
    }
</style>
