const nodemailer = require('nodemailer');

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Store in .env file
    pass: process.env.EMAIL_PASS, // App password for Gmail
  },
  // Additional options for secure connection
  secure: true,
  tls: {
    rejectUnauthorized: false // In case of self-signed certificates
  },
  debug: true, // Show debug info
  logger: true // Log information to console
});

// Send OTP email
const sendOTPEmail = async (email, otp) => {
  try {
    console.log(`Attempting to send OTP email to: ${email}`);
    console.log(`Using sender: ${process.env.EMAIL_USER}`);

    const mailOptions = {
      from: `"LORAIN" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify Your Email | LORAIN',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email</title>
          <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&family=Montserrat:wght@300;400;500&family=Baskervville&display=swap" rel="stylesheet">
          <style>
            body { 
              margin: 0; 
              padding: 0; 
              font-family: 'Cormorant Garamond', 'Baskervville', serif;
              color: #1a1a1a;
              background-color: #ffffff;
              line-height: 1.6;
            }
            .container {
              max-width: 650px;
              margin: 0 auto;
              padding: 45px 30px;
              border: 1px solid #e0e0e0;
              background-color: #fcfcfc;
            }
            .logo {
              text-align: center;
              margin-bottom: 40px;
              padding-bottom: 30px;
              border-bottom: 1px solid #e0e0e0;
            }
            .logo h1 {
              font-family: 'Playfair Display', serif;
              font-size: 42px;
              font-weight: 600;
              margin: 0;
              letter-spacing: 8px;
              text-transform: uppercase;
              color: #000000;
            }
            .content {
              padding: 35px 30px;
              background-color: #ffffff;
              margin-bottom: 35px;
              border: 1px solid #f0f0f0;
              box-shadow: 0 4px 12px rgba(0,0,0,0.03);
            }
            h2 {
              font-family: 'Playfair Display', serif;
              font-size: 28px;
              font-weight: 500;
              margin-top: 0;
              margin-bottom: 25px;
              color: #000000;
              letter-spacing: 1px;
            }
            p {
              font-size: 17px;
              line-height: 1.7;
              margin-bottom: 25px;
              font-weight: 400;
              letter-spacing: 0.3px;
              color: #333333;
            }
            .otp-box {
              background-color: #f9f9f9;
              padding: 35px 30px;
              text-align: center;
              margin: 30px 0;
              border: 1px solid #e9e9e9;
            }
            .otp-code {
              font-family: 'Playfair Display', serif;
              font-size: 42px;
              font-weight: 600;
              letter-spacing: 10px;
              color: #000000;
              margin: 0;
              padding: 10px 0;
            }
            .note {
              font-family: 'Montserrat', sans-serif;
              font-size: 14px;
              color: #777777;
              font-style: italic;
              margin-top: 30px;
              line-height: 1.6;
            }
            .footer {
              text-align: center;
              margin-top: 40px;
              padding-top: 30px;
              border-top: 1px solid #e9e9e9;
              color: #888888;
              font-size: 14px;
              font-family: 'Montserrat', sans-serif;
            }
            .social-icons {
              text-align: center;
              margin: 25px 0;
            }
            .social-icons a {
              display: inline-block;
              margin: 0 12px;
              text-decoration: none;
              color: #333333;
              font-family: 'Montserrat', sans-serif;
              font-size: 13px;
              letter-spacing: 1px;
              font-weight: 500;
              text-transform: uppercase;
            }
            .address {
              margin-top: 20px;
              font-style: normal;
              font-size: 13px;
              line-height: 1.8;
              color: #999999;
            }
            .signature {
              font-family: 'Playfair Display', serif;
              font-size: 18px;
              font-style: italic;
              margin: 30px 0 20px;
              text-align: center;
              color: #555555;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">
              <h1>LORAIN</h1>
            </div>
            
            <div class="content">
              <h2>Email Verification</h2>
              <p>Thank you for choosing LORAIN. To complete your registration and join our exclusive community, please verify your email address with the code below:</p>
              
              <div class="otp-box">
                <h3 class="otp-code">${otp}</h3>
              </div>
              
              <p>This verification code will expire in 10 minutes. Please do not share this code with anyone.</p>
              
              <p class="note">If you did not request this verification, please disregard this email.</p>
            </div>
            
            <p>We look forward to providing you with an exceptional shopping experience at LORAIN, where timeless elegance meets contemporary style.</p>
            
            <div class="signature">Luxuriously yours,</div>
            
            <div class="social-icons">
              <a href="#" style="color: #333333;">Instagram</a>
              <a href="#" style="color: #333333;">Facebook</a>
              <a href="#" style="color: #333333;">Pinterest</a>
            </div>
            
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} LORAIN. All rights reserved.</p>
              <address class="address">
                LORAIN Boutique<br>
                Fashion Street, Adajan, Surat<br>
                Gujarat 395009, India
              </address>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Your LORAIN verification code is: ${otp}. It is valid for 10 minutes.`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully to:', email);
    console.log('Message ID:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    return false;
  }
};

// Send login success email
const sendLoginSuccessEmail = async (email, userName) => {
  try {
    console.log(`Attempting to send login success email to: ${email}`);

    const currentTime = new Date();
    const formattedDate = currentTime.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    const formattedTime = currentTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    const mailOptions = {
      from: `"LORAIN" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Welcome Back | LORAIN',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Login Confirmation</title>
          <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&family=Montserrat:wght@300;400;500&family=Baskervville&display=swap" rel="stylesheet">
          <style>
            body { 
              margin: 0; 
              padding: 0; 
              font-family: 'Cormorant Garamond', 'Baskervville', serif;
              color: #1a1a1a;
              background-color: #ffffff;
              line-height: 1.6;
            }
            .container {
              max-width: 650px;
              margin: 0 auto;
              padding: 45px 30px;
              border: 1px solid #e0e0e0;
              background-color: #fcfcfc;
            }
            .logo {
              text-align: center;
              margin-bottom: 40px;
              padding-bottom: 30px;
              border-bottom: 1px solid #e0e0e0;
            }
            .logo h1 {
              font-family: 'Playfair Display', serif;
              font-size: 42px;
              font-weight: 600;
              margin: 0;
              letter-spacing: 8px;
              text-transform: uppercase;
              color: #000000;
            }
            .content {
              padding: 35px 30px;
              background-color: #ffffff;
              margin-bottom: 35px;
              border: 1px solid #f0f0f0;
              box-shadow: 0 4px 12px rgba(0,0,0,0.03);
            }
            h2 {
              font-family: 'Playfair Display', serif;
              font-size: 28px;
              font-weight: 500;
              margin-top: 0;
              margin-bottom: 25px;
              color: #000000;
              letter-spacing: 1px;
            }
            p {
              font-size: 17px;
              line-height: 1.7;
              margin-bottom: 25px;
              font-weight: 400;
              letter-spacing: 0.3px;
              color: #333333;
            }
            .details-box {
              background-color: #f9f9f9;
              padding: 30px;
              margin: 30px 0;
              border: 1px solid #e9e9e9;
            }
            .details-title {
              font-family: 'Playfair Display', serif;
              font-size: 22px;
              font-weight: 500;
              margin-top: 0;
              margin-bottom: 18px;
              letter-spacing: 0.5px;
            }
            .detail-line {
              font-size: 16px;
              margin: 12px 0;
              display: flex;
              align-items: center;
            }
            .detail-line strong {
              min-width: 80px;
              display: inline-block;
              font-weight: 600;
            }
            .warning {
              color: #a02020;
              font-weight: 500;
              margin-top: 25px;
              font-size: 15px;
              font-family: 'Montserrat', sans-serif;
            }
            .button {
              display: inline-block;
              background-color: #000000;
              color: #ffffff;
              text-decoration: none;
              padding: 15px 40px;
              margin: 30px 0;
              font-family: 'Montserrat', sans-serif;
              font-size: 14px;
              letter-spacing: 2px;
              text-transform: uppercase;
              font-weight: 500;
              border: none;
              cursor: pointer;
            }
            .footer {
              text-align: center;
              margin-top: 40px;
              padding-top: 30px;
              border-top: 1px solid #e9e9e9;
              color: #888888;
              font-size: 14px;
              font-family: 'Montserrat', sans-serif;
            }
            .social-icons {
              text-align: center;
              margin: 25px 0;
            }
            .social-icons a {
              display: inline-block;
              margin: 0 12px;
              text-decoration: none;
              color: #333333;
              font-family: 'Montserrat', sans-serif;
              font-size: 13px;
              letter-spacing: 1px;
              font-weight: 500;
              text-transform: uppercase;
            }
            .address {
              margin-top: 20px;
              font-style: normal;
              font-size: 13px;
              line-height: 1.8;
              color: #999999;
            }
            .signature {
              font-family: 'Playfair Display', serif;
              font-size: 18px;
              font-style: italic;
              margin: 30px 0 20px;
              text-align: center;
              color: #555555;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">
              <h1>LORAIN</h1>
            </div>
            
            <div class="content">
              <h2>Welcome Back, ${userName || 'Valued Customer'}</h2>
              <p>We're pleased to inform you that your account was successfully accessed.</p>
              
              <div class="details-box">
                <h3 class="details-title">Login Details</h3>
                <p class="detail-line"><strong>Date:</strong> ${formattedDate}</p>
                <p class="detail-line"><strong>Time:</strong> ${formattedTime}</p>
                <p class="detail-line"><strong>Account:</strong> ${email}</p>
                
                <p class="warning">If you did not initiate this login, please secure your account immediately by changing your password and contact our customer service team.</p>
              </div>
              
              <p>Thank you for being a part of the LORAIN community. We've just received our exclusive new collection that we believe will perfectly complement your sophisticated style.</p>
            </div>
            
            <div style="text-align: center;">
              <a href="http://localhost:3000/shop" class="button">Explore New Arrivals</a>
            </div>
            
            <div class="signature">Luxuriously yours,</div>
            
            <div class="social-icons">
              <a href="#" style="color: #333333;">Instagram</a>
              <a href="#" style="color: #333333;">Facebook</a>
              <a href="#" style="color: #333333;">Pinterest</a>
            </div>
            
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} LORAIN. All rights reserved.</p>
              <address class="address">
                LORAIN Boutique<br>
                Fashion Street, Adajan, Surat<br>
                Gujarat 395009, India
              </address>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Hello ${userName || 'Valued Customer'}, You have successfully logged in to your LORAIN account on ${formattedDate} at ${formattedTime}. If this wasn't you, please secure your account immediately.`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Login success email sent to:', email);
    console.log('Message ID:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending login success email:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    return false;
  }
};

// Verify connection first
const verifyConnection = async () => {
  try {
    const verify = await transporter.verify();
    console.log('Nodemailer connection verified:', verify);
    return true;
  } catch (error) {
    console.error('Failed to verify nodemailer connection:', error);
    return false;
  }
};

// Verify connection on module load
verifyConnection();

module.exports = { sendOTPEmail, sendLoginSuccessEmail }; 