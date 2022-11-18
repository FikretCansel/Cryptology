import Message from "../../models/chatGroups/Message";
import { getDb } from "./context/mongoAlchaContext";

export const getChats = () => {
    const db = getDb();
    // console.log(db.listCollections());
    return db.collection("chats").find({}).toArray();
}

export const saveMessage = (message: Message) => {
    const db = getDb();
    
    return db.collection("chats").insertOne(message);
}
