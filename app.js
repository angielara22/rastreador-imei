let map;
let marker;

// Inicializa el mapa centrado en El Salvador
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 13.7, lng: -88.1 },
    zoom: 8,
  });
}

// Maneja el formulario de IMEI
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

// Maneja el rastreo de ubicación
document.getElementById('trackBtn').addEventListener('click', function() {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      function(position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        document.getElementById('locationOutput').textContent =
          `Ubicación actual: Latitud ${lat}, Longitud ${lon}`;

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
      },
      function(error) {
        document.getElementById('locationOutput').textContent =
          'Error al obtener ubicación: ' + error.message;
      }
    );
  } else {
    document.getElementById('locationOutput').textContent =
      'Geolocalización no disponible en este navegador.';
  }
});