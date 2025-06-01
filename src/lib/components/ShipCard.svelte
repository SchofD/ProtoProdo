<!-- src/lib/components/ShipCard.svelte -->
<script>
    let { 
        ship,
        showAddButton = false,
        showRemoveButton = false,
        quantity = 0,
        onAddShip = null,
        onRemoveShip = null
    } = $props();
    
    // Faction-spezifische Farben
    function getFactionColor(factions) {
        if (!factions || factions.length === 0) return 'secondary';
        
        const faction = factions[0].toLowerCase();
        if (faction.includes('empire') || faction.includes('imperial')) return 'danger';
        if (faction.includes('republic') || faction.includes('rebel')) return 'primary';
        if (faction.includes('cis') || faction.includes('separatist')) return 'warning';
        return 'secondary';
    }
    
    function addToFleet() {
        if (onAddShip) {
            onAddShip(ship);
        }
    }
    
    function removeFromFleet() {
        if (onRemoveShip) {
            onRemoveShip(ship);
        }
    }
    
    // Formatiere große Zahlen
    function formatNumber(num) {
        if (!num) return '0';
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
</script>

<div class="card ship-card h-100">
    <div class="card-body d-flex flex-column">
        <!-- Header mit Name und Typ -->
        <div class="d-flex justify-content-between align-items-start mb-2">
            <h5 class="card-title mb-1 flex-grow-1">{ship['Ship Name']}</h5>
            {#if quantity > 0}
                <span class="badge bg-success ms-2">{quantity}x</span>
            {/if}
        </div>
        
        <p class="card-text mb-2">
            <span class="badge bg-{getFactionColor(ship.Fraktion)} me-1">{ship.Funktion}</span>
        </p>

        <!-- Fraktionen -->
        <div class="mb-3">
            {#each ship.Fraktion as faction}
                <span class="badge bg-outline-{getFactionColor([faction])} me-1 mb-1">
                    {faction}
                </span>
            {/each}
        </div>

        <!-- Statistiken Grid -->
        <div class="stats-grid mb-3">
            <div class="row g-2 text-center">
                <div class="col-6">
                    <div class="stat-card">
                        <i class="bi bi-currency-dollar text-warning"></i>
                        <div>
                            <small class="text-muted d-block">Kosten</small>
                            <div class="fw-bold">{formatNumber(ship.Kosten)}</div>
                        </div>
                    </div>
                </div>
                
                <div class="col-6">
                    <div class="stat-card">
                        <i class="bi bi-people text-info"></i>
                        <div>
                            <small class="text-muted d-block">Population</small>
                            <div class="fw-bold">{ship['Pop Verbrauch']}</div>
                        </div>
                    </div>
                </div>
                
                <div class="col-6">
                    <div class="stat-card">
                        <i class="bi bi-clock text-secondary"></i>
                        <div>
                            <small class="text-muted d-block">Bauzeit</small>
                            <div class="fw-bold">{ship.Bauzeit}s</div>
                        </div>
                    </div>
                </div>
                
                <div class="col-6">
                    <div class="stat-card">
                        <i class="bi bi-heart text-danger"></i>
                        <div>
                            <small class="text-muted d-block">Besatzung</small>
                            <div class="fw-bold">{ship.Besatzung}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Kampfstatistiken -->
        {#if ship.Energieschild || ship.Trefferpunkte}
            <div class="combat-stats mb-3">
                <div class="row text-center g-2">
                    {#if ship.Energieschild}
                        <div class="col-6">
                            <div class="stat-card">
                                <i class="bi bi-shield text-primary"></i>
                                <div>
                                    <small class="text-muted d-block">Schilde</small>
                                    <div class="fw-bold small">{formatNumber(ship.Energieschild)}</div>
                                </div>
                            </div>
                        </div>
                    {/if}
                    
                    {#if ship.Trefferpunkte}
                        <div class="col-6">
                            <div class="stat-card">
                                <i class="bi bi-heart-fill text-danger"></i>
                                <div>
                                    <small class="text-muted d-block">Hull</small>
                                    <div class="fw-bold small">{formatNumber(ship.Trefferpunkte)}</div>
                                </div>
                            </div>
                        </div>
                    {/if}
                </div>
            </div>
        {/if}

        <!-- Bewaffnung -->
        {#if ship.Bewaffnung && ship.Bewaffnung.length > 0}
            <div class="weapons mb-3 flex-grow-1">
                <small class="text-muted d-block mb-2">Bewaffnung:</small>
                <div class="weapons-list">
                    {#each ship.Bewaffnung.slice(0, 2) as weapon}
                        <div class="weapon-tag">
                            <i class="bi bi-crosshair"></i>
                            <span class="weapon-name">{weapon}</span>
                        </div>
                    {/each}
                    {#if ship.Bewaffnung.length > 2}
                        <div class="weapon-tag text-muted">
                            <i class="bi bi-three-dots"></i>
                            <span>+{ship.Bewaffnung.length - 2} mehr</span>
                        </div>
                    {/if}
                </div>
            </div>
        {/if}

        <!-- Action Buttons -->
        <div class="card-actions mt-auto">
            <div class="d-flex gap-2 align-items-center">
                <a href="/ships/{ship._id}" class="btn btn-outline-primary btn-sm flex-grow-1">
                    <i class="bi bi-eye"></i>
                    Details
                </a>
                
                {#if showAddButton}
                    <button 
                        class="btn btn-success btn-sm"
                        onclick={addToFleet}
                        title="Zur Flotte hinzufügen"
                    >
                        <i class="bi bi-plus"></i>
                    </button>
                {/if}
                
                {#if showRemoveButton}
                    <button 
                        class="btn btn-danger btn-sm"
                        onclick={removeFromFleet}
                        title="Aus Flotte entfernen"
                    >
                        <i class="bi bi-dash"></i>
                    </button>
                {/if}
            </div>
        </div>
    </div>
</div>

<style>
    .ship-card {
        transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        border: 1px solid var(--bs-border-color);
    }
    
    .ship-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(0,0,0,0.15);
    }
    
    .stat-card {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem;
        background-color: rgba(var(--bs-secondary-rgb), 0.1);
        border-radius: 0.375rem;
        border: 1px solid rgba(var(--bs-border-color-translucent));
    }
    
    .stat-card i {
        font-size: 1.1rem;
        flex-shrink: 0;
    }
    
    .weapons-list {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }
    
    .weapon-tag {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.25rem 0.5rem;
        background-color: rgba(var(--bs-primary-rgb), 0.1);
        border-radius: 0.25rem;
        font-size: 0.875rem;
        border: 1px solid rgba(var(--bs-primary-rgb), 0.2);
    }
    
    .weapon-tag i {
        font-size: 0.75rem;
        flex-shrink: 0;
    }
    
    .weapon-name {
        flex-grow: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    
    .badge {
        font-size: 0.75rem;
    }
    
    .card-title {
        font-size: 1.1rem;
        line-height: 1.3;
    }
    
    .btn-sm {
        font-size: 0.875rem;
        padding: 0.375rem 0.75rem;
    }
</style>