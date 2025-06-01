// src/routes/ships/[id]/+page.server.js
import { getShipById } from '$lib/db.js';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
    try {
        const ship = await getShipById(params.id);
        
        if (!ship) {
            throw error(404, 'Schiff nicht gefunden');
        }
        
        return {
            ship
        };
    } catch (err) {
        console.error('Error loading ship:', err);
        throw error(500, 'Fehler beim Laden des Schiffs');
    }
}