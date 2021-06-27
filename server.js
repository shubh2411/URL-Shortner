const express = require('express');
const app = express()
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl')

const uri = "mongodb+srv://shubhdb:shubhdb123@cluster0.lnlki.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

mongoose.connect(uri, { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
}, err => {
    if (err) {
        console.log(`Not connected to db ${err}`)
    } else {
        console.log('Successfully connected to db')
    }
})

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: false}))

app.get("/", async (req,res) => {
    const shortUrls = await ShortUrl.find()
    res.render('index', {shortUrls: shortUrls})
})

app.post("/shortUrls", async (req,res) => {
    await ShortUrl.create({full: req.body.fullUrl})
    res.redirect('/')
})

app.get("/:shortUrl", async (req, res) => {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
    console.log(shortUrl);
    if(shortUrl == null) return res.sendStatus(400)

    shortUrl.clicks++;
    shortUrl.save();

    res.redirect(shortUrl.full);
})

app.listen(3000, ()=> {
    console.log("server is running at 3000");
})