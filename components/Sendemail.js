import RNSmtpMailer from "react-native-smtp-mailer";


export async function sendEmail(recipient,subject,body) {

    await RNSmtpMailer.sendMail({
        // mailhost: "smtp.gmail.com",
        // port: "465",
        // ssl: true, // optional. if false, then TLS is enabled. Its true by default in android. In iOS TLS/SSL is determined automatically, and this field doesn't affect anything
        // username: "kamwenja2021@gmail.com",
        // password: "kamwenja123456",
        // recipients: 'philosir@gmail.com',
        // subject: 'case happened',
        // htmlBody: 'sad news',
           
      })
        .then(success => console.log(success))
        .catch(err => console.log(err));
   
}
