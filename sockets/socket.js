const Usuario=require("../modelos/usuario");
function socket(io){
    io.on("connection",(socket)=>{
        //MOSTRAR USUARIOS
        mostrarUsuarios();
        async function mostrarUsuarios(){
            const usuarios=await Usuario.find();
            io.emit("servidorEnviarUsuarios", usuarios);
        }
        
        //GUARDAR USUARIO
        socket.on("clienteGuardarUsuario", async(usuario)=>{
            try{
                if(usuario.id==""){
                    await new Usuario(usuario).save();
                    io.emit("servidorUsuarioGuardado","Usuario guardado");
                }
                else{
                    await Usuario.findByIdAndUpdate(usuario.id,usuario);
                    io.emit("servidorUsuarioGuardado","Usuario modificado");
                }
                mostrarUsuarios();

            }
            catch(err){
                console.log("Error al registrar al usuario "+err);
            }
        });

        //OBTENER USUARIO POR ID
        socket.on("clienteObtenerUsuarioPorID",async(id)=>{
            const usuario=await Usuario.findById(id);
            io.emit("servidorObtenerUsuarioPorID",usuario);
        });

        //BORRAR USUARIO POR ID
        socket.on("clienteBorrarUsuario",async(id)=>{
            await Usuario.findByIdAndDelete(id);
            io.emit("servidorUsuarioGuardado","Usuario borrado");
            mostrarUsuarios();
        });

    });//FIN IO.ON
}
module.exports=socket;