async function initSite() {
    var map = L.map('map').setView([48.8566, 2.3522], 10);
    
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
    }).addTo(map);
    
    // Créer le groupe de clusters
    var markers = L.markerClusterGroup();
    
    try {
        const response = await fetch("geo-boulangeries-ble-idf.json");
        const allData = await response.json();
        
        console.log(`${allData.length} boulangeries chargées`);
        
        allData.forEach(boulangerie => {
            if (boulangerie.latitude && boulangerie.longitude) {
                const marker = L.marker([boulangerie.latitude, boulangerie.longitude]);
                
                marker.bindPopup(`
                    <h3>${boulangerie.nom || 'Sans nom'}</h3>
                    <p>${boulangerie.adresse || ''}<br>${boulangerie.ville || ''}</p>
                `);
                markers.addLayer(marker);
            }
        });
        
        // Ajouter tous les marqueurs à la carte
        map.addLayer(markers);
        
    } catch (e) {
        console.error("Erreur de chargement :", e);
    }
}

initSite();
