// Using MongoDB Native Driver

require("dotenv").config();
const data = require("./data.js");
const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
app.get("/", async function(req, res) {
    const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.fl6wx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("Connected Successfully");

        const db = client.db("quiz");
        const questions = db.collection("questions");
        const options = db.collection("options");
        const answers = db.collection("answers");

        for (var [key, value] of Object.entries(data)) {
            const result = await eval(key).insertMany(value, { ordered: true });
            console.log(`${result.insertedCount} documents were inserted in ${eval(key).namespace}`);
            res.json({message: `${result.insertedCount} documents were inserted in ${eval(key).namespace}`,
                data: value
            });
        }
        

    }catch (error){
        console.log(error)
    }finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
});

app.listen(3000, ()=>console.log("Server started at port 3000"))
