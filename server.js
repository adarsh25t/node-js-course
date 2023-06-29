const dotenv = require('dotenv');
const app = require("./app");
const { default: mongoose } = require('mongoose');

dotenv.config({path:'./config.env'})

const port = process.env.PORT || 3001;
const DB =  process.env.DB.replace('<password>',process.env.DB_PASSWORD)
mongoose.connect(DB).then(res =>  console.log(`DB CONNECTED SUCCESSFULLY`))

app.listen(port, ()=>{
    console.log(`app started on port ${port}`);
})