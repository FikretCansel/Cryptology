import { getDb } from "./context/mongoAlchaContext";

export const getPublicKey = () => {
    const db = getDb();
    // console.log(db.listCollections());
    return db.collection("publicKeys").findOne({});
}
