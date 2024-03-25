const socket = io();
var mensajeDiv = document.getElementById("mensaje");
var datosPro = document.getElementById("datosPro");

//Mostar datos de MongoDB de productos
socket.on("servidorEnviarProductos", (productos) => {
    var tr = "";
    productos.forEach((producto, idLocal) => {
        tr = tr + `
        <tr>
            <td>${idLocal + 1}</td>
            <td>${producto.nombre}</td>
            <td>${producto.precio}</td>
            <td>${producto.cantidad}</td>
            <td>
            <a href="#" onClick="editarProducto('${producto._id}')">Editar</a>
            <a href="#" onClick="borrarProducto('${producto._id}')">Borrar</a>
            </td>
        </tr>
        
        `;
    });
    datosPro.innerHTML = tr;
});

//Guardar datos de MongoDB de productos
var enviarDatosPro = document.getElementById("enviarDatosPro");
enviarDatosPro.addEventListener("submit", (e) => {
    e.preventDefault();
    var producto = {
        nombre: document.getElementById("nombre").value,
        precio: document.getElementById("precio").value,
        cantidad: document.getElementById("cantidad").value
    };
    socket.emit("clienteGuardarPro", producto);
    socket.on("servidorProductoGuardado", (mensaje) => {
        console.log(mensaje);
        mensajeDiv.innerHTML = mensaje;
        setTimeout(() => {
            mensajeDiv.innerHTML = "";
        }, 2000);
    });

    document.getElementById("nombre").value = "";
    document.getElementById("precio").value = "";
    document.getElementById("cantidad").value = "";
    document.getElementById("nombre").focus();
});

//Modificar Producto
function editarProducto(id) {
    window.location.href = 'editarProducto.html?id=' + id;
}

//Borrar Producto
function borrarProducto(id) {
    socket.emit("clienteBorrarProducto", id);
    socket.on("servidorProductoBorrado", (mensaje) => {
        mensajeDiv.innerHTML = mensaje;
        setTimeout(() => {
            mensajeDiv.innerHTML = "";
            location.reload();
        }, 1000);
    });
}