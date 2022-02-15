// Using MongoDB Native Driver

require("dotenv").config();
const data = require("./data.js");
const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.fl6wx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

app.get("/", async function(req, res){
    console.log("Logged-in:",client.s.options.credentials.username);
    try {
        await client.connect();
        console.log("Connected Successfully");
        res.json({
            username: client.s.options.credentials.username
        })
    }catch (error){
        console.log(error)
    }finally {
        await client.close();
        console.log("Connection Closed Successfully!")
    }
})
// To insert data
app.get("/insert", async function(req, res) {
    console.log("Logged-in:",client.s.options.credentials.username);
    try {
        await client.connect();
        console.log("Connected Successfully");
        var collection_status = {};
        const db = client.db("quiz");
        const questions = db.collection("questions");
        const options = db.collection("options");
        const answers = db.collection("answers");
        for (var [key, value] of Object.entries(data)) {
            const result = await eval(key).insertMany(value, { ordered: true });
            if(result){collection_status[key] = true}
            else{collection_status[key] = false}
            console.log(`${result.insertedCount} documents were inserted in ${eval(key).namespace}`);
        }
        res.json(collection_status);
    }catch (error){
        console.log(error)
    }finally {
        await client.close();
        console.log("Connection Closed Successfully!")
    }
});

// To view data
app.get("/search/:collection/:id", async function(req, res) {
    console.log("Logged-in:",client.s.options.credentials.username);
    const Id = parseInt(req.params.id)
    try {
        await client.connect();
        console.log("Connected Successfully");

        const db = client.db("quiz");
        const table = db.collection(req.params.collection);
        const result = table.findOne({id:Id});
        if(result){
            res.json({
                message: "Record FOUND",
                result
            });
        }else{
            res.json({
                message: "FAILED to FIND"
            });
        }
    }catch (error){
        console.log(error)
    }finally {
        await client.close();
        console.log("Connection Closed Successfully!")
    }
});

// To Update
app.put("/update/:id", async function(req, res) {
    console.log("Logged-in:",client.s.options.credentials.username);
    const Id = parseInt(req.params.id)
    try {
        await client.connect();
        console.log("Connected Successfully");

        const db = client.db("quiz");
        const record = db.collection("questions").findOneAndUpdate({id: Id},{$set:{question: req.body.question}});
        if(record){
            res.json({
                message: "Record UPDATED",
                result
            });
        }else{
            res.json({
                message: "FAILED to UPDATE"
            });
        }
    }catch (error){
        console.log(error)
    }finally {
        // Ensures that the client will close when you finish/error
        await client.close();
        console.log("Connection Closed Successfully!")
    }
});

app.delete("/delete/:collection/:id", async function(req, res) {
    console.log("Logged-in:",client.s.options.credentials.username);
    const Id = parseInt(req.params.id)
    try {
        await client.connect();
        console.log("Connected Successfully");

        const db = client.db("quiz");
        const record = db.collection(req.params,collection).deleteOne({id: Id});
        if(record){
            res.json({
                message: "Record DELETED",
                result
            });
        }else{
            res.json({
                message: "FAILED to DELETE"
            });
        }
    }catch (error){
        console.log(error)
    }finally {
        // Ensures that the client will close when you finish/error
        await client.close();
        console.log("Connection Closed Successfully!")
    }
});

app.listen(3000, ()=>console.log("Server started at port 3000"))
