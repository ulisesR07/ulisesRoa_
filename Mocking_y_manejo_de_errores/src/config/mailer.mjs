import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: 'ulises.roa07@gmail.com',
    pass: 'cmkcdosml1'
  }
})

transporter.sendMail({
  from: "'Proyecto' <proyectoUlises@gmail.com>",
  to: 'ulises.roa07@gmail.com',
  subject: 'Test nodemailer',
  //   text: '',
  html: '<h1>Test nodemailer</h1>',
  attachments: [
    {
      filename: 'logo.png',
      path: './src/public/images/logo.png',
      cid: 'logo'
    }
  ]
})
  .then(info => console.log(info))
  .catch(error => console.log(error))
