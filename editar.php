<?php 
    include 'inc/funciones/funciones.php';
    include 'inc/layout/header.php'; 

    $id = filter_var($_GET['id'], FILTER_VALIDATE_INT);

    if(!$id) {
        die('No es válido');
    }

    $resultado = obtenerContacto($id);
    $contacto = $resultado->fetch_assoc();

?>

<div class="contenedor-barra">
    <div class="contenedor barra">
        <a href="index.php" class="btn volver">Volver</a>
        <h1>Edite el Contacto</h1>
    </div>
</div>

<div class="bg-secondary contenedor shadow">
    <form action="#" id="contacto">
        <legend>
            Edite el contacto
        </legend>
        <?php include 'inc/layout/formulario.php';?>
    </form>
</div><!--bg-secondary-->

<?php include 'inc/layout/footer.php'; ?>