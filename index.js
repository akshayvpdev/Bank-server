//importing express fw
const express=require("express")
const jwt=require("jsonwebtoken")
const dataservice =require("./services/data.service")
const cors=require("cors")


//creating server app
const app = express()

app.use(cors({
    origin:"http://localhost:4200"
}))

//to parse json to js
app.use(express.json())


const appMiddleware=(req,res,next)=>{
    try{
        token=req.headers["x-access-token"]
        result=jwt.verify(token,"secretsuperkey1234")
        req.currentAcno=result.currentAcno
        console.log(res)
        next()
    }
    catch{
        res.status(400).json({
            status:false,
            message:"Invalid User... please Login",
            statusCode:400
        })
    }
   

}


app.get('/',(req,res)=>{
    res.send("GET request hit")
})


// resolving requests
//register API
app.post('/register',(req,res)=>{
    const result = dataservice.register(req.body.acno,req.body.username,req.body.phone,req.body.password)
    result.then(resobj=>{
        res.status(resobj.statusCode).send(resobj)
    })
})




//login...............................................
app.post('/login',(req,res)=>{
    const result = dataservice.login(req.body.acno,req.body.password)
     result.then(resobj=>{
        res.status(resobj.statusCode).send(resobj)
    })
})




//deposite.............................................
app.post('/deposite',appMiddleware,(req,res)=>{
    const result = dataservice.deposit(req.body.acno,req.body.password,req.body.amount,req)
    result.then(resobj=>{
        res.status(resobj.statusCode).send(resobj)
    })
})



//withdraw......................................
app.post('/withdrawal',appMiddleware,(req,res)=>{
    const result = dataservice.withdrawal(req.body.acno,req.body.password,req.body.amount,req)
    result.then(resobj=>{
        res.status(resobj.statusCode).send(resobj)
    })
})


//--------transactions---------------
app.post('/transaction',appMiddleware, (req,res)=>{
    const result = dataservice.getTransactions(req.body.acno)
    result.then(resobj=>{
        res.status(resobj.statusCode).send(resobj)
    })
})

app.delete('/delete/:acc',appMiddleware, (req,res)=>{
    const result=dataservice.deleteAcc(req.params.acc)
    result.then(resObj=>{
        res.status(resObj.statusCode).send(resObj)
    })
})









app.put('/',(req,res)=>{
    res.send("PUT request hit")
})

app.patch('/',(req,res)=>{
    res.send("patch request hit")
})

app.delete('/',(req,res)=>{
    res.send("delete request hit")
})



//configuring port number
app.listen(3000,()=>{
    console.log("server running on port 3000")
})