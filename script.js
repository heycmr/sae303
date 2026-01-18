let map;
let toutesLesBoulangeries = [];
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
        toutesLesBoulangeries = await response.json();
        
        console.log(`${toutesLesBoulangeries.length} boulangeries chargées`);

        animateNumber("stat-count", 0, toutesLesBoulangeries.length, 2000, "");    
        animateNumber("stat-dept", 0, 8, 1500, "");                 
        animateNumber("stat-artisan", 0, 100, 2000, "%");           

        toutesLesBoulangeries.forEach((boulangerie, index) => {
            if (boulangerie.latitude && boulangerie.longitude) {
                const marker = L.marker(
                    [boulangerie.latitude, boulangerie.longitude],
                    { icon: croissantIcon }
                );

                // Déterminer la catégorie selon le score
                const score = boulangerie.result_score || 0;
                let categorie = '';
                let classeCategorie = '';

                if (score > 0.9) {
                    categorie = '⭐ Excellente';
                    classeCategorie = 'excellente';
                } else if (score >= 0.8) {
                    categorie = '✨ Très bonne';
                    classeCategorie = 'tres-bonne';
                } else if (score >= 0.7) {
                    categorie = '👍 Bonne';
                    classeCategorie = 'bonne';
                } else {
                    categorie = '➖ Moyenne';
                    classeCategorie = 'moyenne';
                }

                marker.bindPopup(`
                    <div class="popup-header">${boulangerie.nom || 'Sans nom'}</div>
                    <div class="popup-body">
                        <div class="popup-info">
                            <span class="popup-label">Adresse</span>
                            <span class="popup-value">${boulangerie.adresse || 'Non renseignée'}</span>
                        </div>
                        <div class="popup-info">
                            <span class="popup-label">Ville</span>
                            <span class="popup-value">${boulangerie.ville || 'Non renseignée'}</span>
                        </div>
                        <div class="popup-score">
                            <span class="popup-label">Qualité</span>
                            <div class="score-badge ${classeCategorie}">
                                ${categorie} <span class="score-number">(${score.toFixed(2)})</span>
                            </div>
                        </div>
                    </div>
                `);

                markersLayer.addLayer(marker);
                markerRefs.set(index, marker);
            }
        });

        map.addLayer(markersLayer);

        initSearch();
        setupMobileMenu(); 
        afficherJaugeQualite();

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

        const results = toutesLesBoulangeries
            .map((boulangerie, index) => ({ ...boulangerie, originalIndex: index }))
            .filter(boulangerie => 
                boulangerie.ville && 
                boulangerie.ville.toLowerCase().includes(query)
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

    container.innerHTML = results.map(boulangerie => `
        <div class="search-result-item" data-index="${boulangerie.originalIndex}">
            <div class="result-name">${boulangerie.nom || 'Sans nom'}</div>
            <div class="result-address">${boulangerie.adresse || ''} - ${boulangerie.ville || ''}</div>
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
    const boulangerie = toutesLesBoulangeries[index];
    const marker = markerRefs.get(index);

    if (boulangerie && marker) {
        // Scroll vers la carte avec un offset pour mieux la voir
        const mapSection = document.getElementById('map-section');
        const yOffset = 100; // Décalage pour descendre un peu plus
        const y = mapSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
        
        window.scrollTo({ top: y, behavior: 'smooth' });
        
        // Attendre que le scroll soit terminé avant de zoomer
        setTimeout(() => {
            map.setView([boulangerie.latitude, boulangerie.longitude], 17, {
                animate: true,
                duration: 0.5
            });
            setTimeout(() => {
                markersLayer.zoomToShowLayer(marker, () => {
                    marker.openPopup();
                });
            }, 600);
        }, 800);
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

// jauge pour la qualité
async function afficherJaugeQualite() {
    const ctx = document.getElementById('qualityChart');
    
    if (!ctx) {
        console.error("Élément #qualityChart introuvable");
        return;
    }

    try {
        const boulangeries = toutesLesBoulangeries.length > 0 
            ? toutesLesBoulangeries 
            : await fetch("geo-boulangeries-ble-idf.json").then(r => r.json());
        
        let excellentes = 0;    
        let tresBonnes = 0;     
        let bonnes = 0;         
        let moyennes = 0;       
        
        boulangeries.forEach(boulangerie => {
            const score = boulangerie.result_score;
            
            if (score !== null && score !== undefined) {
                if (score > 0.9) {
                    excellentes++;
                } else if (score >= 0.8) {
                    tresBonnes++;
                } else if (score >= 0.7) {
                    bonnes++;
                } else {
                    moyennes++;
                }
            }
        });
        
        console.log('📊 Répartition qualité:', { excellentes, tresBonnes, bonnes, moyennes });
        
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [
                    '⭐ Excellentes', 
                    '✨ Très bonnes', 
                    '👍 Bonnes', 
                    '➖ Moyennes'
                ],
                datasets: [{
                    label: 'Nombre de boulangeries',
                    data: [excellentes, tresBonnes, bonnes, moyennes],
                    backgroundColor: [
                        '#2ecc71',   
                        '#3498db',   
                        '#f39c12',  
                        '#e74c3c'    
                    ],
                    borderColor: [
                        '#27ae60',   
                        '#2980b9',   
                        '#e67e22',   
                        '#c0392b'   
                    ],
                    borderWidth: 2,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: false 
                    },
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: '#1a1a1a', 
                        titleColor: '#d4a574',      
                        bodyColor: '#faf8f5',       
                        titleFont: {
                            family: "'Lato', sans-serif",
                            size: 14
                        },
                        bodyFont: {
                            family: "'Lato', sans-serif",
                            size: 13
                        },
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                const total = excellentes + tresBonnes + bonnes + moyennes;
                                const pourcentage = ((context.parsed.y / total) * 100).toFixed(1);
                                return `${context.parsed.y} boulangeries (${pourcentage}%)`;
                            },
                            title: function(context) {
                                const labels = {
                                    0: '⭐ Excellentes (score > 0.9)',
                                    1: '✨ Très bonnes (0.8 - 0.9)',
                                    2: '👍 Bonnes (0.7 - 0.8)',
                                    3: '➖ Moyennes (< 0.7)'
                                };
                                return labels[context[0].dataIndex];
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Nombre de boulangeries',
                            font: {
                                family: "'Lato', sans-serif",
                                size: 13,
                                weight: '700'
                            },
                            color: '#b8915f' 
                        },
                        ticks: {
                            stepSize: 5,
                            font: {
                                family: "'Lato', sans-serif"
                            },
                            color: '#333' 
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)' 
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Catégorie de qualité (score)',
                            font: {
                                family: "'Lato', sans-serif",
                                size: 13,
                                weight: '700'
                            },
                            color: '#b8915f' 
                        },
                        ticks: {
                            font: {
                                family: "'Lato', sans-serif",
                                size: 11
                            },
                            color: '#333' 
                        },
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
        
    } catch (erreur) {
        console.error("Erreur chargement graphique:", erreur);
    }
}

initSite();
