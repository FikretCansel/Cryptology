import express, { NextFunction, Request, Response, Express } from "express";
import { mongoConnect } from "./dataAccess/mongoDb/context/mongoAlchaContext";
import http from "http";
import {saveMessage,getChats} from "./dataAccess/mongoDb/moChatDal";
import {getSecretKey} from "./dataAccess/mongoDb/moSecretKey";
import cors from "cors"
import path from "path";
import Message from "./models/chatGroups/Message";
import { ObjectId, WithId } from "mongodb";
import CryptoJS from "crypto-js";


var bodyParser = require('body-parser');

const app: Express = express();
const server = http.createServer(app);
app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
  credentials: true
}));


app.get('/', function(req:Request,res:Response,next:NextFunction) {
  let error = req.query.error || false;
  res.render('login', { error: error });
});

app.get("/chat",async(req:Request,res:Response,next:NextFunction)=>{
  const userName = req.query.userName;
  if (userName===undefined) res.redirect('/');
  const result = req.query.result;

  const keyDoc = await getSecretKey();

  if(!keyDoc){
    res.redirect(`/chat?userName=${userName}&&result=false`);
    return;
  }

  getChats().then((data)=>{
    data.forEach(element => {
      var bytes  = CryptoJS.AES.decrypt(element.message, keyDoc.key);
      var originalText = bytes.toString(CryptoJS.enc.Utf8);
      element.message=originalText;
    });
    
    let lastItem = data[data.length-1];
    if (lastItem === undefined) lastItem={_id:new ObjectId(),message:"Son kayıt Bulunamadı!!"}
    res.render('chat', {username: userName,chats:data,result:result,lastItem:lastItem});
  }).catch(()=>{
    res.render('chat', {username: userName,chats:[],result:result});
  })
})

app.post('/users/login',(req:Request,res:Response,next:NextFunction)=> {
  const username = req.body.username;
  const password = req.body.password;
  if(username==="fikret" && password==="fikret"){
    res.redirect(`/chat?userName=${username}`);
  }else res.redirect("/?error=true");
});

app.post('/chat/add',async (req:Request,res:Response,next:NextFunction)=> {
  let message : Message= req.body;
  const userName = req.query.userName;

  const keyDoc = await getSecretKey();

  if(!keyDoc){
    res.redirect(`/chat?userName=${userName}&&result=false`);
    return;
  }

  var ciphertext = CryptoJS.AES.encrypt(message.message, keyDoc?.key).toString();
  message.message=ciphertext;

  saveMessage(message).then(()=>{
    res.redirect(`/chat?userName=${userName}`);
  }).catch((err)=>{
    res.redirect('/chat?result=false',);
  })
});

mongoConnect(() => {
  const port = 3000;
  server.listen(port, () => console.log(`Run on port ${port}`));
});