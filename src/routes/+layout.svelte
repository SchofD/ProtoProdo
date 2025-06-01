<!-- src/routes/+layout.svelte -->
<script>
    import { page } from '$app/stores';
    
    let { children } = $props();
</script>

<svelte:head>
    <title>Empire at War Expanded: Fleet Builder</title>
    <meta name="description" content="Build and manage your fleets from Thrawn's Revenge" />
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Bootstrap Icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">
</svelte:head>

<div class="min-vh-100 bg-dark text-light d-flex flex-column">
    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary py-2">
        <div class="container">
            <a class="navbar-brand fw-bold" href="/">
                Fleet Builder
            </a>
            
            <button 
                class="navbar-toggler" 
                type="button" 
                data-bs-toggle="collapse" 
                data-bs-target="#navbarNav"
                aria-label="Navigation umschalten"
            >
                <span class="navbar-toggler-icon"></span>
            </button>
            
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <a class="nav-link" href="/">
                            <i class="bi bi-house"></i> Home
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/ships">
                            <i class="bi bi-collection"></i> Schiffe
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/fleets">
                            <i class="bi bi-flag"></i> Flotten
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/builder">
                            <i class="bi bi-plus-circle"></i> Flotte erstellen
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <!-- Main Content -->
    <main class="container my-4 flex-grow-1">
        {@render children()}
    </main>

    <!-- Footer -->
    <footer class="bg-secondary text-center py-3 mt-auto">
        <div class="container">
            <p class="mb-0">
                Empire at War Expanded: Thrawn's Revenge Fleet Builder
                <br>
                <small class="text-muted">
                    Daten von <a href="https://thrawnsrevenge.fandom.com" class="text-info">Thrawn's Revenge Wiki</a>
                </small>
            </p>
        </div>
    </footer>
</div>

<style>
    :global(body) {
        background-color: #212529 !important;
        color: #ffffff !important;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    :global(.bg-primary) {
        background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%) !important;
    }

    :global(.card) {
        background-color: #343a40 !important;
        border: 1px solid #495057 !important;
    }

    :global(.card-body) {
        color: #ffffff !important;
    }

    :global(.card-header) {
        background-color: #2c2f33 !important;
        color: #ffffff !important;
    }

    :global(.btn-primary) {
        background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%) !important;
        border: none !important;
    }

    :global(.btn-primary:hover) {
        background: linear-gradient(135deg, #2a5298 0%, #1e3c72 100%) !important;
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    }

    :global(.navbar-brand) {
        font-size: 1.5rem;
    }

    /* Hover Effekt für Navbar-Links */
    :global(.navbar-nav .nav-link) {
        transition: color 0.2s ease, background-color 0.2s ease;
    }

    :global(.navbar-nav .nav-link:hover) {
        color: #ffc107 !important; /* Gelb/Orange */
    }

    /* Aktiver Link */
    :global(.nav-link.active) {
        background-color: rgba(255,255,255,0.1) !important;
        border-radius: 0.375rem;
    }

    /* Star Wars themed colors */
    :global(.text-empire) {
        color: #ff4444 !important;
    }

    :global(.text-rebel) {
        color: #4488ff !important;
    }

    :global(.text-neutral) {
        color: #ffaa44 !important;
    }

    :global(.bg-empire) {
        background-color: #ff4444 !important;
    }

    :global(.bg-rebel) {
        background-color: #4488ff !important;
    }

    :global(.bg-neutral) {
        background-color: #ffaa44 !important;
    }

    /* Besserer Badge Kontrast */
    :global(.badge) {
        color: #fff !important;
    }

    :global(.badge.bg-secondary),
    :global(.badge.bg-outline-secondary),
    :global(.badge.bg-light),
    :global(.badge.bg-outline-light),
    :global(.badge.bg-dark) {
        background-color: #6c757d !important;
        color: #fff !important;
    }

    :global(.text-muted) {
        color: #aaaaaa !important;
    }
</style>
