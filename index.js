const fs = require('node:fs');
const express = require('express');
const { time, log, trace } = require('node:console');
const { type } = require('node:os');


const app = express();

let count = 1;


const logInMiddleware = (req, res, next) => {
    
    // fs.appendFileSync('logInTime.log', `\n${count}) Received request at Url = ${req.url} \nDate and Time of Login = ${Date.now()}\n`);
    // next();

    const startTime = Date.now();
    // console.log(startTime);

    const { method, url} = req;
    const statusCode = res.statusCode;
    
    // Log the incoming request details
    const lineOne = `\nDATE_AND_TIME = [${new Date()}] \nREQUESTED_URL = ${url} \nMETHOD = ${method} \nSTATUS_CODE = ${statusCode}`;
    
    // Continue to the next middleware or route handler
    next();
    
    const duration = Date.now() - startTime;
    // Calculate the time taken for processing the request
    // console.log(startTime);
    // console.log(duration);

    const lineTwo = `Request processed in ${duration}ms`;

    const result = '\n' + lineOne + '\n' + lineTwo;

    console.log(result);
    fs.appendFileSync('error.log', result)
}

const apiKeyMiddleware = (req, res, next) => {
    // console.log();
    count++;
    
    if(req.query.apiKey === '123-123-123')
        next();
        
        else {
            res.status(404).json({
                status: 'Fail',
                msg:'Wrong API Key'
            })
        }
    }
    
    app.use(logInMiddleware);
    app.use(apiKeyMiddleware);   
    app.use(express.json())

app.get('/authenticator', (req, res, next)=> {

    // console.log(req.params);    
    
    try {
      
        res.json({
            status:'success',
            // data: trial
        })
        
    } catch (err) {
        // console.log('Error_Caught = ', err);
        next(err);
    }

    })


    app.post('/authenticator/registration', (req, res) => {
        console.log(req.body);
        res.json({
            success:'true', 
            msg:'Registration API'
        })
    })


const errorMiddleware = (err, req, res, next) => {
    fs.appendFileSync('Errors.log', '\n' + err.message)
    console.log('ErrorHandlingMiddleware Error = ', err);
    
    res.status(500).json({
        status: 'FAIL',
        msg: 'Middleware Error'
    })  
}

app.use(errorMiddleware)    

app.listen(8008, () => {
    console.log('Server is running at port 8008');
    
})
