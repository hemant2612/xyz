const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const obj = {
    heading: "Welcome to Okaydexter",
    text: `We are happy you to`,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    image:
      "https://images.unsplash.com/photo-1583552188819-4cab7da34a31?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80"
  };
const sendEmail = (email, name) => {
    
    sgMail.send({
        to: email,
        from: 'hemant.gaur_cs18@gla.ac.in',
        subject: 'Welcome to email',
        
        html: ` <!DOCTYPE html>
                <html>
                <body>
                <h1>Welcome, ${name}!</h1>

                <a href="default.asp">
                <img src=${obj.image} alt="HTML tutorial" style="width:200px;height:200px;border:0">
                </a>

                <p>${obj.text}</p>

                </body>
                </html>`
    }).then(response => console.log('res//////////', response))
        .catch(error => console.log('error/////////', error))
}
const sendCancelEmail = (email, name) => {

    sgMail.send({
        to: email,
        from: 'hemant.gaur_cs18@gla.ac.in',
        subject: 'Cancellation email',
        text: `Goodbye ${name} i hope to see you back sometime soon `
    })

}
module.exports = {
    sendEmail,
    sendCancelEmail
}
