<!-- src/routes/ships/[id]/+page.svelte -->
<script>
    let { data } = $props();
    let ship = $state(data.ship);

    function formatNumber(num) {
        if (!num) return '0';
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    function getFactionBadgeClass(faction) {
        if (!faction) return 'bg-secondary';

        const f = faction.toLowerCase();

        if (f.includes('new republic')) return 'bg-warning';
        if (f.includes('hapes consortium')) return 'bg-purple';
        if (f.includes('empire of the hand')) return 'bg-primary';
        if (f.includes('corporate sector authority')) return 'bg-info';
        if (f.includes('hutt')) return 'bg-success';
        if (f.includes('galactic empire')) return 'bg-success';
        if (f.includes('pentastar')) return 'bg-lightgrey';
        if (f.includes("zsinj")) return 'bg-warning text-dark';
        if (f.includes('greater maldrood')) return 'bg-danger';
        if (f.includes('eriadu')) return 'bg-dark text-light';

        return 'bg-secondary';
    }

    function getFunctionBadgeClass(func) {
        if (!func) return 'bg-secondary';

        const f = func.toLowerCase();

        if (f === 'corvette') return 'bg-success';
        if (f === 'light frigate') return 'bg-info';
        if (f === 'heavy frigate') return 'bg-primary';
        if (f === 'capital') return 'bg-warning';
        if (f === 'battlecruiser') return 'bg-purple';
        if (f === 'dreadnought') return 'bg-danger';

        return 'bg-secondary';
    }
</script>

<svelte:head>
    <title>{ship['Ship Name']} - Fleet Builder</title>
</svelte:head>

<div class="container">
    <!-- Zurück Button -->
    <div class="mb-4">
        <a href="/ships" class="btn btn-outline-light">
            <i class="bi bi-arrow-left"></i>
            Zurück zur Übersicht
        </a>
    </div>

    <!-- Schiff Header -->
    <div class="row mb-4">
        <div class="col">
            <h1 class="display-5 mb-2">{ship['Ship Name']}</h1>

            <div class="d-flex gap-2 mb-3 flex-wrap">
                <span class="badge {getFunctionBadgeClass(ship.Funktion)} fs-6">{ship.Funktion}</span>
                {#each ship.Fraktion as faction}
                    <span class="badge {getFactionBadgeClass(faction)} fs-6">{faction}</span>
                {/each}
            </div>

            {#if ship.imageFilename}
                <div class="mb-4 text-center">
                    <img src={`/ships/${ship.imageFilename}`} alt="{ship['Ship Name']}" class="img-fluid rounded shadow" style="max-height: 400px; object-fit: contain;" />
                </div>
            {/if}
        </div>
    </div>

    <div class="row">
        <!-- Hauptstatistiken -->
        <div class="col-lg-6 mb-4">
            <div class="card h-100">
                <div class="card-header">
                    <h5 class="mb-0">
                        <i class="bi bi-bar-chart"></i>
                        Grunddaten
                    </h5>
                </div>
                <div class="card-body">
                    <div class="row g-3">
                        <div class="col-sm-6">
                            <div class="stat-item">
                                <div class="stat-icon text-warning">
                                    <i class="bi bi-currency-dollar"></i>
                                </div>
                                <div>
                                    <div class="stat-label">Kosten</div>
                                    <div class="stat-value">{formatNumber(ship.Kosten)}</div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-sm-6">
                            <div class="stat-item">
                                <div class="stat-icon text-info">
                                    <i class="bi bi-people"></i>
                                </div>
                                <div>
                                    <div class="stat-label">Population</div>
                                    <div class="stat-value">{ship['Pop Verbrauch']}</div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-sm-6">
                            <div class="stat-item">
                                <div class="stat-icon text-secondary">
                                    <i class="bi bi-clock"></i>
                                </div>
                                <div>
                                    <div class="stat-label">Bauzeit</div>
                                    <div class="stat-value">{ship.Bauzeit} Sekunden</div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-sm-6">
                            <div class="stat-item">
                                <div class="stat-icon text-danger">
                                    <i class="bi bi-heart"></i>
                                </div>
                                <div>
                                    <div class="stat-label">Besatzung</div>
                                    <div class="stat-value">{ship.Besatzung}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Kampfstatistiken -->
        <div class="col-lg-6 mb-4">
            <div class="card h-100">
                <div class="card-header">
                    <h5 class="mb-0">
                        <i class="bi bi-shield"></i>
                        Kampfstatistiken
                    </h5>
                </div>
                <div class="card-body">
                    <div class="row g-3">
                        {#if ship.Energieschild}
                            <div class="col-sm-6">
                                <div class="stat-item">
                                    <div class="stat-icon text-primary">
                                        <i class="bi bi-shield-check"></i>
                                    </div>
                                    <div>
                                        <div class="stat-label">Energieschilde</div>
                                        <div class="stat-value">{formatNumber(ship.Energieschild)}</div>
                                    </div>
                                </div>
                            </div>
                        {/if}
                        
                        {#if ship.Trefferpunkte}
                            <div class="col-sm-6">
                                <div class="stat-item">
                                    <div class="stat-icon text-danger">
                                        <i class="bi bi-heart-fill"></i>
                                    </div>
                                    <div>
                                        <div class="stat-label">Trefferpunkte</div>
                                        <div class="stat-value">{formatNumber(ship.Trefferpunkte)}</div>
                                    </div>
                                </div>
                            </div>
                        {/if}
                        
                        {#if ship.Geschwindigkeit}
                            <div class="col-sm-6">
                                <div class="stat-item">
                                    <div class="stat-icon text-success">
                                        <i class="bi bi-speedometer2"></i>
                                    </div>
                                    <div>
                                        <div class="stat-label">Geschwindigkeit</div>
                                        <div class="stat-value">{ship.Geschwindigkeit}</div>
                                    </div>
                                </div>
                            </div>
                        {/if}
                    </div>
                    
                    {#if !ship.Energieschild && !ship.Trefferpunkte && !ship.Geschwindigkeit}
                        <div class="text-center text-muted py-4">
                            <i class="bi bi-info-circle"></i>
                            Keine Kampfstatistiken verfügbar
                        </div>
                    {/if}
                </div>
            </div>
        </div>
    </div>

    <!-- Bewaffnung -->
    {#if ship.Bewaffnung && ship.Bewaffnung.length > 0}
        <div class="row mb-4">
            <div class="col-12">
                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0">
                            <i class="bi bi-crosshair"></i>
                            Bewaffnung
                        </h5>
                    </div>
                    <div class="card-body">
                        <div class="row g-2">
                            {#each ship.Bewaffnung as weapon}
                                <div class="col-md-6 col-lg-4">
                                    <div class="weapon-item">
                                        <i class="bi bi-bullseye"></i>
                                        <span>{weapon}</span>
                                    </div>
                                </div>
                            {/each}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    {/if}
</div>

<style>
    .stat-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background-color: rgba(var(--bs-secondary-rgb), 0.1);
        border-radius: 0.5rem;
        border: 1px solid rgba(var(--bs-border-color-translucent));
    }

    .stat-icon {
        font-size: 1.5rem;
        width: 2.5rem;
        height: 2.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background-color: rgba(var(--bs-body-color-rgb), 0.1);
    }

    .weapon-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem;
        background-color: rgba(var(--bs-primary-rgb), 0.1);
        border-radius: 0.375rem;
        border: 1px solid rgba(var(--bs-primary-rgb), 0.2);
    }

    .weapon-item i {
        color: var(--bs-primary);
        font-size: 1.1rem;
    }

    /* Custom Purple */
    :global(.bg-purple) {
        background-color: #6f42c1 !important;
        color: #fff !important;
    }

    /* Custom LightGrey */
    :global(.bg-lightgrey) {
        background-color: #d3d3d3 !important;
        color: #000 !important;
    }

    @media print {
        .btn {
            display: none !important;
        }
    }
</style>

