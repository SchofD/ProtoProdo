import { MongoClient, ObjectId } from 'mongodb';
import { MONGODB_URI } from '$env/static/private';

// Debug: Prüfe ob MONGODB_URI definiert ist
console.log('MONGODB_URI exists:', !!MONGODB_URI);
console.log('MONGODB_URI starts with mongodb:', MONGODB_URI?.startsWith('mongodb'));

// Prüfe ob MONGODB_URI definiert ist
if (!MONGODB_URI) {
    console.error('MONGODB_URI environment variable is missing!');
    throw new Error('MONGODB_URI environment variable is required');
}

const client = new MongoClient(MONGODB_URI);

let clientPromise;

if (!globalThis.mongo) {
    globalThis.mongo = { client: client.connect() };
}
clientPromise = globalThis.mongo.client;

export async function connectDB() {
    try {
        const client = await clientPromise;
        const db = client.db('ProtoProdDB');
        console.log('Connected to database: ProtoProdDB');
        return db;
    } catch (error) {
        console.error('MongoDB connection failed:', error);
        throw error;
    }
}

// Helper function to convert ObjectIds to strings
function serializeMongoData(data) {
    if (Array.isArray(data)) {
        return data.map(serializeMongoData);
    } else if (data && typeof data === 'object') {
        const serialized = {};
        for (const key in data) {
            if (key === '_id' && data[key]) {
                serialized[key] = data[key].toString();
            } else if (typeof data[key] === 'object') {
                serialized[key] = serializeMongoData(data[key]);
            } else {
                serialized[key] = data[key];
            }
        }
        return serialized;
    }
    return data;
}

// Schiffe laden
export async function getShips(filter = {}) {
    try {
        console.log('Attempting to get ships...');
        const db = await connectDB();
        console.log('Database connected, accessing Ships collection...');
        
        const ships = await db.collection('Ships').find(filter).toArray();
        console.log(`Found ${ships.length} ships`);
        
        // Konvertiere ObjectIds zu Strings
        return serializeMongoData(ships);
    } catch (error) {
        console.error('Error getting ships:', error);
        console.log('Falling back to dummy data...');
        // Import fallback dynamically
        const fallback = await import('./db-fallback.js');
        return await fallback.getShips();
    }
}

// Einzelnes Schiff laden
export async function getShipById(id) {
    try {
        const db = await connectDB();
        const ship = await db.collection('Ships').findOne({ _id: new ObjectId(id) });
        return ship ? serializeMongoData(ship) : null;
    } catch (error) {
        console.error('Error getting ship by id:', error);
        const fallback = await import('./db-fallback.js');
        return await fallback.getShipById(id);
    }
}

// Schiffe nach Fraktion filtern
export async function getShipsByFaction(faction) {
    try {
        const db = await connectDB();
        const ships = await db.collection('Ships').find({ 
            "Fraktion": { $in: [faction] }
        }).toArray();
        return serializeMongoData(ships);
    } catch (error) {
        console.error('Error getting ships by faction:', error);
        const fallback = await import('./db-fallback.js');
        return await fallback.getShips();
    }
}

// Alle verfügbaren Fraktionen laden
export async function getFactions() {
    try {
        const db = await connectDB();
        const factions = await db.collection('Ships').distinct('Fraktion');
        // Flatten das Array, da Fraktion ein Array von Arrays ist
        return [...new Set(factions.flat())];
    } catch (error) {
        console.error('Error getting factions:', error);
        const fallback = await import('./db-fallback.js');
        return await fallback.getFactions();
    }
}

// Alle Schiffstypen laden
export async function getShipTypes() {
    try {
        const db = await connectDB();
        return await db.collection('Ships').distinct('Funktion');
    } catch (error) {
        console.error('Error getting ship types:', error);
        const fallback = await import('./db-fallback.js');
        return await fallback.getShipTypes();
    }
}

// Flotte erstellen
export async function createFleet(fleet) {
    try {
        const db = await connectDB();
        const result = await db.collection('Fleets').insertOne({
            ...fleet,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        return { insertedId: result.insertedId.toString() };
    } catch (error) {
        console.error('Error creating fleet:', error);
        const fallback = await import('./db-fallback.js');
        return await fallback.createFleet(fleet);
    }
}

// Alle Flotten laden
export async function getFleets() {
    try {
        const db = await connectDB();
        const fleets = await db.collection('Fleets').find({}).sort({ createdAt: -1 }).toArray();
        return serializeMongoData(fleets);
    } catch (error) {
        console.error('Error getting fleets:', error);
        const fallback = await import('./db-fallback.js');
        return await fallback.getFleets();
    }
}

// Einzelne Flotte laden
export async function getFleetById(id) {
    try {
        const db = await connectDB();
        const fleet = await db.collection('Fleets').findOne({ _id: new ObjectId(id) });
        return fleet ? serializeMongoData(fleet) : null;
    } catch (error) {
        console.error('Error getting fleet by id:', error);
        const fallback = await import('./db-fallback.js');
        return await fallback.getFleetById(id);
    }
}

// Flotte aktualisieren
export async function updateFleet(id, updates) {
    try {
        const db = await connectDB();
        const result = await db.collection('Fleets').updateOne(
            { _id: new ObjectId(id) },
            { 
                $set: {
                    ...updates,
                    updatedAt: new Date()
                }
            }
        );
        return result;
    } catch (error) {
        console.error('Error updating fleet:', error);
        throw error;
    }
}

// Flotte löschen
export async function deleteFleet(id) {
    try {
        const db = await connectDB();
        const result = await db.collection('Fleets').deleteOne({ _id: new ObjectId(id) });
        return result;
    } catch (error) {
        console.error('Error deleting fleet:', error);
        throw error;
    }
}



// Suchfunktion für Schiffe
export async function searchShips(query) {
    const db = await connectDB();
    return await db.collection('Ships').find({
        $or: [
            { "Ship Name": { $regex: query, $options: 'i' } },
            { "Funktion": { $regex: query, $options: 'i' } },
            { "Fraktion": { $in: [new RegExp(query, 'i')] } }
        ]
    }).toArray();
}