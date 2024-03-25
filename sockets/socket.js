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
                await new Usuario(usuario).save();
                io.emit("servidorUsuarioGuardado", "Usuario guardado");
                console.log("Usuario guardado");
            } catch (error) {
                console.log(error);
            }
        });

        // Editar usuario 
        socket.on("clienteEditarUsuarioId", async (id) => {
            try {
                const usuario = await Usuario.findById(id);
                io.emit("servidorUsuarioEditadoId", usuario);
            } catch (err) {
                console.error("Error al editar usuario");
            }
        });

        // Editar usuario
        socket.on("clienteEditarUsuario", async (usuarioEditado) => {
            try {
                const usuarioActualizado = await Usuario.findByIdAndUpdate(
                    usuarioEditado._id,
                    {
                        nombre: usuarioEditado.nombre,
                        usuario: usuarioEditado.usuario,
                        password: usuarioEditado.password,
                    },
                    { new: true }
                ); // Para obtener el documento actualizado

                io.emit("servidorUsuarioEditado", usuarioActualizado);
            } catch (err) {
                console.error("Error al editar usuario:", err);
            }
        });

        // Borrar usuario
        socket.on("clienteBorrarUsuario", async (id) => {
            try {
                await Usuario.findByIdAndDelete(id);
                io.emit("servidorUsuarioBorrado", "Usuario borrado");
            } catch (err) {
                console.error("Error al borrar usuario");
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
                await new Producto(producto).save();
                io.emit("servidorProductoGuardado", "Producto guardado");
                console.log("Producto guardado");
            } catch (error) {
                console.log(error);
            }
        });

        // Editar producto
        socket.on("clienteEditarProducto", async (id) => {
            try {
                const producto = await Producto.findById(id);
                io.emit("servidorProductoEditado", producto);
            } catch (err) {
                console.error("Error al editar producto");
            }
        });

        // Editar producto
        socket.on("clienteEditarProducto", async (productoEditado) => {
            try {
                const productoActualizado = await Producto.findByIdAndUpdate(
                    productoEditado._id,
                    {
                        id: productoEditado.id,
                        nombre: productoEditado.nombre,
                        precio: productoEditado.precio,
                        cantidad: productoEditado.cantidad,
                    },
                    { new: true }
                );

                io.emit("servidorProductoEditado", productoActualizado);
            } catch (err) {
                console.error("Error al editar producto:", err);
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


