import { redirect, type Actions } from '@sveltejs/kit';
import type { Country } from './types.js';

export const actions = {
    default: async ({request, fetch})=> {
        const data = await request.formData();
        const country = data.get("country")?.toString().trim();

        if(country) {
            throw redirect(303, `?country=${country}`);
        }
    }
} satisfies Actions;

export const load = async ({fetch, url}) => {
    const country = url.searchParams.get('country');

    if (country) {
        // https://restcountries.com/v3.1/name/france/?fields=name,flags,population
        const res = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(country)}/?fields=name,flags,population`);
        if (res.ok) {
            const results: Country[]  = await res.json();
            if (results.length > 0) {
                return { success: true, result: results[0] };
            }
            return { success: false, results: undefined };
        }
    }
    return { success: false, results: undefined };
};