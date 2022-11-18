// import User from "../../models/User";
// import cookieParser from "cookie-parser";
// import cookie from "cookie";
// import {sessionKey} from "../../applicationSettings"
// import {MongoDBStore} from "connect-mongodb-session";
// import IResult from "../../models/results/IResult";
// import Result from "../../models/results/Result";
// import DataResult from "../../models/results/DataResult";
// import IDataResult from "../../models/results/IDataResult";
// import { ObjectId } from "mongodb";

// export default function getUserByCookieString(Store : MongoDBStore,cookieString : string,updateSocketId : void,socketId : ObjectId) {
//   if(cookieString){
//     const cookieParsed = cookie.parse(cookieString);
//     const cookieParsedsId = cookieParsed["connect.sid"];
    
//     console.log(cookieParsedsId)
//     if (cookieParsedsId) {

//       const sidParsed  = cookieParser.signedCookie(cookieParsedsId, sessionKey);
//         Store.get(<string>sidParsed, (err, session) => {
//         if (err) throw("exx");
//         const user : User = session.user;
//         updateSocketId(user,socketId);
//       });
//     }
//   }

//   console.log("bulunan kullanıcı",findedUser)
//   return findedUser;
// }  