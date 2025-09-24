let map;
let marker;

// 🔥 Configura Firebase
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig = {
    apiKey: "AIzaSyDXNa3EkAnqRVwyuUEfhthMJVK3YULEVjU",
    authDomain: "rastreador-bd145.firebaseapp.com",
    projectId: "rastreador-bd145",
    storageBucket: "rastreador-bd145.firebasestorage.app",
    messagingSenderId: "193680392707",
    appId: "1:193680392707:web:1dcd236ea9b3a5fb8e4436",
    measurementId: "G-Q5B5Q76FBX"
    };

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// 🗺️ Inicializa el mapa
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 13.7, lng: -88.1 },
    zoom: 8,
  });
}

// 💾 Guarda el IMEI
document.getElementById('imeiForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const imei = document.getElementById('imei').value.trim();

  if (/^\d{15}$/.test(imei)) {
    localStorage.setItem('imei', imei);
    document.getElementById('output').textContent = `IMEI guardado: ${imei}`;
  } else {
    document.getElementById('output').textContent = 'IMEI inválido. Debe tener 15 dígitos.';
  }
});

// 📍 Rastrea ubicación y guarda en Firebase
document.getElementById('trackBtn').addEventListener('click', function() {
  const imei = localStorage.getItem('imei');
  if (!imei) {
    document.getElementById('locationOutput').textContent = 'Primero debes guardar un IMEI válido.';
    return;
  }

  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      async function(position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const accuracy = position.coords.accuracy;

        document.getElementById('locationOutput').textContent =
          `Ubicación actual: Latitud ${lat}, Longitud ${lon} (Precisión: ±${Math.round(accuracy)} metros)`;

        const userLocation = { lat: lat, lng: lon };
        map.setCenter(userLocation);
        map.setZoom(15);

        if (marker) {
          marker.setMap(null);
        }

        marker = new google.maps.Marker({
          position: userLocation,
          map: map,
          title: "Tu ubicación",
        });

        // 🔄 Guarda en Firestore
        await db.collection("rastreo").doc(imei).set({
          latitud: lat,
          longitud: lon,
          precision: accuracy,
          timestamp: new Date()
        });
      },
      function(error) {
        document.getElementById('locationOutput').textContent =
          'Error al obtener ubicación: ' + error.message;
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  } else {
    document.getElementById('locationOutput').textContent =
      'Geolocalización no disponible en este navegador.';
  }
});