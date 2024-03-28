const { mongoose } = require('../database/conexion');
const usuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    usuario: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    }
});


module.exports = mongoose.model('usuario', usuarioSchema);