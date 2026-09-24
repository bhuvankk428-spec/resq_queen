import 'dotenv/config'; import express from 'express'; import cors from 'cors'; import generate from './routes/generate.js';
const app=express(); app.use(cors()); app.use(express.json({limit:'20kb'})); app.use('/api/generate',generate); app.use((err,req,res,next)=>res.status(400).json({error:'Invalid JSON request.'})); app.listen(process.env.PORT||3001,()=>console.log('Quest server ready'));
