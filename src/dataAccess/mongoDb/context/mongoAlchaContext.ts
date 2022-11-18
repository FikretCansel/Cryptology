import mongoDb, { Db, MongoClient } from "mongodb";

let _db : Db;
export const mongoDbConnectionString : string= "mongodb://localhost:27017/Alcha?readPreference=primary&appname=MongoDB%20Compass%20Isolated%20Edition&directConnection=true&ssl=false";

export const mongoConnect=(callback : Function)=>{
    MongoClient.connect(mongoDbConnectionString)
    .then((client : MongoClient)=>{
        console.log("Connected MongoDb");
        callback(client);
        _db=client.db();
    }).catch((err:Error)=>console.log("Detected error. "+err));
}

export const getDb=()=>{
    if(_db){
        return _db;
    }
    console.log("No database");
    throw "No database";
}