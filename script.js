async function initSite() {
    var map = L.map('map').setView([48.8566, 2.3522], 10);
    
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    var CroissantIcon = L.Icon.extend({
        options: {
            iconSize: [30, 30], 
            iconAnchor: [15, 30], 
            popupAnchor: [0, -30] 
        }
    });

    var croissantIcon = new CroissantIcon({
        iconUrl: 'img/PingIndividuel.png'
    });

    var markers = L.markerClusterGroup();

    try {
        const response = await fetch("geo-boulangeries-ble-idf.json");
        const allData = await response.json();
        
        console.log(`${allData.length} boulangeries chargées`);
        document.getElementById("stat-count").textContent = allData.length;

        allData.forEach(boulangerie => {
            if (boulangerie.latitude && boulangerie.longitude) {
                const marker = L.marker(
                    [boulangerie.latitude, boulangerie.longitude],
                    { icon: croissantIcon }
                );

                marker.bindPopup(`
                    <div class="popup-header">${boulangerie.nom || 'Sans nom'}</div>
                    <div class="popup-body">
                        <p><strong>📍 Adresse:</strong><br>${boulangerie.adresse || 'Non renseignée'}</p>
                        <p><strong>🏙️ Ville:</strong> ${boulangerie.ville || 'Non renseignée'}</p>
                    </div>
                `);

                markers.addLayer(marker);
            }
        });

        map.addLayer(markers);

    } catch (e) {
        console.error("Erreur de chargement :", e);
    }
}

initSite();
