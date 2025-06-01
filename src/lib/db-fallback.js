const dummyShips = [
    {
        _id: '683a39d24975810cb65d954e',
        'Ship Name': 'Imperial Star Destroyer',
        Funktion: 'Star Destroyer',
        Fraktion: ['Galactic Empire'],
        Kosten: '5000',
        'Pop Verbrauch': '10',
        Bauzeit: '40',
        Besatzung: '10',
        Energieschild: '4000',
        Trefferpunkte: '8000',
        Bewaffnung: ['Turbolasers', 'Ion Cannons'],
        imageFilename: 'imperial-star-destroyer.jpg'
    },
    {
        _id: '683a39d24975810cb65d954f',
        'Ship Name': 'Mon Calamari Cruiser',
        Funktion: 'Heavy Cruiser',
        Fraktion: ['New Republic'],
        Kosten: '4500',
        'Pop Verbrauch': '8',
        Bauzeit: '35',
        Besatzung: '8',
        Energieschild: '3500',
        Trefferpunkte: '7000',
        Bewaffnung: ['Ion Cannons', 'Turbolasers'],
        imageFilename: 'mon-calamari-cruiser.jpg'
    },
    {
        _id: '683a39d24975810cb65d9550',
        'Ship Name': 'X-Wing Fighter',
        Funktion: 'Fighter',
        Fraktion: ['New Republic'],
        Kosten: '400',
        'Pop Verbrauch': '1',
        Bauzeit: '15',
        Besatzung: '1',
        Energieschild: '200',
        Trefferpunkte: '300',
        Bewaffnung: ['Laser Cannons', 'Proton Torpedoes'],
        imageFilename: 'x-wing.jpg'
    }
];

const dummyFleets = [
    {
        _id: '683b5755c96250362fd60ad1',
        name: 'Death Squadron',
        description: 'Vader\'s personal fleet',
        ships: [
            { 
                shipId: '683a39d24975810cb65d954e', 
                shipName: 'Imperial Star Destroyer', 
                quantity: 1,
                populationPerShip: 10,
                costPerShip: 5000
            }
        ],
        totalCost: 5000,
        totalPopulation: 10,
        totalShips: 1,
        createdAt: new Date('2025-05-31'),
        updatedAt: new Date('2025-05-31')
    },
    {
        _id: '683b5755c96250362fd60ad2',
        name: 'Rebel Strike Force',
        description: 'Fast attack squadron',
        ships: [
            { 
                shipId: '683a39d24975810cb65d9550', 
                shipName: 'X-Wing Fighter', 
                quantity: 12,
                populationPerShip: 1,
                costPerShip: 400
            },
            { 
                shipId: '683a39d24975810cb65d954f', 
                shipName: 'Mon Calamari Cruiser', 
                quantity: 1,
                populationPerShip: 8,
                costPerShip: 4500
            }
        ],
        totalCost: 9300,
        totalPopulation: 20,
        totalShips: 13,
        createdAt: new Date('2025-05-31'),
        updatedAt: new Date('2025-05-31')
    }
];

export async function getShips() {
    return dummyShips;
}

export async function getShipById(id) {
    return dummyShips.find(ship => ship._id === id);
}

export async function getFactions() {
    const allFactions = dummyShips.flatMap(ship => ship.Fraktion);
    return [...new Set(allFactions)];
}

export async function getShipTypes() {
    const allTypes = dummyShips.map(ship => ship.Funktion);
    return [...new Set(allTypes)];
}

export async function getFleets() {
    return dummyFleets;
}

export async function getFleetById(id) {
    return dummyFleets.find(fleet => fleet._id === id);
}

export async function createFleet(fleet) {
    const newFleet = {
        ...fleet,
        _id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date()
    };
    dummyFleets.push(newFleet);
    return { insertedId: newFleet._id };
}

export async function deleteFleet(id) {
    const index = dummyFleets.findIndex(fleet => fleet._id === id);
    if (index > -1) {
        dummyFleets.splice(index, 1);
        return { deletedCount: 1 };
    }
    return { deletedCount: 0 };
}

export async function updateFleet(id, updates) {
    const fleet = dummyFleets.find(f => f._id === id);
    if (fleet) {
        Object.assign(fleet, updates, { updatedAt: new Date() });
        return { modifiedCount: 1 };
    }
    return { modifiedCount: 0 };
}