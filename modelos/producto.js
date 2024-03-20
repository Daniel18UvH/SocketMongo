const { mongoose } = require("../bd/conexion");
const productoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        require: true,
    },
    marca: {
        type: String,
        require: true,
    },
    cantidad: {
        type: Number,
        require: true,
    },
    estatus: {
        type: Boolean,
        default: true,
    },
});
module.exports = mongoose.model('producto', productoSchema);
