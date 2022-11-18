import { ObjectId } from "mongodb";
import IUser from "./IUser";
import MongoDbEntity from "./MongoDbEntity";

export default class User extends MongoDbEntity implements IUser{
    email:string;
    password:string;
    userName:string;
    socketId:string;

    constructor(email: string,password:string,userName:string,_id:ObjectId) {
      super(_id);
      this.email=email;
      this.password=password;
      this.userName=userName;
      this.socketId="";
    }
  }