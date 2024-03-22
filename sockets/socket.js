const Usuario = require("../modelos/usuario");
const Producto = require("../modelos/producto");

function socket(io) {
    io.on("connection", async (socket) => {

        // MOSTRAR USUARIOS
        
        mostrarUsuarios();

        async function mostrarUsuarios() {
            const usuarios = await Usuario.find();
            io.emit("servidorEnviarUsuarios", usuarios);
        }

        // GUARDAR USUARIOS

        socket.on("clienteGuardarUsuario", async (usuario) => {
            console.log("Guardar usuario");
            console.log(usuario);
            try {
                await new Usuario(usuario).save();
                io.emit("ServidorUsuarioRegistrado", "Usuario registrado");
                mostrarUsuarios();
                console.log("Usuario guardado");
            } catch (err) {
                console.log("Error al registrar al usuario" + err);
            }
        });

        // EDITAR UN USUARIO

        socket.on("clienteEditarUsuario", async (id) => {
            try {
                const usuario = await Usuario.findById(id);
                socket.emit("servidorEnviarDatosUsuario", usuario);
            } catch (error) {
                console.log("Error al obtener usuario para edición:", error);
            }
        });

        // ACTUALIZAR UN USUARIO

        socket.on("clienteActualizarUsuario", async (datosUsuario) => {
            const { id, datosActualizar } = datosUsuario;
            try {
                const usuarioActualizado = await Usuario.findByIdAndUpdate(id, datosActualizar, { new: true });
                console.log("Usuario actualizado:", usuarioActualizado);
                io.emit("ServidorUsuarioActualizado", "Usuario actualizado");
                mostrarUsuarios();
            } catch (error) {
                console.log("Error al actualizar usuario:", error);
            }
        });

        // ELIMINAR UN USUARIO

        socket.on("clienteBorrarUsuario", async (id) => {
            try {
                await Usuario.findByIdAndDelete(id);
                console.log("Usuario eliminado:", id);
                io.emit("ServidorUsuarioBorrado", "Usuario borrado");
                mostrarUsuarios();
            } catch (error) {
                console.log("Error al borrar usuario:", error);
            }
        });

        ////////////////////////////////////////////////////////////////////////////

        // MOSTRAR PRODUCTOS

        mostrarProductos();

        async function mostrarProductos() {
            const productos = await Producto.find();
            io.emit("servidorEnviarProductos", productos);
        }

        socket.on("clienteGuardarProducto", async (producto) => {
            console.log("Guardar producto");
            console.log(producto);
            try {
                await new Producto(producto).save();
                io.emit("servidorProductoRegistrado", "Producto registrado"); 
                mostrarProductos();
                console.log("Producto guardado");
            } catch (err) {
                console.log("Error al registrar el producto" + err);
            }
        });

         // EDITAR UN PRODUCTO

         socket.on("clienteEditarProducto", async (id) => {
            try {
                const producto = await Producto.findById(id);
                socket.emit("servidorEnviarDatosProducto", producto);
            } catch (error) {
                console.log("Error al obtener producto para edición:", error);
            }
        });

        // ACTUALIZAR UN PRODUCTO

        socket.on("clienteActualizarProducto", async (datosProducto) => {
            const { id, datosActualizar } = datosProducto;
            try {
                const productoActualizado = await Producto.findByIdAndUpdate(id, datosActualizar, { new: true });
                console.log("Producto actualizado:", productoActualizado);
                io.emit("ServidorProductoActualizado", "Producto actualizado");
                mostrarProductos();
            } catch (error) {
                console.log("Error al actualizar producto:", error);
            }
        });

        // ELIMINAR UN PRODUCTO

        socket.on("clienteBorrarProducto", async (id) => {
            try {
            await Producto.findByIdAndDelete(id);
            console.log("Producto eliminado:", id);
            io.emit("servidorProductoBorrado", "Producto borrado");
            mostrarProductos();
        } catch (error) {
            console.log("Error al borrar producto:", error);
        }
     });

   });
}

module.exports = socket;