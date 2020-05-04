require('dotenv').config()
const express=require('express')
const app=express()
const mongoose=require('mongoose')
const shortid = require('shortid')
const urls=require('./models/urls')
app.set('view engine','ejs');
app.use(express.urlencoded({extended:false}))

mongoose.connect("mongodb+srv://harsh:"+process.env['PASS']+"@urlcluster-gpyc1.mongodb.net/test?retryWrites=true&w=majority",{
	useNewUrlParser:true,useUnifiedTopology:true
});

app.get('/',async (req,res)=>{
	const shortUrls = await urls.find().sort({clicks:1,_id:-1})
	res.render('index',{shortUrls : shortUrls});
});

app.post('/posturl',async (req,res)=>{
	await urls.create({
		full: req.body.fullUrl
	})
	res.redirect('/')
})

app.post('/searchurl',async (req,res) => {
	const furls=await urls.find({full: {$regex: req.body.searchtext}})
	if(furls==null) res.redirect('/')
	res.render('filteredurls',{furls : furls})
})

app.get('/:shortUrl',async (req,res)=>{
	const foundUrl = await urls.findOne({short:req.params.shortUrl})
	if(foundUrl == null) return res.sendStatus(404)
	foundUrl.clicks++
	foundUrl.save()
	res.redirect(foundUrl.full)
})

app.listen(process.env.PORT || 8000);