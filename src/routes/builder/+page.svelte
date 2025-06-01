<!-- src/routes/builder/+page.svelte -->
<script>
    import { writable, derived } from 'svelte/store';
    import { goto } from '$app/navigation';

    const { data } = $props();

    // States
    const ships = writable(data.ships);
    const factions = writable(data.factions);
    const functions = writable(data.functions);

    // Fleet building states
    const fleetName = writable('');
    const fleetDescription = writable('');
    const selectedShips = writable([]); // Array of {ship, quantity}
    const searchTerm = writable('');
    const selectedFaction = writable('');
    const selectedFunction = writable('');

    // Derived: Gesamtpopulation und Kosten der aktuellen Flotte
    const fleetStats = derived(selectedShips, ($selectedShips) => {
        const totalPopulation = $selectedShips.reduce((sum, item) => {
            return sum + (parseInt(item.ship['Pop Verbrauch']) || 0) * item.quantity;
        }, 0);
        
        const totalCost = $selectedShips.reduce((sum, item) => {
            return sum + (parseInt(item.ship.Kosten) || 0) * item.quantity;
        }, 0);
        
        const totalShips = $selectedShips.reduce((sum, item) => sum + item.quantity, 0);
        
        return { totalPopulation, totalCost, totalShips };
    });

    // Derived: Gefilterte Schiffe
    const filteredShips = derived(
        [ships, searchTerm, selectedFaction, selectedFunction],
        ([$ships, $searchTerm, $selectedFaction, $selectedFunction]) => {
            return $ships.filter(ship => {
                const nameMatch = ship['Ship Name']?.toLowerCase().includes($searchTerm.toLowerCase());
                const factionMatch = $selectedFaction
                    ? ship.Fraktion?.includes($selectedFaction)
                    : true;
                const functionMatch = $selectedFunction
                    ? ship.Funktion?.trim() === $selectedFunction.trim()
                    : true;
                return nameMatch && factionMatch && functionMatch;
            });
        }
    );

    // Funktionen
    function addShipToFleet(ship) {
        selectedShips.update(current => {
            const existing = current.find(item => item.ship._id === ship._id);
            if (existing) {
                // Prüfe ob hinzufügen möglich ist (Population Limit)
                const newPopulation = $fleetStats.totalPopulation + parseInt(ship['Pop Verbrauch'] || 0);
                if (newPopulation <= 300) {
                    existing.quantity += 1;
                }
            } else {
                // Neues Schiff hinzufügen wenn Population erlaubt
                const newPopulation = $fleetStats.totalPopulation + parseInt(ship['Pop Verbrauch'] || 0);
                if (newPopulation <= 300) {
                    current.push({ ship, quantity: 1 });
                }
            }
            return current;
        });
    }

    function removeShipFromFleet(shipId) {
        selectedShips.update(current => {
            const existing = current.find(item => item.ship._id === shipId);
            if (existing) {
                existing.quantity -= 1;
                if (existing.quantity <= 0) {
                    return current.filter(item => item.ship._id !== shipId);
                }
            }
            return current;
        });
    }

    function removeAllShipsOfType(shipId) {
        selectedShips.update(current => {
            return current.filter(item => item.ship._id !== shipId);
        });
    }

    async function saveFleet() {
        if (!$fleetName.trim()) {
            alert('Bitte gib einen Namen für die Flotte ein.');
            return;
        }

        if ($selectedShips.length === 0) {
            alert('Bitte füge mindestens ein Schiff zur Flotte hinzu.');
            return;
        }

        const fleetData = {
            name: $fleetName.trim(),
            description: $fleetDescription.trim(),
            ships: $selectedShips.map(item => ({
                shipId: item.ship._id,
                shipName: item.ship['Ship Name'],
                quantity: item.quantity,
                populationPerShip: parseInt(item.ship['Pop Verbrauch']) || 0,
                costPerShip: parseInt(item.ship.Kosten) || 0
            })),
            totalPopulation: $fleetStats.totalPopulation,
            totalCost: $fleetStats.totalCost,
            totalShips: $fleetStats.totalShips
        };

        try {
            const response = await fetch('/api/fleets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(fleetData)
            });

            if (response.ok) {
                const result = await response.json();
                alert('Flotte erfolgreich gespeichert!');
                goto(`/fleets/${result.fleetId}`);
            } else {
                alert('Fehler beim Speichern der Flotte.');
            }
        } catch (error) {
            console.error('Error saving fleet:', error);
            alert('Fehler beim Speichern der Flotte.');
        }
    }

    function formatNumber(num) {
        if (!num) return '0';
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    function getPopulationColor(population) {
        if (population > 300) return 'danger';
        if (population > 250) return 'warning';
        if (population > 200) return 'info';
        return 'success';
    }
</script>

<svelte:head>
    <title>Flotte erstellen - Fleet Builder</title>
</svelte:head>

<div class="container-fluid mt-4">
    <div class="row">
        <!-- Linke Spalte: Schiffe auswählen -->
        <div class="col-lg-8">
            <div class="card">
                <div class="card-header">
                    <h3 class="mb-0">
                        <i class="bi bi-collection"></i>
                        Schiffe auswählen
                    </h3>
                </div>
                <div class="card-body">
                    <!-- Filter -->
                    <div class="row mb-3">
                        <div class="col-md-4">
                            <input
                                type="text"
                                placeholder="Schiffsname suchen..."
                                bind:value={$searchTerm}
                                class="form-control"
                            />
                        </div>
                        <div class="col-md-4">
                            <select bind:value={$selectedFaction} class="form-select">
                                <option value="">Alle Fraktionen</option>
                                {#each $factions as faction}
                                    <option value={faction}>{faction}</option>
                                {/each}
                            </select>
                        </div>
                        <div class="col-md-4">
                            <select bind:value={$selectedFunction} class="form-select">
                                <option value="">Alle Funktionen</option>
                                {#each $functions as func}
                                    <option value={func}>{func}</option>
                                {/each}
                            </select>
                        </div>
                    </div>

                    <!-- Schiffe Grid -->
                    <div class="row" style="max-height: 600px; overflow-y: auto;">
                        {#each $filteredShips as ship (ship._id)}
                            <div class="col-md-6 col-xl-4 mb-3">
                                <div class="card ship-card h-100">
                                    {#if ship.imageFilename}
                                        <img src={`/ships/${ship.imageFilename}`} alt={ship['Ship Name']} class="card-img-top" style="height: 120px; object-fit: cover;" />
                                    {:else}
                                        <div class="card-img-top bg-secondary d-flex align-items-center justify-content-center" style="height: 120px;">
                                            <span class="text-white-50">Kein Bild</span>
                                        </div>
                                    {/if}
                                    <div class="card-body p-2">
                                        <h6 class="card-title mb-1">{ship['Ship Name']}</h6>
                                        <div class="d-flex justify-content-between align-items-center mb-2">
                                            <small class="text-muted">{ship.Funktion}</small>
                                            <span class="badge bg-{getPopulationColor(parseInt(ship['Pop Verbrauch']))}">{ship['Pop Verbrauch']} Pop</span>
                                        </div>
                                        <div class="d-flex justify-content-between align-items-center">
                                            <small class="text-warning">{formatNumber(ship.Kosten)} Credits</small>
                                            <button 
                                                class="btn btn-success btn-sm"
                                                onclick={() => addShipToFleet(ship)}
                                                disabled={$fleetStats.totalPopulation + parseInt(ship['Pop Verbrauch'] || 0) > 300}
                                                aria-label="Schiff zur Flotte hinzufügen"
                                            >
                                                <i class="bi bi-plus"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        {:else}
                            <div class="col-12 text-center text-muted py-4">
                                <p>Keine Schiffe gefunden.</p>
                            </div>
                        {/each}
                    </div>
                </div>
            </div>
        </div>

        <!-- Rechte Spalte: Flotte zusammenstellen -->
        <div class="col-lg-4">
            <div class="card position-sticky" style="top: 20px;">
                <div class="card-header">
                    <h3 class="mb-0">
                        <i class="bi bi-flag"></i>
                        Flotte erstellen
                    </h3>
                </div>
                <div class="card-body">
                    <!-- Flotten Name und Beschreibung -->
                    <div class="mb-3">
                        <label for="fleetName" class="form-label">Flottenname</label>
                        <input 
                            type="text" 
                            id="fleetName"
                            class="form-control" 
                            bind:value={$fleetName}
                            placeholder="z.B. Katana Fleet"
                            maxlength="50"
                        />
                    </div>
                    
                    <div class="mb-3">
                        <label for="fleetDesc" class="form-label">Beschreibung</label>
                        <textarea 
                            id="fleetDesc"
                            class="form-control" 
                            bind:value={$fleetDescription}
                            placeholder="Beschreibung der Flotte..."
                            rows="3"
                            maxlength="200"
                        ></textarea>
                    </div>

                    <!-- Flotten Statistiken -->
                    <div class="mb-4">
                        <h5>Flotten-Statistiken</h5>
                        <div class="row text-center">
                            <div class="col-4">
                                <div class="stat-card">
                                    <i class="bi bi-collection text-info"></i>
                                    <div class="fw-bold">{$fleetStats.totalShips}</div>
                                    <small class="text-muted">Schiffe</small>
                                </div>
                            </div>
                            <div class="col-4">
                                <div class="stat-card">
                                    <i class="bi bi-currency-dollar text-warning"></i>
                                    <div class="fw-bold">{formatNumber($fleetStats.totalCost)}</div>
                                    <small class="text-muted">Kosten</small>
                                </div>
                            </div>
                            <div class="col-4">
                                <div class="stat-card">
                                    <i class="bi bi-people text-{getPopulationColor($fleetStats.totalPopulation)}"></i>
                                    <div class="fw-bold text-{getPopulationColor($fleetStats.totalPopulation)}">{$fleetStats.totalPopulation}</div>
                                    <small class="text-muted">Population</small>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Population Progress Bar -->
                        <div class="mt-3">
                            <div class="d-flex justify-content-between align-items-center mb-1">
                                <small class="text-muted">Population Limit</small>
                                <small class="text-muted">{$fleetStats.totalPopulation}/300</small>
                            </div>
                            <div class="progress" style="height: 10px;">
                                <div 
                                    class="progress-bar bg-{getPopulationColor($fleetStats.totalPopulation)}" 
                                    style="width: {Math.min($fleetStats.totalPopulation / 300 * 100, 100)}%"
                                ></div>
                            </div>
                        </div>
                    </div>

                    <!-- Ausgewählte Schiffe -->
                    <div class="mb-4">
                        <h5>Ausgewählte Schiffe ({$selectedShips.length})</h5>
                        <div style="max-height: 300px; overflow-y: auto;">
                            {#each $selectedShips as item (item.ship._id)}
                                <div class="selected-ship-item mb-2">
                                    <div class="d-flex align-items-center">
                                        <div class="flex-grow-1">
                                            <div class="fw-bold">{item.ship['Ship Name']}</div>
                                            <small class="text-muted">
                                                {item.quantity}x - {formatNumber(parseInt(item.ship.Kosten) * item.quantity)} Credits
                                                - {parseInt(item.ship['Pop Verbrauch']) * item.quantity} Pop
                                            </small>
                                        </div>
                                        <div class="btn-group btn-group-sm">
                                            <button 
                                                class="btn btn-outline-secondary"
                                                onclick={() => removeShipFromFleet(item.ship._id)}
                                                aria-label="Schiff entfernen"
                                            >
                                                <i class="bi bi-dash"></i>
                                            </button>
                                            <button 
                                                class="btn btn-outline-success"
                                                onclick={() => addShipToFleet(item.ship)}
                                                disabled={$fleetStats.totalPopulation + parseInt(item.ship['Pop Verbrauch'] || 0) > 300}
                                                aria-label="Schiff hinzufügen"
                                            >
                                                <i class="bi bi-plus"></i>
                                            </button>
                                            <button 
                                                class="btn btn-outline-danger"
                                                onclick={() => removeAllShipsOfType(item.ship._id)}
                                                aria-label="Alle Schiffe dieses Typs entfernen"
                                            >
                                                <i class="bi bi-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            {:else}
                                <div class="text-center text-muted py-3">
                                    <i class="bi bi-ship"></i>
                                    <p class="mb-0">Noch keine Schiffe ausgewählt</p>
                                </div>
                            {/each}
                        </div>
                    </div>

                    <!-- Aktionen -->
                    <div class="d-grid gap-2">
                        <button 
                            class="btn btn-primary"
                            onclick={saveFleet}
                            disabled={!$fleetName.trim() || $selectedShips.length === 0}
                        >
                            <i class="bi bi-save"></i>
                            Flotte speichern
                        </button>
                        <a href="/fleets" class="btn btn-outline-secondary">
                            <i class="bi bi-arrow-left"></i>
                            Zurück zu Flotten
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .ship-card {
        transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        cursor: pointer;
    }
    
    .ship-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    
    .stat-card {
        padding: 1rem 0.5rem;
        background-color: rgba(var(--bs-secondary-rgb), 0.1);
        border-radius: 0.375rem;
        border: 1px solid rgba(var(--bs-border-color-translucent));
    }
    
    .stat-card i {
        font-size: 1.25rem;
        margin-bottom: 0.25rem;
    }
    
    .selected-ship-item {
        padding: 0.75rem;
        background-color: rgba(var(--bs-primary-rgb), 0.1);
        border-radius: 0.375rem;
        border: 1px solid rgba(var(--bs-primary-rgb), 0.2);
    }
    
    .progress {
        background-color: rgba(var(--bs-secondary-rgb), 0.25);
    }
</style>