import Message from "../../models/chatGroups/Message";
import { getDb } from "./context/mongoAlchaContext";

export const getSecretKey = () => {
    const db = getDb();
    // console.log(db.listCollections());
    return db.collection("secretKeys").findOne({});
}
