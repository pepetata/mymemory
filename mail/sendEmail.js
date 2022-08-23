import nodemailer from "nodemailer"
import { promises as fs } from 'fs';
import path from "path";
// require('dotenv').config({
//   path: 'NODE_ENV' in process.env ? (process.env.NODE_ENV === 'development' ? './config/.env.dev' : './config/.env') : './config/.env.dev'
// })


function sendEmail(toEmail, subject, text, addFooter, cc) {
    return new Promise(async (resolve) => {
      const url=process.env.URL
      const logo=process.env.LOGO
        const myEmail = 'contato@memoriatest.online';
        const pass = 'MTZoho123.';
        
        const pemFile = path.join(process.cwd(), 'certificates');
        console.log('======================= pemFile',pemFile, pemFile + path.sep+'privateKeyDKIM.pem')
        const pemData= await fs.readFile(pemFile + path.sep+'privateKeyDKIM.pem', "utf8")

        var transporter = nodemailer.createTransport({
            host: 'smtp.zoho.com',
            port: 587,
            secure: false,
            auth: {
                user: myEmail,
                pass: pass
            },
            tls: {
                rejectUnauthorized: false
            },
            dkim: {
                domainName: "memoriatest.online",
                keySelector: "zmail",
                privateKey: pemData
              }            
        });


        var msg = '<!DOCTYPE html><html><body style="background-color: #fff4e5;">'+ text;
        if (addFooter) {
            msg+= '<br>Atenciosamente,<br>';
            msg+= '<p>Equipe Memoria Test</p>';
            msg+= '<a href="'+url+'"><img alt="Memoria Test" src="'+logo+'" width="200" style="display:block;"></a>';
        }
        msg += '</body></html>';
        console.log(msg)
        
        
        var mailOptions = {
            from: myEmail,
            to: toEmail,
            cc: cc,
            subject: subject,
            text: 'Este email deve ser visto em formato HTML.',
            html: msg,
            replyTo: myEmail,
            headers : {
                'List-Unsubscribe': '<mailto:unsubscribe@memoriatest.online?subject=Cancelar subscrição>, <https://memoriatest.online>' }
            //TODO DKIM
        };

//        transporter.verify().then(console.log).catch(console.error);

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log("deu erro", error);
                resolve(false);
            } else {
                console.log('Email sent: ' + info.response);
                resolve(true);
            }
        });
    });
}


module.exports = {sendEmail};