
const express = require('express')
const bodyParser= require('body-parser')
const nodemailer = require('nodemailer')
const { google } = require('googleapis')
const dotenv = require('dotenv');
dotenv.config();

const OAuth2 = google.auth.OAuth2
const oauth2Client = new OAuth2(
process.env.CLIENT_ID,
process.env.CLIENT_SECRET,
"https://developers.google.com/oauthplayground")

oauth2Client.setCredentials({refresh_token:process.env.Refresh_Token})
const accessToken = oauth2Client.getAccessToken()




const app = express()
const port = process.env.PORT || 5000

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(express.static('public'))



app.route("/").get(function (req, res) {
    res.sendFile(process.cwd() + "index.html");
  });






app.get('/', (req, res) => {
  res.send('Hello World!')
})



app.post('/contact',(req,response)=>{
    const output=`
    <p>You have a new contact request</p>

    <h3>Contact details</h3>
    <ul>
    <li>FirstName: ${req.body.name}</li>

    <li>Email: ${req.body.email}</li>

    </ul>`

    const smtpTrans = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth:{
        type:"OAuth2",
        user:process.env.GMAIL_USER,
        clientId:process.env.Client_ID,
        clientSecret:process.env.Client_Secret,
        refreshToken:process.env.Refresh_Token,
        accessToken:accessToken
    }});

    const mailOpts = {
        from:process.env.GMAIL_USER,
        to:process.env.RECIPIENT,
        subject:'New message from Nodemailer-contact-form', 
        html:output,
    };

    smtpTrans.sendMail(mailOpts,(error,res)=>{
        if(error){
        console.log(error);
        }
        else{
         console.log("Message sent: " + res.message);
         response.status(200).send(200)
         }
        })

});
       

  

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});