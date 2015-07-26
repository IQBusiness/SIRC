var socket = io();

socket = io.connect('http://sirc.iqbusiness.mx:3000');

var apoints = [];

var geocoder = new google.maps.Geocoder();

var infowindow = new google.maps.InfoWindow();

var map = null;

var heatmap = null;

var markeri = null;

var markerf = null;

//incrusta la capa con el mapa de calor
socket.on('reciberuta', function(xpoints) {

	console.log("HEADMAP!!");

	if (markeri != null || markerf != null) {
		markeri.setMap(null);
		markerf.setMap(null);
	}

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

	gpointi = new google.maps.LatLng(xpoints[0].latitud, xpoints[0].longitud);

	markeri = new google.maps.Marker({
		position: gpointi,
		map: map,
		icon: '/images/markers/start.png'
	});

	gpointf = new google.maps.LatLng(xpoints[xpoints.length - 1].latitud, xpoints[xpoints.length - 1].longitud);

	markerf = new google.maps.Marker({
		position: gpointf,
		map: map,
		icon: '/images/markers/end.png'
	});

	heatmap.setMap(map);

	map.setCenter({lat: xpoints[0].latitud, lng: xpoints[0].longitud});

	apoints = [];

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
			zoom: 14,
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
					$("#ciudad").html(results[1].formatted_address);
					infowindow.open(map, marker);
				} else {
					window.alert('No results found');
				}
			} else {
				window.alert('Geocoder failed due to: ' + status);
			}
		});

	};

	function error(error) {
		console.warn('ERROR(' + error.code + '): ' + error.message);
	};

	navigator.geolocation.getCurrentPosition( success, error, options );

	//////////////////////////////////////////

	//cargamos el combo de las ciudades
	var request = $.ajax({
		url: "/loadestados",
		type: "GET"
	});

	request.done(function(response) {
		var r = JSON.parse(response);
		var estados = r.estados;
		$.each(estados, function(k,v){
			//console.log("k: ", k, " v: ", v);
			$("#cmb-estados").append("<option value=\"" + v.id + "\">" + v.nombre + "</option>");
		});
	});

	request.fail(function(jqXHR, textStatus) {
		alert("Error: " + textStatus);
	});

	//agregamos el evento on change al combo de los estados
	$("#cmb-estados").on('change',function(){
		var id_estado = $(this).val();

		//cargamos el combo de las ciudades
		var request = $.ajax({
			url: "/loadciudades",
			type: "GET",
			data: {
				id_estado: id_estado
			}
		});

		request.done(function(response) {
			var r = JSON.parse(response);
			var ciudades = r.ciudades;
			$.each(ciudades, function(k,v){
				//console.log("k: ", k, " v: ", v);
				$("#cmb-ciudades").append("<option value=\"" + v.id + "\">" + v.nombre + "</option>");
			})
		});

		request.fail(function(jqXHR, textStatus) {
			alert("Error: " + textStatus);
		});
	});

	//agregamos el evente on change al combo de las ciudades
	$("#cmb-ciudades").on('change',function(){
		var id_ciudad = $(this).val();

		//cargamos el combo de las ciudades
		var request = $.ajax({
			url: "/loadrutas",
			type: "GET",
			data: {
				id_ciudad: id_ciudad
			}
		});

		request.done(function(response) {
			var r = JSON.parse(response);
			var rutas = r.rutas;
			$.each(rutas, function(k,v){
				//console.log("k: ", k, " v: ", v);
				$("#cmb-rutas").append("<option value=\"" + v.id + "\">" + v.descripcion + "</option>");
			})
		});

		request.fail(function(jqXHR, textStatus) {
			alert("Error: " + textStatus);
		});
	});

	//agregamos el evente on change al combo de las ciudades
	$("#cmb-rutas").on('change',function(){
		var id_ruta = $(this).val();

		socket.emit('getruta', id_ruta);

	});

});

