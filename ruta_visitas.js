"use strict";

$('document').ready(function () {
    $(document).on("click", "#listaVendedoresId a", function() {
		vendedorSeleccionado = this.id;
		if(diaSeleccionado == ""){
			//alert("Necesita seleccionar un día");
		}else{
			obtenerRutaVendedor();			
		}
        $("#listaVendedoresId>a.seleccionado").removeClass("seleccionado");
		
        //deleteMap();
		
        //setMarkers(map, obtenerDatosVendedor(this.id, bottom_rm_score_data));
        document.getElementById(this.id).classList.add("seleccionado");
    });
		
    $(document).on("click", "#listaDias a", function() {
		
		diaSeleccionado = this.id;
		if(vendedorSeleccionado == ""){
			//alert("Necesita seleccionar un vendedor");
		}else{
			obtenerRutaVendedor();			
		}
        $("#listaDias>a.seleccionado").removeClass("seleccionado");
        //deleteMap();
		
        //setMarkers(map, obtenerDatosVendedor(this.id, bottom_rm_score_data));
        document.getElementById(this.id).classList.add("seleccionado");
    });
    document.getElementById('vendedores_clientes').addEventListener('change', filePickedVendedores, false);
    /* document.getElementById('loadButton').addEventListener("click", () => {
        $( "#file" ).click();
    }); */
    document.getElementById('vendedores_clientes').addEventListener("click", () => {
        filePickedVendedores(null);
    });
    document.getElementById('vendedores_clientes').addEventListener("click", () => {
        //clear();
    });
});

var vendedorSeleccionado = "";
var diaSeleccionado = "";

var vendedores = null;
var maestro = null;
var reporte_plano = null;
var visitas_en_ruta = null;
var visitas_vendedores = null;
var totalDistance = [];
var colors = ["#2c7fb8", "#de2d26", "#2ca25f", "#756bb1"];
var totalDistanceOriginal = 0;
var totalDistanceOriginalKm = 0;
var totalDistanceOriginalaRuta = 0;
var totalDistanceOriginalKmaRuta = 0;
var totalDistanceOriginalKmTotal = 0;
var traceroutePath;
var traceroutePathCD;
var rutas_polylines = [];
var markers = [];
var diasCargados = false;
var vendedores_finales = []


var totalTimeOriginalaRuta = 0;
var totalTimeOriginalHorasaRuta = 0;
var totalTimeOriginalHoras = 0;
var totalTimeOriginal = 0;
var totalTimeOriginalHorasTotal = 0;


var tts_minimo = 0
var tts_ideal = 0

var dias = [
{"clave_dia": "LU",
"descripcion": "LUNES"},
{"clave_dia": "MA",
"descripcion": "MARTES"},
{"clave_dia": "MI",
"descripcion": "MIERCOLES"},
{"clave_dia": "JU",
"descripcion": "JUEVES"},
{"clave_dia": "VI",
"descripcion": "VIERNES"},
{"clave_dia": "SA",
"descripcion": "SABADO"},
];


var salas = [
	{
		"sala": "CDA",
		"latitud": "-25.33665040631666",
		"longitud": "-57.5287819328832"
	},
	{
		"sala": "OVIEDO",
		"latitud": "-25.479820016261456",
		"longitud": "-56.450264854620436" 
	},
	{
		"sala": "VILLARRICA",
		"latitud": "-25.77873037107014", 
		"longitud": "-56.45003062687485"
	},
	{
		"sala": "SANTANI",
		"latitud": "-24.663500024822234", 
		"longitud": "-56.43911430385728"
	},
	{
		"sala": "CAAGUAZU",
		"latitud": "-25.461004570605258",
		"longitud": "-56.016203284652676"
	},
	{
		"sala": "CDE",
		"latitud": "-25.4955786110775",
		"longitud": "-54.709214019199756"
	},
	{
		"sala": "ENCARNACION",
		"latitud": "-27.28524641014754",
		"longitud": "-55.939135503288654"
	},
];
var sala_actual = {
		"sala": "CDA",
		"latitud": "-25.33665040631666",
		"longitud": "-57.5287819328832"
	};

function addMarker(location, posicion, dot) {
	var marker = null;
	if(dot != null){
		marker = new google.maps.Marker({
			position: location,
			map: map,
			label: posicion.toString(),
			icon: dot
		});
		
	}else{
		marker = new google.maps.Marker({
			position: location,
			map: map,
			label: posicion.toString()
		});
	}
	markers.push(marker);
}

function initMap() {
	
  /*this.traceroutePath = new google.maps.Polyline({
	path: routePath,
	strokeColor: routeColors[routeName],
	strokeOpacity: 1.0,
	strokeWeight: 2
  });*/
  this.directionsService = new google.maps.DirectionsService();
  this.directionsRenderer = new google.maps.DirectionsRenderer();
  /*this.directionsRendererOptimized = new google.maps.DirectionsRenderer({
    polylineOptions: {
      strokeColor: "green"
    }
  });*/
  //this.bounds = new google.maps.LatLngBounds();
  /*this.poly = new google.maps.Polyline({
        path: [],
        strokeColor: "#58FA58",
        strokeOpacity: 1.0,
        strokeWeight: 5
    });*/
  this.map = new google.maps.Map(document.getElementById("map"),
    {
      zoom: 13,
      center: { lat:-25.33648116035697, lng: -57.528642298073095 },
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
  );
  this.directionsRenderer.setMap(this.map);
  
  const onChangeHandler = function () {
    calculateAndDisplayRoute(directionsService, directionsRenderer, directionsRendererOptimized);
  };
    
    document.getElementById('descargarDatos').addEventListener("click", () => {
        //console.log(visitas_vendedores);
		//console.log(totalDistance);
		descargarDatos();
    });
}

function descargarDatos(){
	// Crear un libro de Excel vacío
	const wb = XLSX.utils.book_new();

	// Crear una hoja de cálculo a partir del array de objetos
	const ws = XLSX.utils.json_to_sheet(vendedores_finales);

	// Agregar la hoja de cálculo al libro
	XLSX.utils.book_append_sheet(wb, ws, 'Hoja1');

	// Generar un archivo Excel
	const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

	// Convertir el archivo a un objeto de tipo Blob
	const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });

	const fechaActual = new Date();
	const anio = fechaActual.getFullYear();
	const mes = fechaActual.getMonth() + 1; // Sumamos 1 porque los meses van de 0 a 11
	const dia = fechaActual.getDate();
	const hora = fechaActual.getHours();
	const minuto = fechaActual.getMinutes();

	// Agregamos ceros a la izquierda si es necesario
	const mesStr = mes.toString().padStart(2, '0');
	const diaStr = dia.toString().padStart(2, '0');
	const horaStr = hora.toString().padStart(2, '0');
	const minutoStr = minuto.toString().padStart(2, '0');

	// Creamos la cadena de texto en el formato "YYYY-MM-DD"
	const fechaStr = `${anio}_${mesStr}_${diaStr}_${horaStr}_${minutoStr}`;



	// Descargar el archivo
	const fileName = 'kilometraje_vendedores_'+fechaStr+'.xlsx';
	if (navigator.msSaveBlob) {
	  // Para Internet Explorer
	  navigator.msSaveBlob(blob, fileName);
	} else {
	  const link = document.createElement('a');
	  if (link.download !== undefined) {
		// Para navegadores modernos
		const url = URL.createObjectURL(blob);
		link.setAttribute('href', url);
		link.setAttribute('download', fileName);
		link.setAttribute('sandbox', 'allow-downloads allow-forms');
		link.style.visibility = 'hidden';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	  }
	}

	// Función auxiliar para convertir una cadena en un array de bytes
	function s2ab(s) {
	  const buf = new ArrayBuffer(s.length);
	  const view = new Uint8Array(buf);
	  for (let i = 0; i < s.length; i++) {
		view[i] = s.charCodeAt(i) & 0xFF;
	  }
	  return buf;
	}
}

function crearRutaVendedor(visitas_vendedores, cd, first){
	
	var final_ruta = visitas_vendedores.length;
	var waypoints = [];
	
	if(first){	
	
		var descarga = $('#descargarDatos');
		descarga.css("display", "none");
		
		totalDistanceOriginal = 0;
		totalDistanceOriginalKm = 0;
		totalDistanceOriginalaRuta = 0;
		totalDistanceOriginalKmaRuta = 0;
		totalDistanceOriginalKmTotal = 0;
		
		totalTimeOriginalaRuta = 0;
		totalTimeOriginalHorasaRuta = 0;
		totalTimeOriginalHoras = 0;
		totalTimeOriginal = 0;
		totalTimeOriginalHorasTotal = 0;
		
		/*if(typeof traceroutePath != "undefined" && traceroutePath != null){		
			traceroutePath.setMap(null);
			traceroutePath.setVisible(false);
			traceroutePath.setPath(null);
		}*/
		for(var j = 0 ; j < markers.length; j++){
			markers[j].setMap(null);
			markers[j].setVisible(false);
		}
		
		for(var j = 0 ; j < rutas_polylines.length; j++){
			rutas_polylines[j].setMap(null);
			rutas_polylines[j].setVisible(false);
			//rutas_polylines[j].setPath(null);
		}
		rutas_polylines = [];
		markers = [];
		
		addMarker(cd, sala_actual.sala, 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png')
		//document.getElementById("total_clientes").innerHTML  = visitas_vendedores.length;
		document.getElementById("total_clientes_t").innerHTML  = visitas_vendedores.length;
		for(var x = 0; x < vendedores_finales.length; x++ ){
			if(vendedores_finales[x].nombre_vendedor == vendedorSeleccionado){
				vendedores_finales[x][diaSeleccionado+"_CANTIDAD_CLIENTES"] = visitas_vendedores.length;
			}
			//const objetoBuscado = arrayUnico.find(objeto => objeto.nombre_vendedor === 'FRANCISCO AQUINO');

		}
		
		var total_visitas = visitas_vendedores.length;
		tts_minimo = (total_visitas * 270) / 3600
		tts_ideal = (total_visitas * 480) / 3600
		
		
		const horas_minimo    = (Math.floor(tts_minimo*3600 / 0xE10)).toString();
		const minutos_minimo  = (Math.floor(tts_minimo*3600 / 0x3C ) % 0x3C).toString();
	
		document.getElementById("tts_minimo").innerHTML  = `${horas_minimo} hs y  ${minutos_minimo} min.`;
		//document.getElementById("tts_minimo").innerHTML  = Math.round((tts_minimo + Number.EPSILON) * 100) / 100; 
		
		const horas_ideal    = (Math.floor(tts_ideal*3600 / 0xE10)).toString();
		const minutos_ideal  = (Math.floor(tts_ideal*3600 / 0x3C ) % 0x3C).toString();		
		document.getElementById("tts_ideal").innerHTML  = `${horas_ideal} hs y  ${minutos_ideal} min.`;
		//document.getElementById("tts_ideal").innerHTML  = Math.round((tts_ideal + Number.EPSILON) * 100) / 100;
		
		//rutas_polylines.push(traceroutePathCD);
		
		totalDistance.push(0);
		var ruta_dia_vendedor = visitas_vendedores.sort((a, b) => a["distancia"] - b["distancia"]);
		rutaHastaTerritorio(cd, new google.maps.LatLng(ruta_dia_vendedor[0]["latitud"],ruta_dia_vendedor[0]["longitud"]));
		var inicio = 1;
		var intermedio = 23;
		var final_ruta = ruta_dia_vendedor.length;
		
		
		var destination = null;
		var waypoints = [];
		var wi = 0;
		var MAX_WAYPOINT = 23;
		var iteracion = 0;
	
		if(final_ruta >= 23){
			for(var y = 0; y < 23; y++){
					/*if(typeof ruta_dia_vendedor[y]["latitud"] == "undefined"){
						alert("LATITUD no definida para el PDV: "+ruta_dia_vendedor[y].cliente +" - "+ruta_dia_vendedor[y].razon_social + ", favor corregir para hacer el análisis de este vendedor / día." )
					}else{ 
						if(typeof ruta_dia_vendedor[y]["longitud"] == "undefined"){
							alert("LONGITUD no definida para el PDV: "+ruta_dia_vendedor[y].cliente +" - "+ruta_dia_vendedor[y].razon_social + ", favor corregir para hacer el análisis de este vendedor / día.")
						}
					}*/
					waypoints.push({location: new google.maps.LatLng(ruta_dia_vendedor[y]["latitud"],ruta_dia_vendedor[y]["longitud"])});
					//addMarker(new google.maps.LatLng(ruta_dia_vendedor[y]["latitud"],ruta_dia_vendedor[y]["longitud"]), ruta_dia_vendedor[y]["order"]);
				}
				calcularDistancia(waypoints, true, ruta_dia_vendedor);
				waypoints = [];
		} else {		
				for(var y = 0; y < final_ruta; y++){
					waypoints.push({location: new google.maps.LatLng(ruta_dia_vendedor[y]["latitud"],ruta_dia_vendedor[y]["longitud"])});
					//addMarker(new google.maps.LatLng(ruta_dia_vendedor[y]["latitud"],ruta_dia_vendedor[y]["longitud"]), ruta_dia_vendedor[y]["order"]);
					
				}
				calcularDistancia(waypoints, true, ruta_dia_vendedor);
				waypoints = [];
		}
	}else{
		
		if(final_ruta >= 23){
				for(var y = 22; y < final_ruta; y++){
					waypoints.push({location: new google.maps.LatLng(visitas_vendedores[y]["latitud"],visitas_vendedores[y]["longitud"])});
					//addMarker(new google.maps.LatLng(ruta_dia_vendedor[y]["latitud"],ruta_dia_vendedor[y]["longitud"]), ruta_dia_vendedor[y]["order"]);
					
				}
				calcularDistancia(waypoints, false, visitas_vendedores);
				waypoints = [];
		}
	}
			
}

var delayFactor = 0;
var orden = 1;
function calcularDistancia(waypoints, order_w, puntos) {
  var origen = waypoints[0];
  var destino = waypoints[waypoints.length - 1];
  var waypoints_final = waypoints.slice();
  if(order_w){
	  orden = 1;
  }
  
  //console.log(waypoints_final);
  waypoints_final.splice(0, 1);
  waypoints_final.splice(waypoints_final.length - 1, 1);
  //console.log(waypoints_final);
  directionsService
    .route({
      origin: origen,
      destination: destino,
	  waypoints: waypoints_final,
	  optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.DRIVING
    }, function (response, status) {
		
      if (status == google.maps.DirectionsStatus.OK) {
		  
		var legs = response.routes[0].legs;
		var order = response.routes[0].waypoint_order;
		for(var i=0; i<legs.length; ++i) {
			totalDistanceOriginal += legs[i].distance.value;
			totalTimeOriginal += legs[i].duration.value;
			if(i == 0){
				if(orden == 1){
					addMarker(legs[i].start_location, orden, null);	
					orden ++;				
				}			
				//orden ++;
				
				addMarker(legs[i].end_location, orden, null);
				orden ++;
				//orden = 3;
			}else{
				
				addMarker(legs[i].end_location, orden, null);
				orden ++;
			}
			//addMarker(new google.maps.LatLng(ruta_dia_vendedor[y]["latitud"],ruta_dia_vendedor[y]["longitud"]), ruta_dia_vendedor[y]["order"]);
		}
		
		totalDistanceOriginalKm = totalDistanceOriginal/1000;
		totalTimeOriginalHoras = totalTimeOriginal/3600;
		
		if(totalDistanceOriginalKm != 0 ){
			totalDistanceOriginalKmTotal = totalDistanceOriginalKmaRuta + totalDistanceOriginalKm
			//document.getElementById("total_recorrido").innerHTML  = totalDistanceOriginalKmTotal;
			document.getElementById("total_recorrido_t").innerHTML  = Math.round((totalDistanceOriginalKmTotal + Number.EPSILON) * 100) / 100;
			for(var x = 0; x < vendedores_finales.length; x++ ){
				if(vendedores_finales[x].nombre_vendedor == vendedorSeleccionado){
					vendedores_finales[x][diaSeleccionado+"_KM"] = Math.round((totalDistanceOriginalKmTotal + Number.EPSILON) * 100) / 100;
					var descarga = $('#descargarDatos');
					descarga.css("display", "block");	
					if(vendedores_finales[x].hasOwnProperty('LU_KM')
						&& vendedores_finales[x].hasOwnProperty('MA_KM')
						&& vendedores_finales[x].hasOwnProperty('MI_KM')
						&& vendedores_finales[x].hasOwnProperty('JU_KM')
						&& vendedores_finales[x].hasOwnProperty('VI_KM')
						&& vendedores_finales[x].hasOwnProperty('SA_KM')){
						var badge = $('#'+vendedores_finales[x].codigo_vendedor+'_badge')
						badge.css("display", "block")						
					}
				}
				//const objetoBuscado = arrayUnico.find(objeto => objeto.nombre_vendedor === 'FRANCISCO AQUINO');

			}
		}
		
		
		
		if(totalTimeOriginalHorasaRuta != 0 ){
			totalDistanceOriginalKmTotal = totalTimeOriginalHorasaRuta + totalTimeOriginalHoras
			//document.getElementById("total_rutas_completas").innerHTML  = Math.round((totalDistanceOriginalKmTotal + Number.EPSILON) * 100) / 100;
			
		
			const horas    = (Math.floor(totalDistanceOriginalKmTotal*3600 / 0xE10)).toString();
			const minutos  = (Math.floor(totalDistanceOriginalKmTotal*3600 / 0x3C ) % 0x3C).toString();
		
			document.getElementById("total_rutas_completas_t").innerHTML  = `${horas} hs y  ${minutos} min.`;
			
			var total_total_minimo = tts_minimo + totalDistanceOriginalKmTotal
			
			var horas_total    = (Math.floor(total_total_minimo*3600 / 0xE10)).toString();
			var minutos_total  = (Math.floor(total_total_minimo*3600 / 0x3C ) % 0x3C).toString();
		
			document.getElementById("tts_minimo_total").innerHTML  = `${horas_total} hs y  ${minutos_total} min.`;
			
			var total_total__ideal = tts_ideal + totalDistanceOriginalKmTotal
			
			var horas_total_ideal    = (Math.floor(total_total__ideal*3600 / 0xE10)).toString();
			var minutos_total_ideal  = (Math.floor(total_total__ideal*3600 / 0x3C ) % 0x3C).toString();
		
			document.getElementById("tts_ideal_total").innerHTML  = `${horas_total_ideal} hs y  ${minutos_total_ideal} min.`;
			//document.getElementById("total_rutas_completas_t").innerHTML  = Math.round((totalDistanceOriginalKmTotal + Number.EPSILON) * 100) / 100;
			
			
			for(var x = 0; x < vendedores_finales.length; x++ ){
				if(vendedores_finales[x].nombre_vendedor == vendedorSeleccionado){
					vendedores_finales[x][diaSeleccionado+"_HS"] = Math.round((totalDistanceOriginalKmTotal + Number.EPSILON) * 100) / 100;
				}
				//const objetoBuscado = arrayUnico.find(objeto => objeto.nombre_vendedor === 'FRANCISCO AQUINO');

			}
		}
		//document.getElementById("recorrido").innerHTML  = totalDistanceOriginalKm;
		document.getElementById("recorrido_t").innerHTML  = Math.round((totalDistanceOriginalKm + Number.EPSILON) * 100) / 100;
		//document.getElementById("total_horas_ruta").innerHTML  = Math.round((totalTimeOriginalHoras + Number.EPSILON) * 100) / 100;
		
		
		const horas_horas_ruta    = (Math.floor(totalTimeOriginalHoras*3600 / 0xE10)).toString();
		const minutos_horas_ruta  = (Math.floor(totalTimeOriginalHoras*3600 / 0x3C ) % 0x3C).toString();
	
		document.getElementById("total_horas_ruta_t").innerHTML  = `${horas_horas_ruta} hs y  ${minutos_horas_ruta} min.`;
		
		
		//document.getElementById("total_horas_ruta_t").innerHTML  = Math.round((totalTimeOriginalHoras + Number.EPSILON) * 100) / 100;
		
		
		
		//total_horas_ruta,total_rutas_completas
        var snap_path = response.routes[0].overview_path;
        traceroutePath = new google.maps.Polyline({
          strokeColor: colors[0],
          strokeOpacity: 1.0,	
          strokeWeight: 3,
          map: map
        });
        traceroutePath.setPath(snap_path);
		rutas_polylines.push(traceroutePath);
		
	  if(order_w){
		  
		$('#resultado').show();
		$('#resultado').css("display", "true")
		crearRutaVendedor(puntos, null, false);		  
	  }else{
		  
		  const bounds = new window.google.maps.LatLngBounds();
		  for (var i=0; i < markers.length; i++) 
			{
				bounds.extend(markers[i].position);
			}
			map.fitBounds(bounds);
			map.setZoom(13);
	  }
		
      } else if (status === google.maps.DirectionsStatus.OVER_QUERY_LIMIT) {
		  
			var dt = new Date();
			while ((new Date()) - dt <= 2000) { /* pasa el tiempo*/ }

            setTimeout(function () {
                calcularDistancia(waypoints, order_w);
            }, 3000);		  
			
	  } else {
		console.log("Route: " + status);
		mostrarDatos(true);
	  } //else alert("Directions request failed: " + status);
	  
      //this.directionsRenderer.setDirections(response);
    });
	/*
    .catch((e) => {
	if (e.code === google.maps.DirectionsStatus.OVER_QUERY_LIMIT) {
			delayFactor++;
			setTimeout(function () {
			calcularDistancia(waypoints, vendedor, fecha)
			}, delayFactor * 2000);
	  } else {
		console.log("Route: " + status);
	  }
	}*/
}


function filePickedVendedores(oEvent) {
	
    if (oEvent != null && typeof oEvent != 'undefined') {
	clearMap();

    // Get The File From The Input
    var oFile = oEvent.target.files[0];
    var sFilename = oFile.name;
    // Create A File Reader HTML5
    var reader = new FileReader();

    // Ready The Event For When A File Gets Selected
    reader.onload = function(e) {
        var data = e.target.result;
        //var cfb = XLS.CFB.read(data, {type: 'binary'});
		var cfb = XLSX.read(data, {type: 'binary'});
		cfb.SheetNames.forEach(function(sheetName) {
        // Obtain The Current Row As CSV
        var sCSV = XLS.utils.make_csv(cfb.Sheets[sheetName]);   
        var oJS = XLS.utils.sheet_to_json(cfb.Sheets[sheetName]);   

        //$("#my_file_output").html(sCSV);
		reporte_plano = oJS;
		vendedores = [];
		
		var descarga = $('#descargarDatos');
		descarga.css("display", "none");
		var vendedor = {};
		for( var i = 0; i < reporte_plano.length; i++){
			var j = reporte_plano[i].nombre_vendedor
			var vendedor = {};
			vendedor.nombre_vendedor = reporte_plano[i].nombre_vendedor.trim();
			vendedor.codigo_vendedor = reporte_plano[i].codigo_vendedor;
			vendedor.nombre_region_venta = reporte_plano[i].nombre_region_venta.trim();
			reporte_plano[i].nombre_vendedor = j.trim();
			reporte_plano[i].nombre_region_venta = reporte_plano[i].nombre_region_venta.trim();
			vendedores.push(vendedor);
		}
		
		vendedores_finales = []
		vendedores_finales = Object.values(vendedores.reduce((obj, item) => {
		  obj[item.codigo_vendedor] = obj[item.codigo_vendedor] || item;
		  return obj;
		}, {}));
		
		vendedores_finales.sort((a, b) => {
		  if (a.nombre_vendedor < b.nombre_vendedor) {
			return -1; // a debe ir antes que b
		  }
		  if (a.nombre_vendedor > b.nombre_vendedor) {
			return 1; // a debe ir después que b
		  }
		  return 0; // a y b son iguales
		});

		//console.log(vendedores_finales);

		//console.log(arrayUnico);
		/*
		var vendedores_unicos = new Set(vendedores)
		//vendedores_unicos.map(x => vendedores_finales.push(x));
		
		vendedores_unicos.forEach(element => {
			vendedores_finales.push(element)
		});*/
		
		obtenerVendedores(vendedores_finales);
		
		$('#listados').show();
		$('#listados').css("display", "true")
		/*visitas_en_ruta = [];
		visitas_vendedores = {};
		for( var i = 0; i < reporte_plano.length; i++){
			if(reporte_plano[i]["Tipo Vendedor"].trim() == 'VENDEDOR EXTERNO' 
			&& reporte_plano[i]["Visita En Ruta"] == 1 
			&& reporte_plano[i]["Visita Valida"] == 1){
				visitas_en_ruta.push(reporte_plano[i]);
				if(typeof visitas_vendedores[reporte_plano[i]["Id Territorio"]] != 'undefined'){
					if(typeof visitas_vendedores[reporte_plano[i]["Id Territorio"]][reporte_plano[i]["Fecha Visita"]]!= 'undefined' ){
						visitas_vendedores[reporte_plano[i]["Id Territorio"]][reporte_plano[i]["Fecha Visita"]]["visitas"].push(reporte_plano[i]);
					}else{
						visitas_vendedores[reporte_plano[i]["Id Territorio"]][reporte_plano[i]["Fecha Visita"]] = {"distanciaMetros":0, "distanciaKM":0, "visitas" : []};
						visitas_vendedores[reporte_plano[i]["Id Territorio"]][reporte_plano[i]["Fecha Visita"]]["visitas"].push(reporte_plano[i]);
					}			
				}else{
					visitas_vendedores[reporte_plano[i]["Id Territorio"]] = {};
					visitas_vendedores[reporte_plano[i]["Id Territorio"]][reporte_plano[i]["Fecha Visita"]] = {"distanciaMetros":0, "distanciaKM":0, "visitas" : []};
					visitas_vendedores[reporte_plano[i]["Id Territorio"]][reporte_plano[i]["Fecha Visita"]]["visitas"].push(reporte_plano[i]);
				}
			}
		}*/
		//crearRutaVendedor(reporte_plano)
    });
    };

    // Tell JS To Start Reading The File.. You could delay this if desired
    reader.readAsBinaryString(oFile);
	
	} else {

    }
}


function obtenerVendedores(lista_vendedores) {
	lista_vendedores.sort()
	document.getElementById('listaVendedoresId').innerHTML = '';
	for(var i in lista_vendedores){
	$('#listaVendedoresId').append(
		  '<a href="#" class="list-group-item list-group-item-action vendedor empleado-list" id="'+lista_vendedores[i].nombre_vendedor+'"><div class="row"><div class="col-md-10"><i class="bi bi-person-circle empleado-list" ></i>&nbsp;&nbsp;&nbsp;'+lista_vendedores[i].nombre_vendedor+'</div><div class="col-md-2"><span id="'+lista_vendedores[i].codigo_vendedor+'_badge" class="badge bg-success" style="display:none"><i class="bi bi-check-circle me-1"></i></div></div></span></a>');
	}
	mostrarDias();
	
    //setMarkers(map, obtenerDatosVendedor(a[0], bottom_rm_score_data));
    //return a;
}

function mostrarDias(lista_vendedores) {
	if(!diasCargados){
		document.getElementById('listaDias').innerHTML = '';
		for(var i in dias){
		$('#listaDias').append(
			  '<a href="#" class="list-group-item list-group-item-action empleado-list" id="'+dias[i].clave_dia+'"><i class="bi bi-calendar-date empleado-list"></i>&nbsp;&nbsp;&nbsp;'+dias[i].descripcion+'</a>');
		}
		diasCargados = true;		
	}
	
    //setMarkers(map, obtenerDatosVendedor(a[0], bottom_rm_score_data));
    //return a;
}

function getDistanciaMetros(lat1,lon1,lat2,lon2)
{
  var rad = function(x) {return x*Math.PI/180;}
  var R = 6378.137; //Radio de la tierra en km 
  var dLat = rad( lat2 - lat1 );
  var dLong = rad( lon2 - lon1 );
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(rad(lat1)) * 
  Math.cos(rad(lat2)) * Math.sin(dLong/2) * Math.sin(dLong/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  //aquí obtienes la distancia en metros por la conversion 1Km =1000m
  var d = R * c * 1000; 
  return d ; 
}



function obtenerRutaVendedor() {
		try{
			//var cda = new google.maps.LatLng('-25.5334623', '-57.2872565');
			var cd = new google.maps.LatLng(sala_actual.latitud, sala_actual.longitud);
			var rutaVendedor = [];
			for( var i = 0; i < reporte_plano.length; i++){
				if(reporte_plano[i]["nombre_vendedor"] == vendedorSeleccionado
				&& reporte_plano[i]["frecuencia_visita"].includes(diaSeleccionado)){
					rutaVendedor.push(reporte_plano[i]);
				}
			}
			for( var i = 0; i < rutaVendedor.length; i++){
				var pdv =  new google.maps.LatLng(rutaVendedor[i]["latitud"],rutaVendedor[i]["longitud"]);
				//addMarker(pdv, 9999);
				//rutaVendedor[i]["distancia"] = google.maps.geometry.spherical.computeDistanceBetween(cd, pdv);
				rutaVendedor[i]["distancia"] = getDistanciaMetros(sala_actual.latitud, sala_actual.longitud, rutaVendedor[i].latitud, rutaVendedor[i].longitud)
				//getDistanciaMetros(-25.5334623, -57.2872565, rutaVendedor[i].latitud, rutaVendedor[i].longitud)

			}
			
			crearRutaVendedor(rutaVendedor, cd, true);			
		} catch (error) {
		  // código que maneja la excepción
		  console.log('Se ha producido un error:', error.message);
		  mostrarDatos(false);
		}
}



function rutaHastaTerritorio(cd, pdv) {
  var origen = cd;
  var destino = pdv;
  directionsService
    .route({
      origin: origen,
      destination: destino,
      travelMode: google.maps.TravelMode.DRIVING
    }, function (response, status) {
		
      if (status == google.maps.DirectionsStatus.OK) {
		  
		var legs = response.routes[0].legs;
		var order = response.routes[0].waypoint_order;
		for(var i=0; i<legs.length; ++i) {
			totalDistanceOriginalaRuta += legs[i].distance.value;			
			totalTimeOriginalaRuta+= legs[i].duration.value;
			}
			totalDistanceOriginalKmaRuta = totalDistanceOriginalaRuta/1000;
		
			//document.getElementById("recorrido_ruta").innerHTML  = totalDistanceOriginalKmaRuta;
			document.getElementById("recorrido_ruta_t").innerHTML  = Math.round((totalDistanceOriginalKmaRuta + Number.EPSILON) * 100) / 100;
			
			
			totalTimeOriginalHorasaRuta = totalTimeOriginalaRuta/3600;

		//document.getElementById("recorrido_a_territorio").innerHTML  = totalDistanceOriginalKm;
        var snap_path = response.routes[0].overview_path;
        traceroutePathCD = new google.maps.Polyline({
          strokeColor: colors[1],
          strokeOpacity: 1.0,	
          strokeWeight: 3,
          map: map
        });
        traceroutePathCD.setPath(snap_path);
		
		rutas_polylines.push(traceroutePathCD);
      } else if (status === google.maps.DirectionsStatus.OVER_QUERY_LIMIT) {
		  
			var dt = new Date();
			while ((new Date()) - dt <= 2000) { /* pasa el tiempo*/ }

            setTimeout(function () {
                rutaHastaTerritorio(cda, pdv);
            }, 3000);		  
			
	  } else {
		console.log("Route: " + status);
	  } //else alert("Directions request failed: " + status);
	  
      //this.directionsRenderer.setDirections(response);
    });
}

function salaCambiada() {
  var cd =  null;
  var x = document.getElementById("salas_ventas").value;
  for(var i = 0; i < salas.length; i++){
	if(salas[i].sala == x){
		//cd =  new google.maps.LatLng(salas[i].["latitud"],salas[i].["longitud"]);
		sala_actual = salas[i];
		if(diaSeleccionado != "" && vendedorSeleccionado != ""){
			
			for(var j = 0 ; j < markers.length; j++){
				markers[j].setMap(null);
				markers[j].setVisible(false);
			}
			obtenerRutaVendedor();			
		}
		break;
	}
  }
  //document.getElementById("demo").innerHTML = "You selected: " + x;
}


function clearMap(){

		totalDistanceOriginal = 0;
		totalDistanceOriginalKm = 0;
		totalDistanceOriginalaRuta = 0;
		totalDistanceOriginalKmaRuta = 0;
		totalDistanceOriginalKmTotal = 0;
		
		totalTimeOriginalaRuta = 0;
		totalTimeOriginalHorasaRuta = 0;
		totalTimeOriginalHoras = 0;
		totalTimeOriginal = 0;
		totalTimeOriginalHorasTotal = 0;
		
		/*if(typeof traceroutePath != "undefined" && traceroutePath != null){		
			traceroutePath.setMap(null);
			traceroutePath.setVisible(false);
			traceroutePath.setPath(null);
		}*/
		for(var j = 0 ; j < markers.length; j++){
			markers[j].setMap(null);
			markers[j].setVisible(false);
		}
		
		for(var j = 0 ; j < rutas_polylines.length; j++){
			rutas_polylines[j].setMap(null);
			rutas_polylines[j].setVisible(false);
			//rutas_polylines[j].setPath(null);
		}
		rutas_polylines = [];
		markers = [];
		
		$('#resultado').css("display", "none")

}



function mostrarDatos(todo) {
	var datos = '';	
	var fila_contador = 0;
	for(var x = 0; x < reporte_plano.length; x++ ){
		if(reporte_plano[x].nombre_vendedor == vendedorSeleccionado){
			if(!todo || reporte_plano[x]["frecuencia_visita"].includes(diaSeleccionado)){
				fila_contador++;
				var contenido = '<tr>'+
					'<th>'+fila_contador+'</th>'+
					'<th scope="row">'+reporte_plano[x].cliente+'</th>'+
					'<td'+ (typeof reporte_plano[x].razon_social == "undefined" ? ' class="table-danger"' : '') +'>'+reporte_plano[x].razon_social+'</td>'+
					'<td'+ (typeof reporte_plano[x].nombre_region_venta == "undefined" ? ' class="table-danger"' : '') +'>'+reporte_plano[x].nombre_region_venta+'</td>'+
					'<td'+ (typeof reporte_plano[x].codigo_territorio == "undefined" ? ' class="table-danger"' : '') +'>'+reporte_plano[x].codigo_territorio+'</td>'+
					'<td'+ (typeof reporte_plano[x].codigo_vendedor == "undefined" ? ' class="table-danger"' : '') +'>'+reporte_plano[x].codigo_vendedor+'</td>'+
					'<td'+ (typeof reporte_plano[x].nombre_vendedor == "undefined" ? ' class="table-danger"' : '') +'>'+reporte_plano[x].nombre_vendedor+'</td>'+
					'<td'+ (typeof reporte_plano[x].frecuencia_visita == "undefined" ? ' class="table-danger"' : '') +'>'+reporte_plano[x].frecuencia_visita+'</td>'+
					'<td'+ (typeof reporte_plano[x].latitud == "undefined" ? ' class="table-danger"' : '') +'>'+reporte_plano[x].latitud+'</td>'+
					'<td'+ (typeof reporte_plano[x].longitud == "undefined" ? ' class="table-danger"' : '') +'>'+reporte_plano[x].longitud+'</td>'+
				  '</tr>';
				datos += contenido;
			}
		}
	}
	document.getElementById("datos_excel").innerHTML  = datos;
	$('#excel_modal').modal('show');
}