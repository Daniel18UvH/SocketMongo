const mongoose=require("mongoose");
require("dotenv").config();
const mongodb_pw=process.env.MONGO_ATLAS;
async function conectarMongo(){
    const mongoDB=mongodb_pw;
    mongoose.set("strictQuery", true);
    try {
        await mongoose.connect(mongoDB,{});
        console.log("Conectado a mongoDB");
    }
    
    catch(err){
        console.log("Error en la conexion a mongo"+err);
    }
    
}

module.exports={ mongoose, conectarMongo}

conectarMongo();