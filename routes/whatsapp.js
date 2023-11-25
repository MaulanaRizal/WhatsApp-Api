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
    const number = req.body.number+"@c.us";
    const message = req.body.message;

    try{
        client.sendMessage(number, message)
        res.send("Pesan Berhasil Dikirim.")
    }catch(error){
        console.log("gagal")
        console.log(error)
        res.send("Pesan Gagal Dikirim.")
    }
})

client.on('message_create',(message)=>{
    const msg = message.body.toUpperCase();

    if(msg == "BUTUH LOUNDRY"){
        client.sendMessage(message.from,`Haii Pelanggan Setia Cahaya Baru Laundry🥰👋

Pasti kalian mau kan dapetin diskon ini?
Yukk follow instagram @cahayabarulaundry_ & beri ulasan Cahaya Baru Laundry di Google Maps. Jangan lupa di screenshot ya jika sudah melakukan 2 hal tersebut🤗

Saat mau klaim diskon kalian harus menunjukkan hasil screenshot nya ke Customer Service Cahaya Baru Laundry😊

Klik link dibawah ini ya!👇️
https://linktr.ee/cahayabarulaundry7`);
    }

    if(msg == "BUTUH KUCING"){
        message.reply("Meooong 😺😺😺");
    }
    
    console.log(message)
    console.log(message.body)
    console.log(message.from)


})

client.initialize();

module.exports = router;