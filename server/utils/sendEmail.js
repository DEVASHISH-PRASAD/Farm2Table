import nodemailer from 'nodemailer'
const sendEmail = async (recepientEmail,subject,message)=>{
    try{
        let transporter = nodemailer.createTransport({
            host:process.env.SMTP_HOST,
            port:Number(process.env.SMTP_PORT),
            secure:false,
            auth:{
                user:process.env.SMTP_USERNAME,
                pass:process.env.SMTP_PASSWORD
            }
        });

        let info = await transporter.sendMail({
            from:`"FARM-2-MARKET".<${process.env.SMTP_USERNAME}>`,
            to:recepientEmail,
            subject:subject,
            html:message
        })
    }catch(err){
        throw new Error('Failed to send email')
    }
}

export default sendEmail;