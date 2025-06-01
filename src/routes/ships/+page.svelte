<!-- src/routes/ships/+page.svelte -->
<script>
    import { writable, derived } from 'svelte/store';

    const { data } = $props();

    const ships = writable(data.ships);
    const factions = writable(data.factions);
    const functions = writable(data.functions);

    const searchTerm = writable('');
    const selectedFaction = writable('');
    const selectedFunction = writable('');

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

    // === Farben ===

    function getFactionBadgeClass(faction) {
        if (!faction) return 'bg-secondary';

        const f = faction.toLowerCase();

        if (f.includes('new republic')) return 'bg-warning';
        if (f.includes('hapes consortium')) return 'bg-purple';
        if (f.includes('empire of the hand')) return 'bg-primary';
        if (f.includes('corporate sector authority')) return 'bg-info';
        if (f.includes('hutt')) return 'bg-success';
        if (f.includes('galactic empire')) return 'bg-success';
        if (f.includes('pentastar')) return 'bg-lightgrey'; // LightGrey → Custom
        if (f.includes("zsinj")) return 'bg-warning text-dark';
        if (f.includes('greater maldrood')) return 'bg-danger';
        if (f.includes('eriadu')) return 'bg-dark text-light'; // Sichtbar Dark

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
    <title>Schiffe - Fleet Builder</title>
</svelte:head>

<div class="container mt-4">

    <!-- Filter Section -->
    <div class="filters mb-4">
        <input
            type="text"
            placeholder="Schiffsname suchen..."
            bind:value={$searchTerm}
            class="form-control mb-2"
        />

        <select bind:value={$selectedFaction} class="form-select mb-2">
            <option value="">Alle Fraktionen</option>
            {#each $factions as faction}
                <option value={faction}>{faction}</option>
            {/each}
        </select>

        <select bind:value={$selectedFunction} class="form-select mb-2">
            <option value="">Alle Funktionen</option>
            {#each $functions as func}
                <option value={func}>{func}</option>
            {/each}
        </select>
    </div>

    <!-- Ships Grid -->
    <div class="row">
        {#each $filteredShips as ship (ship._id)}
            <div class="col-md-4 col-lg-3 mb-4">
                <a href={`/ships/${ship._id}`} class="text-decoration-none text-reset">
                    <div class="card h-100 text-center">
                        {#if ship.imageFilename}
                            <img src={`/ships/${ship.imageFilename}`} alt={ship['Ship Name']} class="card-img-top" style="height: 150px; object-fit: cover;" />
                        {:else}
                            <div class="card-img-top bg-secondary d-flex align-items-center justify-content-center" style="height: 150px;">
                                <span class="text-white-50">[ Kein Bild ]</span>
                            </div>
                        {/if}
                        <div class="card-body">
                            <h5 class="card-title">{ship['Ship Name']}</h5>

                            <!-- Badges -->
                            <div class="d-flex flex-wrap gap-1 mt-2 justify-content-center">
                                <span class="badge {getFunctionBadgeClass(ship.Funktion)}">{ship.Funktion}</span>
                                {#each ship.Fraktion as faction}
                                    <span class="badge {getFactionBadgeClass(faction)}">{faction}</span>
                                {/each}
                            </div>
                        </div>
                    </div>
                </a>
            </div>
        {:else}
            <div class="col-12 text-center text-muted">
                <p>Keine Schiffe gefunden.</p>
            </div>
        {/each}
    </div>

</div>

<style>
    .filters {
        max-width: 400px;
    }

    .card {
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
        cursor: pointer;
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
</style>

