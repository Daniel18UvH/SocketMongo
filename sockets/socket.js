const Usuario = require("../models/usuario");
const Producto = require("../models/productos");

function socket(io) {
    io.on("connection", (socket) => {
        //MOSTRAR USUARIOS
        mostrarUsuarios();
        async function mostrarUsuarios() {
            const usuarios = await Usuario.find();
            io.emit("servidorEnviarUsuarios", usuarios);
        }

        //Guardar usuario
        socket.on("clienteGuardarUsuario", async (usuario) => {
            try {
                if (usuario.id && usuario.id !== "") {
                    await Usuario.findByIdAndUpdate(usuario.id, usuario);
                    io.emit("servidorUsuarioGuardado", "Usuario actualizado");
                }
                else {
                    await new Usuario(usuario).save();
                    io.emit("servidorUsuarioGuardado", "Usuario guardado");
                }
            } catch (error) {
                console.log(error);
            }
            mostrarUsuarios();
        });

        //Obtener usuario por id
        socket.on("clienteObtenerUsuarioPorId", async (id) => {
            const usuario = await Usuario.findById(id);
            io.emit("servidorObtenerUsuarioPorId", usuario);
        });

        //Borrar usuario por id
        socket.on("clienteBorrarUsuario", async (id) => {
            try {
                await Usuario.findByIdAndDelete(id);
                io.emit("servidorUsuarioGuardado", "Usuario borrado");
                mostrarUsuarios();
            }
            catch (error) {
                console.log(error);
            }
        });


        // Mostrar Productos
        mostrarProductos();
        async function mostrarProductos() {
            try {
                const productos = await Producto.find();
                io.emit("servidorEnviarProductos", productos);
            } catch (error) {
                console.log(error);
            }
        }

        // Guardar Productos
        socket.on("clienteGuardarPro", async (producto) => {
            try {
                if (producto.id && producto.id !== "") {
                    await Producto.findByIdAndUpdate(producto.id, producto);
                    io.emit("servidorProductoGuardado", "Producto actualizado");
                } else {
                    await new Producto(producto).save();
                    io.emit("servidorProductoGuardado", "Producto guardado");
                }
            } catch (error) {
                console.log(error);
            }
            mostrarProductos();
        });

        // Obtener producto por id
        socket.on("clienteObtenerProductoPorId", async (id) => {
            try {
                const producto = await Producto.findById(id);
                io.emit("servidorObtenerProductoPorId", producto);
            } catch (error) {
                console.log(error);
            }
        });

        // Borrar Producto
        socket.on("clienteBorrarProducto", async (id) => {
            try {
                await Producto.findByIdAndDelete(id);
                io.emit("servidorProductoBorrado", "Producto borrado");
                mostrarProductos();
            } catch (err) {
                console.error("Error al borrar producto");
            }
        });


    });//Fin de io.on("connection")
}


module.exports = socket;


