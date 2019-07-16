<?php 
    include 'inc/funciones/funciones.php';
    include 'inc/layout/header.php'; 
?>

<div class="contenedor-barra">
    <h1>Agenda de Contactos</h1>
</div>

<div class="bg-secondary contenedor shadow">
    <form action="#" id="contacto">
        <legend>
            Añada un contacto <span>Todos los campos son obligatorios</span>
        </legend>
        <?php include 'inc/layout/formulario.php';?>
    </form>
</div><!--bg-secondary-->

<div class="bg-light contenedor shadow contactos">
    <div class="contenedor-contactos">
        <h2>Contactos</h2>

        <input type="text" id="buscar" class="buscador" placeholder="Buscar contactos...">
        <p class="total-contactos"><span></span> Contactos</p>
        <div class="contenedor-tabla">
            <table id="listado-contactos" class="listado-contactos">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Empresa</th>
                        <th>Teléfono</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <?php $contactos = obtenerContactos();
                    if($contactos->num_rows) {
                        foreach ($contactos as $contacto) {
                    ?>
                        <tr>
                            <td><?php echo $contacto['nombre'];?></td>
                            <td><?php echo $contacto['empresa'];?></td>
                            <td><?php echo $contacto['telefono'];?></td>
                            <td>
                                <a class="btn-editar btn" href="editar.php?id=<?php echo $contacto['id'];?>">
                                    <i class="fas fa-pen-square"></i>
                                </a>
                                <button data-id="<?php echo $contacto['id'];?>" type="button" class="btn-borrar btn">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                            </td>
                        </tr>
                    <?php 
                        } // cierre FOREACH
                    } //cierre IF $contactos 
                    ?>
                </tbody>
            </table>
        </div><!--.contenedor-tabla-->
    </div><!--.contenedor-contactos-->
</div><!--bg-light-->

<?php include 'inc/layout/footer.php'; ?>