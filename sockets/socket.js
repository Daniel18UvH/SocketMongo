const Usuario = require("../modelos/usuario");
const Producto = require("../modelos/producto");

// Conexión con la base de datos y el cliente

function socket(io) {
  io.on("connection", (socket) => {
    // Mostrar usuarios
    mostrarUsuarios();
    async function mostrarUsuarios() {
      const usuarios = await Usuario.find();
      io.emit("ServidorEnviarUsuarios", usuarios);
    }

    // Mostrar productos
    mostrarProductos();
    async function mostrarProductos() {
      const productos = await Producto.find();
      io.emit("ServidorEnviarProductos", productos);
    }

    // Guardar usuario
    socket.on("clienteGuardarUsuario", async (usuario) => {
      console.log(usuario);
      try {
        await new Usuario(usuario).save();
        io.emit("servidorUsuarioGuardado", "Usuario Guardado");
      } catch (err) {
        console.error("Error al registrar usuario");
      }
    });

    // Guardar producto
    socket.on("clienteGuardarProducto", async (producto) => {
      try {
        await new Producto(producto).save();
        io.emit("servidorProductoGuardado", "Producto Guardado");
      } catch (err) {
        console.error("Error al registrar producto");
      }
    });

    // Editar usuario correspondiente al id
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
            pass: usuarioEditado.pass,
          },
          { new: true }
        ); // Para obtener el documento actualizado

        io.emit("servidorUsuarioEditado", usuarioActualizado);
      } catch (err) {
        console.error("Error al editar usuario:", err);
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
            marca: productoEditado.marca,
            cantidad: productoEditado.cantidad,
          },
          { new: true }
        ); // Para obtener el documento actualizado

        io.emit("servidorProductoEditado", productoActualizado);
      } catch (err) {
        console.error("Error al editar producto:", err);
      }
    });

    // Borrar usuario
    socket.on("clienteBorrarUsuario", async (id) => {
      try {
        await Usuario.findByIdAndDelete(id);
        io.emit("servidorUsuarioBorrado", "Usuario Borrado");
      } catch (err) {
        console.error("Error al borrar usuario");
      }
    });

    // Borrar producto
    socket.on("clienteBorrarProducto", async (id) => {
      try {
        await Producto.findByIdAndDelete(id);
        io.emit("servidorProductoBorrado", "Producto Borrado");
        mostrarProductos();
      } catch (err) {
        console.error("Error al borrar producto");
      }
    });
  }); // Fin io on
}

module.exports = socket;
