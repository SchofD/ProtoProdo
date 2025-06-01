import { getShips, getFactions, getShipTypes } from '$lib/db.js';

export async function load() {
    try {
        console.log('Loading fleet builder data...');
        
        const [ships, factions, functions] = await Promise.all([
            getShips(),
            getFactions(),
            getShipTypes()
        ]);

        console.log('Fleet builder data loaded:', {
            ships: ships.length,
            factions: factions.length,
            functions: functions.length
        });

        return {
            ships: ships || [],
            factions: (factions || []).sort(),
            functions: (functions || []).sort()
        };
    } catch (error) {
        console.error('Error loading fleet builder data:', error);
        
        return {
            ships: [],
            factions: [],
            functions: []
        };
    }
}