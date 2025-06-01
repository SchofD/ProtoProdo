import { getShips, getFactions, getShipTypes } from '$lib/db.js';

export async function load() {
    try {
        const [ships, factions, functions] = await Promise.all([
            getShips(),
            getFactions(),
            getShipTypes()
        ]);

        return {
            ships,
            factions: factions.sort(),
            functions: functions.sort()
        };
    } catch (error) {
        console.error('Error loading ships:', error);
        return {
            ships: [],
            factions: [],
            functions: []
        };
    }
}