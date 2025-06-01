<!-- src/routes/fleets/[id]/+page.svelte -->
<script>
    import { goto } from '$app/navigation';

    let { data } = $props();
    let fleet = $state(data?.fleet);
    let ships = $state(data?.ships || []);

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

    async function deleteFleet() {
        if (!confirm(`Möchtest du die Flotte "${fleet.name}" wirklich löschen?`)) {
            return;
        }

        try {
            const response = await fetch(`/api/fleets/${fleet._id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert('Flotte erfolgreich gelöscht!');
                goto('/fleets');
            } else {
                alert('Fehler beim Löschen der Flotte.');
            }
        } catch (error) {
            console.error('Error deleting fleet:', error);
            alert('Fehler beim Löschen der Flotte.');
        }
    }

    // Finde das entsprechende Schiff aus der Schiffs-Datenbank für zusätzliche Details
    function getShipDetails(shipId) {
        return ships.find(ship => ship._id === shipId);
    }
</script>

<svelte:head>
    <title>{fleet?.name || 'Flotte'} - Fleet Builder</title>
</svelte:head>

<div class="container">
    <!-- Header -->
    <div class="row mb-4">
        <div class="col">
            <div class="d-flex justify-content-between align-items-start mb-3">
                <div>
                    <h1 class="display-5 mb-2">{fleet?.name}</h1>
                    {#if fleet?.description}
                        <p class="lead text-muted mb-0">{fleet.description}</p>
                    {/if}
                </div>
                <div>
                    <button class="btn btn-danger" onclick={deleteFleet}>
                        <i class="bi bi-trash"></i>
                        Löschen
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Flotten Statistiken -->
    <div class="row mb-4">
        <div class="col-md-4">
            <div class="card text-center">
                <div class="card-body">
                    <i class="bi bi-collection text-primary fs-1"></i>
                    <h3 class="card-title mt-2">{fleet?.totalShips || 0}</h3>
                    <p class="card-text text-muted">Schiffe</p>
                </div>
            </div>
        </div>
        
        <div class="col-md-4">
            <div class="card text-center">
                <div class="card-body">
                    <i class="bi bi-currency-dollar text-warning fs-1"></i>
                    <h3 class="card-title mt-2">{formatNumber(fleet?.totalCost || 0)}</h3>
                    <p class="card-text text-muted">Gesamtkosten</p>
                </div>
            </div>
        </div>
        
        <div class="col-md-4">
            <div class="card text-center">
                <div class="card-body">
                    <i class="bi bi-people text-{getPopulationColor(fleet?.totalPopulation || 0)} fs-1"></i>
                    <h3 class="card-title mt-2 text-{getPopulationColor(fleet?.totalPopulation || 0)}">
                        {fleet?.totalPopulation || 0}
                    </h3>
                    <p class="card-text text-muted">Population</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Population Progress Bar -->
    <div class="row mb-4">
        <div class="col-12">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">Population Auslastung</h5>
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span>Population</span>
                        <span class="fw-bold">{fleet?.totalPopulation || 0}/300</span>
                    </div>
                    <div class="progress mb-2" style="height: 20px;">
                        <div 
                            class="progress-bar bg-{getPopulationColor(fleet?.totalPopulation || 0)}" 
                            style="width: {Math.min((fleet?.totalPopulation || 0) / 300 * 100, 100)}%"
                        >
                            {Math.round((fleet?.totalPopulation || 0) / 300 * 100)}%
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Schiffe in der Flotte -->
    <div class="row mb-4">
        <div class="col-12">
            <div class="card">
                <div class="card-header">
                    <h5 class="mb-0">
                        <i class="bi bi-ship"></i>
                        Schiffe in der Flotte ({fleet?.ships?.length || 0})
                    </h5>
                </div>
                <div class="card-body">
                    {#if fleet?.ships && fleet.ships.length > 0}
                        <div class="row">
                            {#each fleet.ships as fleetShip (fleetShip.shipId)}
                                {@const shipDetails = getShipDetails(fleetShip.shipId)}
                                <div class="col-lg-6 col-xl-4 mb-3">
                                    <div class="card fleet-ship-card h-100">
                                        {#if shipDetails?.imageFilename}
                                            <img src={`/ships/${shipDetails.imageFilename}`} alt={fleetShip.shipName} class="card-img-top" style="height: 150px; object-fit: cover;" />
                                        {:else}
                                            <div class="card-img-top bg-secondary d-flex align-items-center justify-content-center" style="height: 150px;">
                                                <span class="text-white-50">Kein Bild</span>
                                            </div>
                                        {/if}
                                        <div class="card-body">
                                            <div class="d-flex justify-content-between align-items-start mb-2">
                                                <h6 class="card-title mb-0">{fleetShip.shipName}</h6>
                                                <span class="badge bg-primary">{fleetShip.quantity}x</span>
                                            </div>
                                            
                                            {#if shipDetails}
                                                <p class="card-text">
                                                    <small class="text-muted">
                                                        {shipDetails.Funktion}
                                                        {#if shipDetails.Fraktion}
                                                            • {shipDetails.Fraktion.join(', ')}
                                                        {/if}
                                                    </small>
                                                </p>
                                            {/if}

                                            <div class="row text-center g-2">
                                                <div class="col-6">
                                                    <div class="stat-mini">
                                                        <i class="bi bi-currency-dollar text-warning"></i>
                                                        <div class="fw-bold">{formatNumber(fleetShip.costPerShip * fleetShip.quantity)}</div>
                                                        <small class="text-muted">Kosten</small>
                                                    </div>
                                                </div>
                                                <div class="col-6">
                                                    <div class="stat-mini">
                                                        <i class="bi bi-people text-info"></i>
                                                        <div class="fw-bold">{fleetShip.populationPerShip * fleetShip.quantity}</div>
                                                        <small class="text-muted">Population</small>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="mt-3">
                                                {#if shipDetails}
                                                    <a href="/ships/{shipDetails._id}" class="btn btn-outline-primary btn-sm w-100">
                                                        <i class="bi bi-eye"></i>
                                                        Schiff Details
                                                    </a>
                                                {:else}
                                                    <button class="btn btn-outline-secondary btn-sm w-100" disabled>
                                                        Schiff nicht gefunden
                                                    </button>
                                                {/if}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            {/each}
                        </div>
                    {:else}
                        <div class="text-center py-4">
                            <i class="bi bi-ship display-1 text-muted"></i>
                            <h4 class="text-muted mt-3">Keine Schiffe in der Flotte</h4>
                            <p class="text-muted">Diese Flotte enthält keine Schiffe.</p>
                        </div>
                    {/if}
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .fleet-ship-card {
        transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    }
    
    .fleet-ship-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(0,0,0,0.15);
    }
    
    .stat-mini {
        padding: 0.5rem;
        background-color: rgba(var(--bs-secondary-rgb), 0.1);
        border-radius: 0.375rem;
        border: 1px solid rgba(var(--bs-border-color-translucent));
    }
    
    .stat-mini i {
        font-size: 1rem;
        margin-bottom: 0.25rem;
    }
    
    .progress {
        background-color: rgba(var(--bs-secondary-rgb), 0.25);
    }
    
    @media print {
        .btn {
            display: none !important;
        }
    }
</style>