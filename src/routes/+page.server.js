import { getShips, getFleets, getFactions, getShipTypes } from '$lib/db.js';

export async function load() {
    try {
        // Alle Daten parallel laden für bessere Performance
        const [ships, fleets, factions, types] = await Promise.all([
            getShips(),
            getFleets(),
            getFactions(),
            getShipTypes()
        ]);
    } catch (error) {
        console.error('Error loading homepage data:', error);
    }
}