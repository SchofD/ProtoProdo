<!-- src/routes/+page.svelte -->
<script>
    const introText = `
Empire at War Expanded: Thrawn's Revenge ist eine umfassende Total-Conversion-Mod für das Echtzeit-Strategiespiel Star Wars: Empire at War – Forces of Corruption. 
Sie versetzt Spieler in das Star Wars Legends-Universum nach der Schlacht von Endor (4 ABY) und deckt Ereignisse bis zum Pellaeon-Gavrisom-Vertrag (19 ABY) ab. 
Hier kann man seine eigenen Flotten erstellen und vergleichen.
    `;
</script>

<svelte:head>
    <title>Fleet Builder - Empire at War Expanded</title>
</svelte:head>

<div class="homepage-container d-flex flex-column justify-content-center align-items-center text-center px-4">

    <!-- Dunkle Box -->
    <div class="content-box p-4 p-md-5 rounded shadow-lg">
        <!-- Titel -->
        <h1 class="display-3 fw-bold mb-3 text-white">Empire at War Expanded</h1>

        <!-- Subtitel -->
        <h1 class="display-3 fw-bold mb-4 text-white">Thrawn's Revenge</h1>

        <!-- Text -->
        <p class="lead text-light mb-4" style="max-width: 800px; white-space: pre-line;">
            {introText}
        </p>

        <!-- Buttons -->
        <div class="d-flex flex-wrap justify-content-center gap-3">
            <a href="/ships" class="btn btn-primary btn-lg px-4">
                Schiffe
            </a>
            <a href="/builder" class="btn btn-outline-light btn-lg px-4">
                Flotte erstellen
            </a>
        </div>
    </div>

</div>

<style>
    .homepage-container {
        min-height: 100vh;
        background: url('/EAWX.webp') no-repeat center center;
        background-size: cover;
        padding-top: 80px; /* Platz für Navbar */
        padding-bottom: 80px;
    }

    .content-box {
        background-color: rgba(0, 0, 0, 0.7); /* dunkle, leicht transparente Box */
        max-width: 1000px;
    }

    h1 {
        color: #fff;
    }

    p.lead {
        font-size: 1.25rem;
    }

    .btn {
        font-size: 1.1rem;
    }
</style>
