// src/routes/fleets/[id]/+page.server.js
import { getFleetById, getShips } from '$lib/db.js';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
    try {
        const fleetId = params.id;
        
        // Lade Flotte und alle Schiffe parallel
        const [fleet, ships] = await Promise.all([
            getFleetById(fleetId),
            getShips()
        ]);
        
        if (!fleet) {
            throw error(404, 'Flotte nicht gefunden');
        }
        
        return {
            fleet,
            ships
        };
    } catch (err) {
        console.error('Error loading fleet details:', err);
        if (err.status === 404) {
            throw err;
        }
        throw error(500, 'Fehler beim Laden der Flotte');
    }
}