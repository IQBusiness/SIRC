// inicializa variables globales
var map, lat, lng, latini, lngini;

localStorage.posicion = localStorage.posicion || '[]'; // variable que almacena en localStorage
var rute = JSON.parse(localStorage.posicion);
var nuevaPos;

// muestra ruta entre marcas anteriores y actuales
function Ruta(origen, destino) {
    map.drawRoute({
        origin: origen, // origen en coordenadas anteriores
        destination: destino, // destino en coordenadas del click o toque actual
        travelMode: 'walking',   // driving, bicycling or walking.
        strokeColor: '#0099ff',
        strokeOpacity: 0.6,
        strokeWeight: 5
    });
    map.addMarker({
        lat: destino[0],
        lng: destino[1],
        infoWindow: {
            content: '<p>Destino</p>'
            }
    }); // pone marcador en mapa
    map.setCenter(lat, lng); //centra el mapa en el ultimo marcador
} // fin de func Ruta //

function enlazarMarcador(e) {
    lat = e.latLng.lat(); // guarda coords para marca siguiente
    lng = e.latLng.lng();

    nuevaPos = [lat, lng];

    if (rute.length > 0) {
        Ruta(rute[rute.length - 1], nuevaPos);
//          map.fitZoom(); // Ajustar zoom para mostrar todos los marcadores en la vistaz
    } else {
        map.addMarker({
            lat: lat,
            lng: lng
        }); // pone marcador en mapa
    }
    rute.push(nuevaPos);
    localStorage.posicion = JSON.stringify(rute); // guardamos la ruta serializada en localStorage
} // fin de func enlazarMarcador

function geolocalizar() {
    GMaps.geolocate({
        success: function (position) {
            // si no existe ruta anterior es la ubicación actual
            if (rute.length === 0) {
                lat = position.coords.latitude; // guarda coords en lat y lng
                lng = position.coords.longitude;
                nuevaPos = [lat, lng];
                rute.push(nuevaPos);
                localStorage.posicion = JSON.stringify(rute); // serializa un objeto en un JSON
                // si existe la ruta es la posisión primera de nuestro array
            } else {
                lat = rute[0][0];
                lng = rute[0][1];
            }

            map = new GMaps({ // muestra mapa centrado en coords [lat, lng]
                el: '#map',
                lat: lat,
                lng: lng,
                click: enlazarMarcador,
                tap: enlazarMarcador
            });
            
            // si el Array posee un elemento agrega un marcador
            if (rute.length > 0) {
                map.addMarker({  // marcador en [lat, lng]
                    lat: rute[0][0],
                    lng: rute[0][1],
                    title: 'Tu ubicación',
                    infoWindow: {
                        content: '<p>Tu ubicación</p>'
                        }
                }); 
                latini = lat;  // marcador inicial, primer punto de la ruta
                lngini = lng; 
            }
            // si el Array tiene mas de un elemento utiliza la funcion Ruta para agregar las marcas
            // reproduce la ruta anterior //
            if (rute.length > 1) {
		    var i;
                for (i = 1; i < rute.length; i++) {
                    Ruta(rute[i - 1], rute[i]);
                }
//                  map.fitZoom(); // Ajustar zoom para mostrar todos los marcadores en la vista
            }
        },
        error: function (error) {
            alert('Geolocalización falla: ' + error.message);
        },
        not_supported: function () {
            alert('Su navegador no soporta geolocalización');
        }
    });

} // fin de func geolocalizar    

function limpiar() {
    if (map) {
        map.cleanRoute(); // borra la ruta
        map.removeMarkers(); // elimina marcadores
        if (latini && lngini) {
            map.addMarker({
                lat: latini,
                lng: lngini,
                title: 'Tu ubicación',
                infoWindow: {
                    content: '<p>Tu ubicación</p>'
                    }
            }); //posiciona marcador inicial
            map.setCenter(latini, lngini); //centra el mapa
        }
        rute = JSON.parse(localStorage.posicion); // deserializa un JSON en un objeto
        rute.splice(1, rute.length); // Elimina los elementos del array menos el primero
    }
} // fin func limpiar

function inicializar() {
//	 alert('inicializar');
    latini = undefined;  // borramos para que limpiar no posicione marcador
    lngini = undefined;
    limpiar();
    rute = [];   //borramos
    localStorage.removeItem('posicion');  //eliminamos
    geolocalizar();
} // fin func inicializar

function compactar(){
//  alert('compactar');
   if (rute.length > 2) {
     map.cleanRoute();  // borra la ruta
     map.removeMarkers();  // elimina marcadores
     rute.splice(1, rute.length - 2);  // extrae el primer y ultimo elemento del array
     localStorage.posicion = JSON.stringify(rute);  // guardamos la ruta serializada en localStorage
     geolocalizar();
    }
} // fin fuc compactar

geolocalizar();