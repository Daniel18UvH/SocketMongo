const socket = io();
var enviarData = document.getElementById("enviarData");
var mensajeDiv = document.getElementById("mensaje");

window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');
    if (userId) {
        socket.emit("clienteEditarUsuarioId", userId);
    }

    socket.on("servidorUsuarioEditadoId", (usuario) => {
        document.getElementById("id").value = usuario._id;
        document.getElementById("nombre").value = usuario.nombre;
        document.getElementById("usuario").value = usuario.usuario;
        document.getElementById("password").value = usuario.password;
    });
});

// Editar usuario
enviarData.addEventListener("submit", (e) => {
    e.preventDefault();
    var usuario = {
        _id: document.getElementById("id").value,
        nombre: document.getElementById("nombre").value,
        usuario: document.getElementById("usuario").value,
        password: document.getElementById("password").value,
    };

    socket.emit("clienteEditarUsuario", usuario);
    socket.on("servidorUsuarioEditado", (usuario) => {
        mensajeDiv.innerHTML = "Usuario editado";
        setTimeout(() => {
            mensajeDiv.innerHTML = "";
            location.href = "index.html";
        }, 2000);
    });
});