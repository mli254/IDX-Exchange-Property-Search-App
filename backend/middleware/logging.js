import express from 'express';

const logger = (req, res, next) => {
    const start = process.hrtime();

    res.once("finish", () =>{
        const [seconds, nanoseconds] = process.hrtime(start)
        const milliseconds = (seconds * 1e3) + (nanoseconds * 1e-6);
        const log = {
            method: req.method,
            url: req.originalUrl, 
            status: res.statusCode,
            timestamp: new Date().toISOString(),
            duration: milliseconds + " ms"
        }

        console.log(log);
    });
    next();

};

export default logger;