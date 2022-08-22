var nodemailer = require('nodemailer');
// require('dotenv').config({
//   path: 'NODE_ENV' in process.env ? (process.env.NODE_ENV === 'development' ? './config/.env.dev' : './config/.env') : './config/.env.dev'
// })


function sendEmail(toEmail, subject, text, addFooter, cc) {
    return new Promise((resolve) => {
      const url=process.env.URL
      const logo=process.env.LOGO
        const myEmail = 'ferreira.flavio.luiz@gmail.com';
        const pass = 'rzivaspcolynvfyx';
        
        if (toEmail === 'myidol') toEmail = myEmail;

        var transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: myEmail,
                pass: pass
            },
            tls: {
                rejectUnauthorized: false
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