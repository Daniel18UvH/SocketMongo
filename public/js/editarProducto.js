const socket = io();
var enviarData = document.getElementById("enviarData");
var mensajeDiv = document.getElementById("mensaje");

window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    if (productId) {
        socket.emit("clienteEditarProducto", productId);
    }

    socket.on("servidorProductoEditado", (producto) => {
        document.getElementById("id").value = producto._id;
        document.getElementById("nombre").value = producto.nombre;
        document.getElementById("precio").value = producto.precio;
        document.getElementById("cantidad").value = producto.cantidad;
    });
});

// Editar producto
enviarData.addEventListener("submit", (e) => {
    e.preventDefault();
    var producto = {
        _id: document.getElementById("id").value,
        nombre: document.getElementById("nombre").value,
        precio: document.getElementById("precio").value,
        cantidad: document.getElementById("cantidad").value,
    };

    socket.emit("clienteEditarProducto", producto);
    socket.on("servidorProductoEditado", (producto) => {
        mensajeDiv.innerHTML = "Producto editado";
        setTimeout(() => {
            mensajeDiv.innerHTML = "";
            location.href = "productos.html";
        }, 2000);
    });
});