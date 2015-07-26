var socket = io();

socket = io.connect('http://sirc.iqbusiness.mx:3000');

var apoints = [];

var geocoder = new google.maps.Geocoder();

var infowindow = new google.maps.InfoWindow();

var map = null;

var mbus = null;

var heatmap = null;

//incrusta la capa con el mapa de calor
socket.on('heatmap', function(xpoints) {

	console.log("HEADMAP!!");

	if (heatmap != null && heatmap !== undefined) {
		heatmap.setMap(null);
	}

	for (var i = 0; i < xpoints.length; i++) {
		apoints.push(new google.maps.LatLng(xpoints[i].latitud, xpoints[i].longitud));
	}

	var pointArray = new google.maps.MVCArray(apoints);

	heatmap = new google.maps.visualization.HeatmapLayer({
		data: pointArray
	});

	heatmap.setMap(map);

	apoints = [];

});

//actualizamos en tiempo real el marcador del autobus y centramos el mapa
socket.on('gpoint', function(p){

	var newPoint = new google.maps.LatLng(p.latitud, p.longitud);

	apoints.push(newPoint);

	mbus.setPosition(newPoint);

	map.setCenter({lat: p.latitud, lng: p.longitud});

	$('#btn-test-rt').prop('disabled', true);

});

//al cargar la pagina geolocalizamos al usuario, incrustamos el marcador 
$( document ).ready(function(){

	var coordenadas = null;

	var options = {
		enableHighAccuracy: true,
		timeout: 6000,
		maximumAge: 0
	};

	function success(position) {

		coordenadas = position.coords;

		/*console.log('Tu posición actual es:');
		console.log('Latitud : ' + coordenadas.latitude);
		console.log('Longitud: ' + coordenadas.longitude);
		console.log('Más o menos ' + coordenadas.accuracy + ' metros.');*/

		//coordiandas de usuario
		var latlng = new google.maps.LatLng(coordenadas.latitude, coordenadas.longitude);

		//configuración del mapa con estilos personalizados
		var mapOptions = {
			zoom: 15,
			center: latlng,
			styles:[
				{
					featureType: "all",
					elementType: "geometry",
					stylers: [
						{ weight: "2.4" },
						{ visibility: "simplified" },
						{ hue: "#00FFFF"},
						{ invert_lightness: true}
					]
				},{
					featureType: "all",
					elementType: "labels.text",
					stylers: [
						{ weight: "0.1" },
						{ visibility: "on" },
						{ color: "#EEEEEE"},
						{ invert_lightness: false}
					]
				}
			]
		}

		//creamos el mapa con las opciones indicadas
		map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);

		//creamos el marcador con la posicion del usuario
		geocoder.geocode({'location': latlng}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				if (results[1]) {
					//map.setZoom(11);
					marker = new google.maps.Marker({
						position: latlng,
						map: map,
						icon: '/images/markers/user.png'
					});
					infowindow.setContent(results[1].formatted_address);
					infowindow.open(map, marker);
				} else {
					window.alert('No results found');
				}
			} else {
				window.alert('Geocoder failed due to: ' + status);
			}
		});

		//coordenadas de la ciudad de Celaya Guanajuato
		var myLatlng = new google.maps.LatLng(20.515786,-100.803337);

		//creamos el marcador del autobus
		mbus = new google.maps.Marker({
			position: myLatlng,
			map: map,
			id:'m_7',
			icon: 'http://www.sterling-adventures.co.uk/blog/wp-content/plugins/post-country/images/m2.png'
		});
	};

	function error(error) {
		console.warn('ERROR(' + error.code + '): ' + error.message);
	};

	navigator.geolocation.getCurrentPosition( success, error, options );

	//////////////////////////////////////////
	$("#btn-test-rt").on("click", function() {
		var request = $.ajax({
			url: "/testrt",
			type: "GET"
		});

		request.done(function(msg) {
			console.log(msg);
		});

		request.fail(function(jqXHR, textStatus) {
			alert("Error: " + textStatus);
		});
	})

});

