const mongooes = require('mongoose');

const connectDB = async () => {
    try{
        await mongooes.connect(process.env.DATABASE_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    }catch(err){
        console.error(err);
    }
}

module.exports = connectDB;