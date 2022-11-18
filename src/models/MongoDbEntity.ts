import { ObjectId } from "mongodb";
import IUser from "./IUser";

export default class MongoDbEntity{
    _id:ObjectId;


    constructor(_id: ObjectId) {
      this._id=_id;
    }
  }