const express = require('express')
const router = express.Router();
const { Client, LocalAuth } = require('whatsapp-web.js')
const qrcode = require('qrcode-terminal');
const send = require('send');

const client = new Client({
    authStrategy : new LocalAuth()
});

let readyState = false;

client.on('qr',(qr)=>{

    qrcode.generate(qr,{
        small:true
    })
})
// console.log(client.info)
router.get('/',(req,res)=>{
    res.send("Masuk");
})

client.on('ready',()=>{
    readyState = true;
    console.log('Client is ready!');

})


router.get('/login',(req,res)=>{
    if(client.info == undefined){
        client.on('qr',(qr)=>{
            res.send(qr);
        })
    }else{
        res.send("Client sudah login")
    }
})

router.get('/logout',(req,res)=>{
    if(client.info != undefined){
        client.logout()
        res.send("Client berhasil logout.")
    }else{
        res.send("Client belum login.")
    }
})

router.get('/status',(req,res)=>{
    if(client.info != undefined){
        res.send(client.info)
    }else if(readyState == false){
        res.send("Program masih belum siap.")
    }else{
        res.send("Client belum login.")
    }
})

router.post('/message', (req,res)=>{
    const number = req.body.number;
    const message = req.body.message;

    res.send("Pesan Berhasil Dikirim.")

})

client.initialize();

module.exports = router;