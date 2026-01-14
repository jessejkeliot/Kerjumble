import type { Actions } from "@sveltejs/kit";
import { redirect } from "@sveltejs/kit";
import type { DictionaryEntry } from "./types.js";

export const actions = {
    default: async ({ request, fetch }) => {
        const data = await request.formData();
        const word = data.get("word")?.toString().trim();

        if (word) {
            throw redirect(303, `?word=${word}`);
        }
    },
} satisfies Actions;

export const load = async ({ url, fetch }) => {
    const word = url.searchParams.get("word");

    if (word) {
        const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
        if (res.ok) {
            const results: DictionaryEntry  = await res.json();
            return { success: true, results: results };
        }
    }
    return { success: false, results: [] };
};