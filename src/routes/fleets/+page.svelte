<!-- src/routes/fleets/+page.svelte -->
<script>
    let { data } = $props();

    let fleets = $state(data?.fleets || []);
    
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

    async function deleteFleet(fleetId, fleetName) {
        if (!confirm(`Möchtest du die Flotte "${fleetName}" wirklich löschen?`)) {
            return;
        }

        try {
            const response = await fetch(`/api/fleets/${fleetId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                // Entferne die Flotte aus der lokalen Liste
                fleets = fleets.filter(f => f._id !== fleetId);
                alert('Flotte erfolgreich gelöscht!');
            } else {
                alert('Fehler beim Löschen der Flotte.');
            }
        } catch (error) {
            console.error('Error deleting fleet:', error);
            alert('Fehler beim Löschen der Flotte.');
        }
    }
</script>

<svelte:head>
    <title>Flotten - Fleet Builder</title>
</svelte:head>

<div class="container-fluid">
    <!-- Header -->
    <div class="row mb-4">
        <div class="col-lg-8">
            <h1 class="display-6 mb-3">
                <i class="bi bi-flag"></i>
                Meine Flotten
            </h1>
            <p class="lead text-muted">
                Hier sind alle erstellten Flotten ersichtlich.
            </p>
        </div>
        <div class="col-lg-4 text-lg-end">
            <a href="/builder" class="btn btn-primary btn-lg">
                <i class="bi bi-plus-circle"></i>
                Neue Flotte erstellen
            </a>
        </div>
    </div>

    <!-- Flotten Grid -->
    {#if fleets.length > 0}
        <div class="row">
            {#each fleets as fleet (fleet._id)}
                <div class="col-lg-6 col-xl-4 mb-4">
                    <div class="card fleet-card h-100">
                        <div class="card-header">
                            <h5 class="card-title mb-0">{fleet.name}</h5>
                        </div>
                        
                        <div class="card-body d-flex flex-column">
                            {#if fleet.description}
                                <p class="card-text text-muted mb-3">{fleet.description}</p>
                            {/if}
                            
                            <!-- Flotten Statistiken -->
                            <div class="fleet-stats mb-3">
                                <div class="row g-2 text-center">
                                    <div class="col-4">
                                        <div class="stat-mini">
                                            <i class="bi bi-collection text-info"></i>
                                            <div class="stat-value">{fleet.ships?.reduce((total, ship) => total + (ship.quantity || 1), 0) || 0}</div>
                                            <div class="stat-label">Schiffe</div>
                                        </div>
                                    </div>
                                    
                                    <div class="col-4">
                                        <div class="stat-mini">
                                            <i class="bi bi-currency-dollar text-warning"></i>
                                            <div class="stat-value">{formatNumber(fleet.totalCost || 0)}</div>
                                            <div class="stat-label">Kosten</div>
                                        </div>
                                    </div>
                                    
                                    <div class="col-4">
                                        <div class="stat-mini">
                                            <i class="bi bi-people text-{getPopulationColor(fleet.totalPopulation || 0)}"></i>
                                            <div class="stat-value text-{getPopulationColor(fleet.totalPopulation || 0)}">
                                                {fleet.totalPopulation || 0}
                                            </div>
                                            <div class="stat-label">Population</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Population Progress Bar -->
                            <div class="mb-3">
                                <div class="d-flex justify-content-between align-items-center mb-1">
                                    <small class="text-muted">Population</small>
                                    <small class="text-muted">{fleet.totalPopulation || 0}/300</small>
                                </div>
                                <div class="progress" style="height: 8px;">
                                    <div 
                                        class="progress-bar bg-{getPopulationColor(fleet.totalPopulation || 0)}" 
                                        style="width: {Math.min((fleet.totalPopulation || 0) / 300 * 100, 100)}%"
                                    ></div>
                                </div>
                            </div>
                            
                            <!-- Schiffe Preview -->
                            {#if fleet.ships && fleet.ships.length > 0}
                                <div class="ships-preview mb-3 flex-grow-1">
                                    <small class="text-muted d-block mb-2">Schiffe in der Flotte:</small>
                                    <div class="ships-list">
                                        {#each fleet.ships.slice(0, 3) as shipInFleet}
                                            <div class="ship-preview-item">
                                                <span class="ship-name">{shipInFleet.shipName || 'Unbekanntes Schiff'}</span>
                                                {#if shipInFleet.quantity > 1}
                                                    <span class="ship-quantity">×{shipInFleet.quantity}</span>
                                                {/if}
                                            </div>
                                        {/each}
                                        {#if fleet.ships.length > 3}
                                            <div class="ship-preview-item text-muted">
                                                +{fleet.ships.length - 3} weitere...
                                            </div>
                                        {/if}
                                    </div>
                                </div>
                            {/if}
                            
                            <!-- Actions -->
                            <div class="card-actions mt-auto">
                                <div class="d-flex gap-2">
                                    <a href="/fleets/{fleet._id}" class="btn btn-primary btn-sm flex-grow-1">
                                        <i class="bi bi-eye"></i>
                                        Details
                                    </a>
                                    <button 
                                        class="btn btn-danger btn-sm"
                                        onclick={() => deleteFleet(fleet._id, fleet.name)}
                                    >
                                        <i class="bi bi-trash"></i>
                                        Löschen
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    {:else}
        <!-- Keine Flotten vorhanden -->
        <div class="row">
            <div class="col-12">
                <div class="card">
                    <div class="card-body text-center py-5">
                        <i class="bi bi-flag display-1 text-muted mb-4"></i>
                        <h3 class="text-muted mb-3">Noch keine Flotten erstellt</h3>
                        <p class="text-muted mb-4">
                            Erstelle deine erste Flotte und stelle deine Traumformation zusammen!
                        </p>
                        <a href="/builder" class="btn btn-primary btn-lg">
                            <i class="bi bi-plus-circle"></i>
                            Erste Flotte erstellen
                        </a>
                    </div>
                </div>
            </div>
        </div>
    {/if}
</div>

<style>
    .fleet-card {
        transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        border: 1px solid var(--bs-border-color);
        background-color: #404040 !important; /* Hellerer Hintergrund */
    }
    
    .fleet-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(0,0,0,0.15);
    }
    
    .fleet-card .card-header {
        background-color: #4a4a4a !important;
        border-bottom: 1px solid #555 !important;
    }
    
    .fleet-card .card-title {
        color: #ffffff !important;
        font-weight: 600;
    }
    
    .fleet-card .card-text {
        color: #e0e0e0 !important;
    }
    
    .stat-mini {
        padding: 0.75rem 0.5rem;
        background-color: #4a4a4a !important;
        border-radius: 0.375rem;
        border: 1px solid #606060 !important;
    }
    
    .stat-mini i {
        font-size: 1.25rem;
        margin-bottom: 0.25rem;
    }
    
    .stat-value {
        font-weight: 700;
        font-size: 1.1rem;
        margin-bottom: 0.25rem;
        color: #ffffff !important;
    }
    
    .stat-label {
        font-size: 0.75rem;
        color: #d0d0d0 !important;
    }
    
    .ships-list {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }
    
    .ship-preview-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.375rem 0.5rem;
        background-color: #4a5568 !important;
        border-radius: 0.25rem;
        font-size: 0.875rem;
        border: 1px solid #606060 !important;
        color: #ffffff !important;
    }
    
    .ship-name {
        flex-grow: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #ffffff !important;
    }
    
    .ship-quantity {
        font-weight: 600;
        color: #90cdf4 !important;
        margin-left: 0.5rem;
    }
    
    .progress {
        background-color: #555555 !important;
    }
    
    /* Bessere Lesbarkeit für kleine Texte */
    .text-muted {
        color: #c0c0c0 !important;
    }
    
    small.text-muted {
        color: #d0d0d0 !important;
    }
    
    /* Buttons bleiben unverändert für guten Kontrast */
    .btn-primary {
        background-color: #3182ce !important;
        border-color: #3182ce !important;
    }
    
    .btn-danger {
        background-color: #e53e3e !important;
        border-color: #e53e3e !important;
    }
</style>