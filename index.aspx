<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <meta content="width=device-width, initial-scale=1.0" name="viewport">

  <title>Recorrido del vendedor</title>
  <meta content="" name="description">
  <meta content="" name="keywords">

  <!-- Favicons -->
  <link href="assets/img/favicon.png" rel="icon">
  <link href="assets/img/apple-touch-icon.png" rel="apple-touch-icon">

  <!-- Google Fonts -->
  <link href="https://fonts.gstatic.com" rel="preconnect">
  <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i|Nunito:300,300i,400,400i,600,600i,700,700i|Poppins:300,300i,400,400i,500,500i,600,600i,700,700i" rel="stylesheet">

  <!-- Vendor CSS Files -->
  <link href="assets/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">
  <link href="assets/vendor/bootstrap-icons/bootstrap-icons.css" rel="stylesheet">
  <link href="assets/vendor/boxicons/css/boxicons.min.css" rel="stylesheet">
  <link href="assets/vendor/quill/quill.snow.css" rel="stylesheet">
  <link href="assets/vendor/quill/quill.bubble.css" rel="stylesheet">
  <link href="assets/vendor/remixicon/remixicon.css" rel="stylesheet">
  <link href="assets/vendor/simple-datatables/style.css" rel="stylesheet">

  <!-- Template Main CSS File -->
  <link href="assets/css/style.css" rel="stylesheet">
  
  
    

	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script src="https://polyfill.io/v3/polyfill.min.js?features=default"></script>
	
    <script
      src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAWStDQIwicnVxSFXV4OeR82d8wCMq50GE&callback=initMap&libraries=geometry"
      async
    ></script>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.8.0/jszip.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.8.0/xlsx.js"></script>
    
	<!--<link rel="stylesheet" type="text/css" href="./ruta_visitas.css" />-->
	<script type="text/javascript" src="./ruta_visitas.js"></script> 


	<style type="text/css">
      /* Always set the map height explicitly to define the size of the div
       * element that contains the map. */
      
      #map {
        height: 100%;
      }

      /* Optional: Makes the sample page fill the window. */
      html,
      body {
        height: 100%;
        margin: 0;
        padding: 0;
      }
	  .list-group{
		max-height: 500px;
		margin-bottom: 10px;
		overflow-y:auto;
		-webkit-overflow-scrolling: touch;
	}
	.list-group-item-action:active {
		color: #212529;
		background-color: #adb5bd7d;
	}
	.seleccionado {
		color: #212529 !important;
		background-color: #adb5bd7d !important;
	}
    </style>

  <!-- =======================================================
  * Template Name: NiceAdmin
  * Updated: Mar 09 2023 with Bootstrap v5.2.3
  * Template URL: https://bootstrapmade.com/nice-admin-bootstrap-admin-html-template/
  * Author: BootstrapMade.com
  * License: https://bootstrapmade.com/license/
  ======================================================== -->
</head>

<body style="overflow-y: hidden;">

  <!-- ======= Header ======= -->
  <header id="header" class="header fixed-top d-flex align-items-center">

    <div class="d-flex align-items-center justify-content-between">
      <a href="index.html" class="logo d-flex align-items-center">
        <img src="assets/img/logo.png" alt="">
        <span class="d-none d-lg-block">Route to Market & Tech Sales</span>
      </a>
    </div><!-- End Logo -->

  </header><!-- End Header -->

  <!-- ======= Sidebar ======= -->
  <aside id="sidebar" class="sidebar">
  
  <div class="row">
        <div>
          <h3>Recorridos de vendedores</h3>
        </div>
        <div class="row">
			<div class="col-md-6">
				<h6></i>Selecionar Sala de venta</h6>
			</div>	
			<div class="col-md-6">
				<select class="form-select" aria-label="Seleccionar CD"  style="font-size: 12px;" id="salas_ventas" onchange="salaCambiada()">
				  <option value="CDA">CDA</option>
				  <option value="OVIEDO">OVIEDO</option>
				  <option value="VILLARRICA">VILLARRICA</option>
				  <option value="SANTANI">SANTANI</option>
				  <option value="CAAGUAZU">CAAGUAZU</option>
				  <option value="CDE">CDE</option>
				  <option value="ENCARNACION">ENCARNACIÓN</option>
				</select>
			 </div>		
			<h6><i class="bi bi-filetype-xlsx" style="color: #4154f1;font-size: 24px;font-weight: 900;"></i> Importar archivo de visitas</h6>
            <div class="col-md-9">
			  <input class="form-control" type="file" id="vendedores_clientes" style="font-size: 12px;">
			</div>
            <div class="col-md-3">
			<form method="get" action="data_example.xlsx">
				<button type="submit" class="btn btn-secondary"  style="font-size:12px;"><i class="bi bi-filetype-xlsx" style="font-size:12px;" download="proposed_file_name"></i>&nbsp;&nbsp;&nbsp;Ejemplo</button>
			</form>
			</div>
          
          <!--<input type="file" id="vendedores_clientes" style="font-size: small;" />-->
        </div>
		<div id="resultado"  style="display:none; margin-top:16px;">
		<section class="section dashboard">
		<div class="row">
            <!-- Sales Card -->
            <div class="col-md-4">
              <div class="card info-card sales-card">
                <div class="card-body">
                  <h5 class="card-title">Km en ruta</span></h5>

                  <div class="d-flex align-items-center">
                    <div class="card-icon rounded-circle d-flex align-items-center justify-content-center">
                      <i class="bi bi-geo-alt"></i>
                    </div>
                    <div class="ps-3">
                      <h6 id="recorrido_t">145</h6>
                    </div>
                  </div>
                </div>

              </div>
            </div><!-- End Sales Card -->
            <!-- Sales Card -->
            <div class="col-md-4">
              <div class="card info-card sales-card">
                <div class="card-body">
                  <h5 class="card-title">Km desde el CD</span></h5>

                  <div class="d-flex align-items-center">
                    <div class="card-icon rounded-circle d-flex align-items-center justify-content-center">
                      <i class="bi bi-geo-alt"></i>
                    </div>
                    <div class="ps-3">
                      <h6 id="recorrido_ruta_t">145</h6>
                    </div>
                  </div>
                </div>

              </div>
            </div><!-- End Sales Card -->
            <!-- Sales Card -->
            <div class="col-md-4">
              <div class="card info-card sales-card">
                <div class="card-body">
                  <h5 class="card-title">Km Totales</span></h5>

                  <div class="d-flex align-items-center">
                    <div class="card-icon rounded-circle d-flex align-items-center justify-content-center">
                      <i class="bi bi-geo-alt"></i>
                    </div>
                    <div class="ps-3">
                      <h6 id="total_recorrido_t">145</h6>
                    </div>
                  </div>
                </div>

              </div>
            </div><!-- End Sales Card -->
            <!-- Sales Card -->
            <div class="col-md-4">
              <div class="card info-card sales-card">
                <div class="card-body">
                  <h5 class="card-title">Cant. Clientes</span></h5>

                  <div class="d-flex align-items-center">
                    <div class="card-icon rounded-circle d-flex align-items-center justify-content-center">
                      <i class="bi bi-house"></i>
                    </div>
                    <div class="ps-3">
                      <h6 id="total_clientes_t">145</h6>
                    </div>
                  </div>
                </div>

              </div>
            </div><!-- End Sales Card -->
            <!-- Sales Card -->
            <div class="col-md-4">
              <div class="card info-card sales-card">
                <div class="card-body">
                  <h5 class="card-title">Hs en ruta</span></h5>

                  <div class="d-flex align-items-center">
                    <div class="card-icon rounded-circle d-flex align-items-center justify-content-center">
                      <i class="bi bi-stopwatch"></i>
                    </div>
                    <div class="ps-3">
                      <h6 id="total_horas_ruta_t">145</h6>
                    </div>
                  </div>
                </div>

              </div>
            </div><!-- End Sales Card -->
            <!-- Sales Card -->
            <div class="col-md-4">
              <div class="card info-card sales-card">
                <div class="card-body">
                  <h5 class="card-title">Hs con traslado</span></h5>

                  <div class="d-flex align-items-center">
                    <div class="card-icon rounded-circle d-flex align-items-center justify-content-center">
                      <i class="bi bi-stopwatch"></i>
                    </div>
                    <div class="ps-3">
                      <h6 id="total_rutas_completas_t">145</h6>
                    </div>
                  </div>
                </div>

              </div>
            </div><!-- End Sales Card -->
			</div>
        <!--<div id="resultado"  style="display:none; margin-top:16px;">
          <table class="table">
            <thead>
              <tr>
                <th scope="col">Km en ruta</th>
                <th scope="col">Km desde el CD</th>
                <th scope="col">Km Totales</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row" id="recorrido_t"></th>
                <th scope="row" id="recorrido_ruta_t"></th>
                <th scope="row" id="total_recorrido_t"></th>
            </tbody>
          </table>
          <table class="table">
            <thead>
              <tr>
                <th scope="col">Cant. Clientes</th>
                <th scope="col">Horas en ruta</th>
                <th scope="col">Horas con traslado</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row" id="total_clientes_t"></th>
                <th scope="row" id="total_horas_ruta_t"></th>
                <th scope="row" id="total_rutas_completas_t"></th>
            </tbody>
          </table>
        </div>-->
		
		</section>
		</div>
    </div>
  <div class="row" id="listados" style="display:none; margin-top:16px;">
	<div class="col-md-7">
	  <div>
		<h6>Vendedores</h6>
	  </div>
	  <div class="list-group" id="listaVendedoresId"></div>
	</div>
	<div class="col-md-5">
	  <div>
		<h6>Días</h6>
	  </div>
	  <div class="list-group" id="listaDias"></div>
	</div>
  </div>

  </aside><!-- End Sidebar-->

  <main id="main" class="main">

		<div class="card info-card sales-card" style="height: 90%; padding: 16px;">
		<div id="map"></div>
	  </div>

  </main><!-- End #main -->

  <!-- Vendor JS Files -->
  <script src="assets/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
  <script src="assets/vendor/quill/quill.min.js"></script>
  <script src="assets/vendor/simple-datatables/simple-datatables.js"></script>
  <script src="assets/vendor/tinymce/tinymce.min.js"></script>

  <!-- Template Main JS File
  <script src="assets/js/main.js"></script> -->

</body>

</html>