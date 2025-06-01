import { json } from '@sveltejs/kit';
import { createFleet } from '$lib/db.js';

export async function POST({ request }) {
    console.log('API POST /api/fleets called');
    try {
        const fleetData = await request.json();
        
        // Validierung
        if (!fleetData.name || !fleetData.name.trim()) {
            return json({ error: 'Flottenname ist erforderlich' }, { status: 400 });
        }
        
        if (!fleetData.ships || fleetData.ships.length === 0) {
            return json({ error: 'Mindestens ein Schiff ist erforderlich' }, { status: 400 });
        }
        
        if (fleetData.totalPopulation > 300) {
            return json({ error: 'Population darf 300 nicht überschreiten' }, { status: 400 });
        }
        
        // Flotte speichern
        const result = await createFleet(fleetData);
        
        return json({ 
            success: true, 
            fleetId: result.insertedId,
            message: 'Flotte erfolgreich erstellt'
        });
        
    } catch (error) {
        console.error('Error creating fleet:', error);
        return json({ error: 'Fehler beim Erstellen der Flotte' }, { status: 500 });
    }
}