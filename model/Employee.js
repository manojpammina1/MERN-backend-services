const mongooes = require('mongoose');
const Schema = mongooes.Schema;

const employeeSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    }
});

module.exports = mongooes.model('Employee', employeeSchema);