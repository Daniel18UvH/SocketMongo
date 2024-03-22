const socket = io();

var mensajeDiv = document.getElementById("mensaje");
var datos = document.getElementById("datos");

// MOSTRAR DATOS DE MONGODB

socket.on("servidorEnviarProductos", (productos) => {
    
    var tr = "";
    productos.forEach((producto, idLocal) => {
        tr += `
            <tr>
                <td>${(idLocal + 1) * 100}</td>
                <td>${producto.nombre}</td>
                <td>${producto.categoria}</td>
                <td>${producto.precio}</td>
                <td style="text-align: center;">
                <a href="#" onClick="editarProducto('${producto._id}')" style="display: inline-block; padding: 5px 15px; border-radius: 5px; background-color: #2E8B57; color: white; text-align: center; text-decoration: none; transition: background-color 0.3s;" onmouseover="this.style.backgroundColor='#228B22'" onmouseout="this.style.backgroundColor='#2E8B57'">Editar</a>
                <a href="#" onClick="borrarProducto('${producto._id}')" style="display: inline-block; padding: 5px 15px; border-radius: 5px; background-color: #FF0000; color: white; text-align: center; text-decoration: none; transition: background-color 0.3s;" onmouseover="this.style.backgroundColor='#B22222'" onmouseout="this.style.backgroundColor='#FF0000'">Borrar</a>
            </td>
            
            </tr>
        `;
    });

    datos.innerHTML = tr;
});

document.getElementById("borrarDatos").addEventListener("click", () => {
    document.getElementById("nombreProducto").value = "";
    document.getElementById("descripcionProducto").value = "";
    document.getElementById("categoriaProducto").value = "";
    document.getElementById("precioProducto").value = "";
});


// GUARDAR DATOS A MONGODB

var enviarDatos = document.getElementById("enviarDatos");

enviarDatos.addEventListener("submit", (e) => {
    e.preventDefault();

    //RECIBIR LOS DATOS DEL FORMULARIO

    var producto = {
        nombre: document.getElementById("nombreProducto").value,
        categoria: document.getElementById("categoriaProducto").value,
        precio: document.getElementById("precioProducto").value,
    };
    socket.emit("clienteGuardarProducto", producto);
});

// MUESTRA MENSAJE DE PRODUCTO REGISTRADO

socket.on("servidorProductoRegistrado", (mensaje) => {
    console.log(mensaje);
    mensajeDiv.innerHTML = mensaje;
    setTimeout(() => {
        mensajeDiv.innerHTML = "";
    }, 3000);


    //REINICIAR EL FORMULARIO

    document.getElementById("nombre").value = "";
    document.getElementById("categoria").value = "";
    document.getElementById("precio").value = "";
    document.getElementById("nombre").focus();
});

// EDITAR UN PRODUCTO

function editarProducto(id) {
    socket.emit("clienteEditarProducto", id);
}

// ELIMINAR UN REGISTRO DE MONGODB

function borrarProducto(id) {
    socket.emit("clienteBorrarProducto", id);
}


// MUESTRA MENSAJE DE PRODUCTO BORRADO

socket.on("servidorProductoBorrado", (mensaje) => {
    console.log(mensaje);
    mensajeDiv.innerHTML = mensaje;
    setTimeout(() => {
        mensajeDiv.innerHTML = "";
    }, 3000);
});

// RECIBIR DATOS DEL PRODUCTO PARA EDITAR

socket.on("servidorEnviarDatosProducto", (producto) => {
    document.getElementById("editIdProducto").value = producto._id;
    document.getElementById("editNombreProducto").value = producto.nombre;
    document.getElementById("editCategoriaProducto").value = producto.categoria;
    document.getElementById("editPrecioProducto").value = producto.precio;

    document.getElementById("enviarDatos").style.display = "none";
    document.getElementById("editarDatos").style.display = "block";
});

// BOTÓN DE CANCELAR EN EL FORMULARIO DE EDITAR 

document.getElementById("cancelarEdicion").addEventListener("click", () => {
    document.getElementById("editarDatos").style.display = "none";
    document.getElementById("enviarDatos").style.display = "block";
});

// ACTUALIZAR UN PRODUCTO

var editarDatosProducto = document.getElementById("editarDatos");

editarDatosProducto.addEventListener("submit", (e) => {
    e.preventDefault();

    var producto = {
        id: document.getElementById("editIdProducto").value,
        datosActualizar: {
            nombre: document.getElementById("editNombreProducto").value,
            categoria: document.getElementById("editCategoriaProducto").value,
            precio: document.getElementById("editPrecioProducto").value,
        },
    };

    socket.emit("clienteActualizarProducto", producto);

    // MUESTRA MENSAJE DE PRODUCTO ACTUALIZADO

    socket.on("ServidorProductoActualizado", (mensaje) => {
        console.log(mensaje);
        mensajeDiv.innerHTML = mensaje;
        setTimeout(() => {
            mensajeDiv.innerHTML = "";
        }, 3000);
    });

    // REINICIAR EL FORMULARIO
    
    document.getElementById("editarDatos").reset();
    document.getElementById("enviarDatos").style.display = "block";
    document.getElementById("editarDatos").style.display = "none";
});


