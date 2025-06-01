import { json } from '@sveltejs/kit';
import { deleteFleet, getFleetById } from '$lib/db.js';

export async function DELETE({ params }) {
    try {
        console.log('Delete request for fleet:', params.id);
        const fleetId = params.id;
        
        // Prüfe ob Flotte existiert
        const fleet = await getFleetById(fleetId);
        if (!fleet) {
            console.log('Fleet not found:', fleetId);
            return json({ error: 'Flotte nicht gefunden' }, { status: 404 });
        }
        
        console.log('Deleting fleet:', fleet.name);
        
        // Lösche Flotte
        const result = await deleteFleet(fleetId);
        console.log('Delete result:', result);
        
        if (result.deletedCount === 1) {
            return json({ 
                success: true, 
                message: 'Flotte erfolgreich gelöscht'
            });
        } else {
            return json({ error: 'Flotte konnte nicht gelöscht werden' }, { status: 500 });
        }
        
    } catch (error) {
        console.error('Error deleting fleet:', error);
        return json({ error: 'Fehler beim Löschen der Flotte: ' + error.message }, { status: 500 });
    }
}

export async function GET({ params }) {
    try {
        const fleetId = params.id;
        const fleet = await getFleetById(fleetId);
        
        if (!fleet) {
            return json({ error: 'Flotte nicht gefunden' }, { status: 404 });
        }
        
        return json(fleet);
        
    } catch (error) {
        console.error('Error getting fleet:', error);
        return json({ error: 'Fehler beim Laden der Flotte' }, { status: 500 });
    }
}