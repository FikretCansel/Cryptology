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
import fs from "fs";
import crypto from "crypto";
import bcrypt from "bcrypt";


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
  console.log("Sılaş çalıştı")
  res.render('login', { error: error });
});

app.get('/signature',async function(req:Request,res:Response,next:NextFunction) {
  const randomNumber=crypto.randomInt(1000000000,9999999999);
  const genSalt = await bcrypt.genSalt();
  let hashedNumber = await bcrypt.hash(randomNumber.toString(),genSalt);

  let encrypyedHash = encryptText(hashedNumber);
  
  res.render('signature',{random:randomNumber,hashedNumber,encrypyedHash});
});


export function encryptText (plainText: string) {
  return crypto.publicEncrypt({
    key: fs.readFileSync('privateKey.txt', 'utf8'),
    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    oaepHash: 'sha256'
  },
  // We convert the data string to a buffer
  Buffer.from(plainText)
  );
}

export function decryptText (encryptedText) {
  return crypto.privateDecrypt(
    {
      key: fs.readFileSync('privateKey.txt', 'utf8'),
      // In order to decrypt the data, we need to specify the
      // same hashing function and padding scheme that we used to
      // encrypt the data in the previous step
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256'
    },
    encryptedText
  );
}

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


app.post('/encrypt-image',async(req:Request,res:Response,next:NextFunction)=> {
  let userName="fikret";
  fs.readFile('image.jpg', async function(err, data) {
  if (err) throw err // Fail if the file can't be read.
  console.log(data);
  let stringData = data.toString("base64");
  const defaultBuf = Buffer.from(stringData,"base64");
  console.log("defaultBuf",defaultBuf)

  const keyDoc = await getSecretKey();
  console.log("Key",keyDoc)
  var ciphertext = CryptoJS.AES.encrypt(stringData, keyDoc?.key).toString();
  var base64ParseCipherWord = CryptoJS.enc.Base64.parse(ciphertext);
  const base64ParseCipherText = CryptoJS.enc.Base64.stringify(base64ParseCipherWord);
  const buf = Buffer.from(base64ParseCipherText,"base64");
  console.log("Şifreli buf",buf)
  http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'image/jpeg'})
    res.end(buf2) // Send the file data to the browser.
  }).listen(3001)
  var decryptedText = CryptoJS.AES.decrypt(ciphertext, keyDoc?.key).toString();
  
  var base64ParseDeCryptedWord = CryptoJS.enc.Base64.parse(decryptedText);
  const base64ParseDeCryptedText = CryptoJS.enc.Base64.stringify(base64ParseDeCryptedWord);

  const buf2 = Buffer.from(base64ParseDeCryptedText,"base64");
  console.log("decryptedBuf",buf2)

  http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'image/jpeg'})
    res.end(buf2) // Send the file data to the browser.
  }).listen(3002)

})
  res.redirect(`/chat?userName=${userName}`);
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