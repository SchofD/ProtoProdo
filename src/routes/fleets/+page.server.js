// src/routes/fleets/+page.server.js
import { getFleets } from '$lib/db.js';

export async function load() {
    const fleets = await getFleets();
    return {
        fleets
    };
}