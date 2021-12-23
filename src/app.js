const express=require('express')
const path=require('path');
const app=express();
const hbs=require('hbs');
const geoCode=require('./utils/geoCode')
const forecast=require('./utils/forecast')

//Define paths for express config
const publicDIR = path.join(__dirname,'../public')
const viewsPath = path.join(__dirname,'../templates/views')
const partialsPath = path.join(__dirname,'../templates/partials')

//set up handle bars engine 
app.set('view engine','hbs')
app.set('views',viewsPath)
hbs.registerPartials(partialsPath)

//set static directory to serve
app.use(express.static(publicDIR))

app.get('',(req,res)=>{
    res.render('index',{
        title:'Weather',
        name:'Ryan'
    })
});
app.get('/about',(req,res)=>{
    res.render('about',{
        title:'About Me',
        name:'Ryan'
    })
});
app.get('/help',(req,res)=>{
    res.render('help',{
        title:'Help Page',
        helpText:'This is some  helpful texts',
        name:'Ryan'
    })
});
app.get('/weather',(req,res)=>{
    if(!req.query.address){
        return res.send({
            error:'Address must be provided!'
        })
    };
    console.log(req.query)
    geoCode(req.query.address,(error,{latitude,longitude,location}={})=>{ 
        if(error) return res.send({error}); 
    
        forecast(latitude,longitude,(error,forecastData)=>{
            if(error) return res.send({error});
            res.send(
                {
                    forecast:forecastData,
                    location:location,
                    address:req.query.address
                })
        });
    });
    
});
app.get('/products',(req,res)=>{
    if(!req.query.search){
        return res.send({
            error:'You must provide a search term'
        })
    }
    console.log(req.query)
    res.send({
        products:[]
    })
});
app.get('/help/*',(req,res)=>{
    res.render('404',{
        title:'404',
        error:'Help article not found'
    })
});

app.get('*',(req,res)=>{
    res.render('404',{title:'404',error:'Page not found!'})
});

app.listen(3000,()=>{
    console.log('Server is on port 3000')
});