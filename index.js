const express = require("express"); 
const bodyParser = require("body-parser") 
const functions = require('firebase-functions');
//const auth = require('./middleware/authentication')
// New app using express module 

var admin = require("firebase-admin");

var serviceAccount = require("./Key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://intern-37cf2.firebaseio.com"
});
const db = admin.firestore();
const app = express(); 
app.use(bodyParser.urlencoded({ 
    extended:true
}));
app.use(bodyParser.json())

app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/data.html");
})
app.get('/test', (req, res) => {

    res.send("Server is running....");
  });
  app.get('/add',async(req,res)=>{
    const userData = {
        title : req.body.title,
        description: req.body.description
        //username: req.body.username,
    };
   /* const userCredentials = {
        title: userData.title,
         description: userData.description,
        //password: userData.password,
        createdAt: new Date().toISOString()
       
    };*/
    const Busboy = require("busboy");
    const path = require("path");
    const os = require("os");
    const fs = require("fs");
    const busboy = new Busboy({ headers: req.headers })

    let noteToBeUploaded = {};
    let noteFileName;

    let noteDetails = {}
    let imageToBeUploaded = {};
    let imageFileName;
    // String for image token
   // let generatedToken = uuid();
  
    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
      console.log(fieldname, file, filename, encoding, mimetype);
      if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
        return res.status(400).json({ error: "Wrong file type submitted" });
      }
      // my.image.png => ['my', 'image', 'png']
      const imageExtension = filename.split(".")[filename.split(".").length - 1];
      // 32756238461724837.png
    //   imageFileName = `${Math.round(
    //     Math.random() * 1000000000000
    //   ).toString()}.${imageExtension}`;
    imageFileName="hello";
      const filepath = path.join(os.tmpdir(), imageFileName);
      imageToBeUploaded = { filepath, mimetype };
      console.log(filepath)
      file.pipe(fs.createWriteStream(filepath));
    });
    const x="intern-37cf2.appspot.com"
    busboy.on("finish", () => {
      admin
        .storage()
        .bucket(x)
        .upload(imageToBeUploaded.filepath, {
          resumable: false,
          metadata: {
            metadata: {
              contentType: imageToBeUploaded.mimetype,
              //Generate token to be appended to imageUrl
        //    firebaseStorageDownloadTokens: generatedToken,
            },
          },
        })
        .then(() => {
          // Append token to url
          const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${x}/o/${imageFileName}?alt=media`;
          return db.doc(`/users/abcd`).update({ imageUrl });
        })
        .then(() => {
          return res.json({ message: "image uploaded successfully" });
        })
        .catch((err) => {
          console.error(err);
          return res.status(500).json({ error: "something went wrong" });
        });
    });
    busboy.end(req.rawBody);
    /*await busboy.on("field", (field, val) => {
        console.log(`Processed field ${field}: ${val}.`);
        const fieldName = field;
        noteDetails[fieldName] = val;
    });
   // noteDetails.name = req.user.username;
console.log(noteDetails)
    // String for note token
    //let generatedToken = uuid();

    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
        //console.log(fieldname, file, filename, encoding, mimetype);
      //  if (mimetype !== "application/pdf" && mimetype !== "application/msword" && mimetype !=="application/octet-stream") {
        //    return res.status(400).json({ error: "Wrong file type submitted" });
        //}
        //my.note.pdf => ['my', 'note', 'pdf']
        const noteExtension = filename.split(".")[filename.split(".").length - 1];
        // 32756238461724837.pdf
        const randomnumber = `${Math.round(Math.random() * 1000000000000).toString()}.${noteExtension}`;
        const y="hello";
        console.log(randomnumber);
     //   noteFileName = `${randomnumber}${y}`;
     noteFileName = "hello";   
     console.log('file name: ',noteFileName);
        

        const filepath = path.join(os.tmpdir(), noteFileName);
        noteToBeUploaded = { filepath, mimetype };
        file.pipe(fs.createWriteStream(filepath));
    });
var x="intern-37cf2.appspot.com"
    busboy.on("finish", () => {
        admin
            .storage()
            .bucket(x)
            .upload(noteToBeUploaded.filepath, {
                resumable: false,
                metadata: {
                    metadata: {
                        contentType: noteToBeUploaded.mimetype,
                        //Generate token to be appended to noteUrl
                       // firebaseStorageDownloadTokens: generatedToken,
                    },
                },
            })
                
            const noteURl = `https://firebasestorage.googleapis.com/v0/b/${x}/o/${noteFileName}?alt=media`;
                
            noteDetails.noteUrl = noteURl;
            noteDetails.createdAt = new Date().toISOString();
            db.doc(`/users/${userData.title}`).set(noteDetails)
            //console.log("ayush is a good boy")
           // res.status(200).json({"otp" : 'otp sent successfully'});
          



          //  const contri = req.user.contribution + 1;
            //db.doc(`/users/${req.user.username}`).update({contribution: contri});

            // db.collection('notes').add(noteDetails)
            // .then((doc) => {
            //     //console.log(noteDetails);
            //     db.doc(`/notes/${doc.id}`).update({noteId: doc.id})
            //     return res.json(doc.id);    
            // }).catch(error => {
            //     return res.json({erors: "note not uploaded"}); 
            //     console.log(error);
            // })      
    });
    
    busboy.end(req.rawBody);*/










   })
app.listen(301,()=>{
    console.log("Server Running");
})
