let map;
let allBakeries = [];
let markersLayer;
let markerRefs = new Map();

async function initSite() {
    
    map = L.map('map').setView([48.8566, 2.3522], 10);
    
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    
    const CroissantIcon = L.Icon.extend({
        options: {
            iconSize: [30, 30],
            iconAnchor: [15, 30],
            popupAnchor: [0, -30]
        }
    });

    const croissantIcon = new CroissantIcon({
        iconUrl: 'img/PingIndividuel.png'
    });

    
    markersLayer = L.markerClusterGroup();

    try {

        const response = await fetch("geo-boulangeries-ble-idf.json");
        allBakeries = await response.json();
        
        console.log(`${allBakeries.length} boulangeries chargées`);

        animateNumber("stat-count", 0, allBakeries.length, 2000, "");    
        animateNumber("stat-dept", 0, 8, 1500, "");                 
        animateNumber("stat-artisan", 0, 100, 2000, "%");           

        allBakeries.forEach((bakery, index) => {
            if (bakery.latitude && bakery.longitude) {
                const marker = L.marker(
                    [bakery.latitude, bakery.longitude],
                    { icon: croissantIcon }
                );

                marker.bindPopup(`
                    <div class="popup-header">${bakery.nom || 'Sans nom'}</div>
                    <div class="popup-body">
                        <p><strong>📍 Adresse:</strong><br>${bakery.adresse || 'Non renseignée'}</p>
                        <p><strong>🏙️ Ville:</strong> ${bakery.ville || 'Non renseignée'}</p>
                    </div>
                `);

                markersLayer.addLayer(marker);
                markerRefs.set(index, marker);
            }
        });

        map.addLayer(markersLayer);

        initSearch();
        setupMobileMenu(); 

    } catch (e) {
        console.error("Erreur de chargement :", e);
    }
}

function animateNumber(id, start, end, duration, suffix = "") {
    const obj = document.getElementById(id);
    if (!obj) return;
    
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        
        const currentVal = Math.floor(progress * (end - start) + start);
        obj.innerHTML = currentVal + suffix;
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

function setupMobileMenu() {
    const btn = document.getElementById('mobile-menu');
    const nav = document.querySelector('.nav-links');

    if (btn && nav) {
        btn.addEventListener('click', () => {
            btn.classList.toggle('is-active');
            nav.classList.toggle('active');
            console.log("État du menu :", nav.classList.contains('active') ? "Ouvert" : "Fermé");
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                btn.classList.remove('is-active');
                nav.classList.remove('active');
            });
        });
    }
}

function initSearch() {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');

    if(!searchInput || !searchResults) return;

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim().toLowerCase();

        if (query.length < 2) {
            searchResults.classList.remove('active');
            return;
        }

        const results = allBakeries
            .map((bakery, index) => ({ ...bakery, originalIndex: index }))
            .filter(bakery => 
                bakery.ville && 
                bakery.ville.toLowerCase().includes(query)
            );

        displaySearchResults(results, searchResults);
    });

    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.classList.remove('active');
        }
    });
}

function displaySearchResults(results, container) {
    if (results.length === 0) {
        container.innerHTML = '<div class="no-results">Aucune boulangerie trouvée dans cette ville</div>';
        container.classList.add('active');
        return;
    }

    container.innerHTML = results.map(bakery => `
        <div class="search-result-item" data-index="${bakery.originalIndex}">
            <div class="result-name">${bakery.nom || 'Sans nom'}</div>
            <div class="result-address">${bakery.adresse || ''} - ${bakery.ville || ''}</div>
        </div>
    `).join('');

    container.classList.add('active');

    container.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', () => {
            const index = parseInt(item.dataset.index);
            focusOnBakery(index);
            container.classList.remove('active');
        });
    });
}

function focusOnBakery(index) {
    const bakery = allBakeries[index];
    const marker = markerRefs.get(index);

    if (bakery && marker) {
        map.setView([bakery.latitude, bakery.longitude], 17, {
            animate: true,
            duration: 0.5
        });

        setTimeout(() => {
            markersLayer.zoomToShowLayer(marker, () => {
                marker.openPopup();
            });
        }, 600);
    }
}

window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (header) {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
});

initSite();
