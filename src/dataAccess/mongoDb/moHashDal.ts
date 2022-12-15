import { ObjectId } from "mongodb";
import Message from "../../models/chatGroups/Message";
import { getDb } from "./context/mongoAlchaContext";

export const saveHash = (hash: string) => {
    const db = getDb();
    
    return db.collection("hashs").insertOne({hash});
}
export const getHash = (id:string) => {
    const db = getDb();
    // console.log(db.listCollections());
    return db.collection("hashs").findOne({_id:new ObjectId(id)});
}