const nodemailer = require("nodemailer");
const sendMail = async (user_email,subject,body,text) => {
            let testAccount = await nodemailer.createTestAccount();
            let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            auth: {
                user: "temp.patel4762@gmail.com", // generated ethereal user
                pass:"rrotbikwywojqyqc", // generated ethereal password
            },
        });
    
        // send mail with defined transport object
        let info = await transporter.sendMail({
        from: '"National Bank" <nationalbank@gmail.com>', // sender address
        to: user_email, // list of receivers
        subject: subject, // Subject line
        text: text, // plain text body
        html: body, // html body
        });
    
        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    
        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    }

module.exports = sendMail;
