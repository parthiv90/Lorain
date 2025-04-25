const nodemailer = require('nodemailer');

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // use SSL
  auth: {
    user: process.env.EMAIL_USER, // Store in .env file
    pass: process.env.EMAIL_PASS, // App password for Gmail
  },
  tls: {
    rejectUnauthorized: false // In case of self-signed certificates
  },
  debug: true, // Show debug info
  logger: true // Log information to console
});

// Send OTP email for registration or password reset
const sendOTPEmail = async (email, otp, purpose = 'registration') => {
  try {
    console.log(`Attempting to send OTP email to: ${email} for purpose: ${purpose}`);
    console.log(`Using sender: ${process.env.EMAIL_USER}`);

    // Set subject and other variables based on purpose
    const isPasswordReset = purpose === 'password_reset';
    const subject = isPasswordReset ? 'Reset Your Password | LORAIN' : 'Verify Your Email | LORAIN';
    const heading = isPasswordReset ? 'Password Reset Verification' : 'Email Verification';
    const mainText = isPasswordReset 
      ? 'To reset your password and secure your LORAIN account, please use the verification code below:'
      : 'To complete your registration and join our exclusive community, please verify your email address with the code below:';
    const noteText = isPasswordReset
      ? 'If you did not request this password reset, please disregard this email.'
      : 'If you did not request this verification, please disregard this email.';

    const mailOptions = {
      from: `"LORAIN" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: subject,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  @media only screen and (max-width: 600px) {
    body, .container, .content, .footer, .logo, .otp-box, .order-info, .reset-token {
      width: 100% !important;
      max-width: 100% !important;
      padding: 10px !important;
      box-sizing: border-box !important;
    }
    .container {
      padding: 10px !important;
    }
    .content, .order-info, .otp-box, .reset-token {
      padding: 12px !important;
      margin: 10px 0 !important;
    }
    h1, h2, h3 {
      font-size: 22px !important;
      line-height: 1.2 !important;
    }
    p, .footer, .address {
      font-size: 15px !important;
      line-height: 1.5 !important;
    }
    .reset-link, .otp-code, .order-btn {
      font-size: 16px !important;
      padding: 12px 10px !important;
      width: 100% !important;
      box-sizing: border-box !important;
      display: block !important;
    }
    .logo h1 {
      font-size: 24px !important;
      letter-spacing: 2px !important;
    }
    .order-table, .order-table th, .order-table td {
      font-size: 13px !important;
    }
  }
</style>
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
          <div class="container" style="max-width:600px;margin:0 auto;padding:16px 8px;background:#fcfcfc;border-radius:8px;box-sizing:border-box;">

            <div class="logo" style="text-align:center;margin-bottom:24px;padding-bottom:12px;border-bottom:1px solid #e0e0e0;">

              <h1 style="font-family:'Playfair Display',serif;font-size:28px;font-weight:700;margin:0;letter-spacing:4px;text-transform:uppercase;color:#000;">LORAIN</h1>
            </div>
            
            <div class="content" style="background:#fff;padding:18px 12px 22px 12px;margin-bottom:20px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.04);border:1px solid #f0f0f0;">

              <h2 style="font-family:'Playfair Display',serif;font-size:20px;font-weight:600;margin:0 0 14px 0;color:#000;letter-spacing:1px;text-align:left;">${heading}</h2>
              <p style="font-size:16px;line-height:1.6;margin:0 0 14px 0;font-weight:400;letter-spacing:0.2px;color:#333;text-align:left;">${mainText}</p>
              
              <div class="otp-box" style="background:#f6f6f6;padding:18px 8px;text-align:center;margin:18px 0 18px 0;border-radius:7px;border:1px solid #e9e9e9;">

                <h3 class="otp-code" style="font-size:28px;font-weight:700;letter-spacing:8px;margin:0 0 12px 0;text-align:center;background:#fff;padding:10px 0;border-radius:6px;">${otp}</h3>
              </div>
              
              <p style="font-size:16px;line-height:1.6;margin:0 0 14px 0;font-weight:400;letter-spacing:0.2px;color:#333;text-align:left;">This verification code will expire in 10 minutes. Please do not share this code with anyone.</p>
              
              <p class="note">${noteText}</p>
            </div>
            
            <p style="font-size:16px;line-height:1.6;margin:0 0 14px 0;font-weight:400;letter-spacing:0.2px;color:#333;text-align:left;">We look forward to providing you with an exceptional shopping experience at LORAIN, where timeless elegance meets contemporary style.</p>
            
            <div class="signature">Luxuriously yours,</div>
            
            <div class="social-icons">
              <a href="#" style="color: #333333;">Instagram</a>
              <a href="#" style="color: #333333;">Facebook</a>
              <a href="#" style="color: #333333;">Pinterest</a>
            </div>
            
            <div class="footer" style="text-align:center;margin-top:18px;padding-top:10px;border-top:1px solid #e9e9e9;color:#888;font-size:13px;">
              <p style="font-size:16px;line-height:1.6;margin:0 0 14px 0;font-weight:400;letter-spacing:0.2px;color:#333;text-align:left;">&copy; ${new Date().getFullYear()} LORAIN. All rights reserved.</p>
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
<style>
  @media only screen and (max-width: 600px) {
    body, .container, .content, .footer, .logo, .otp-box, .order-info, .reset-token {
      width: 100% !important;
      max-width: 100% !important;
      padding: 10px !important;
      box-sizing: border-box !important;
    }
    .container {
      padding: 10px !important;
    }
    .content, .order-info, .otp-box, .reset-token {
      padding: 12px !important;
      margin: 10px 0 !important;
    }
    h1, h2, h3 {
      font-size: 22px !important;
      line-height: 1.2 !important;
    }
    p, .footer, .address {
      font-size: 15px !important;
      line-height: 1.5 !important;
    }
    .reset-link, .otp-code, .order-btn {
      font-size: 16px !important;
      padding: 12px 10px !important;
      width: 100% !important;
      box-sizing: border-box !important;
      display: block !important;
    }
    .logo h1 {
      font-size: 24px !important;
      letter-spacing: 2px !important;
    }
    .order-table, .order-table th, .order-table td {
      font-size: 13px !important;
    }
  }
</style>
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
          <div class="container" style="max-width:600px;margin:0 auto;padding:16px 8px;background:#fcfcfc;border-radius:8px;box-sizing:border-box;">

            <div class="logo" style="text-align:center;margin-bottom:24px;padding-bottom:12px;border-bottom:1px solid #e0e0e0;">

              <h1 style="font-family:'Playfair Display',serif;font-size:28px;font-weight:700;margin:0;letter-spacing:4px;text-transform:uppercase;color:#000;">LORAIN</h1>
            </div>
            
            <div class="content" style="background:#fff;padding:18px 12px 22px 12px;margin-bottom:20px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.04);border:1px solid #f0f0f0;">

              <h2 style="font-family:'Playfair Display',serif;font-size:20px;font-weight:600;margin:0 0 14px 0;color:#000;letter-spacing:1px;text-align:left;">Welcome Back, ${userName || 'Valued Customer'}</h2>
              <p style="font-size:16px;line-height:1.6;margin:0 0 14px 0;font-weight:400;letter-spacing:0.2px;color:#333;text-align:left;">We're pleased to inform you that your account was successfully accessed.</p>
              
              <div class="details-box">
                <h3 class="details-title">Login Details</h3>
                <p class="detail-line"><strong>Date:</strong> ${formattedDate}</p>
                <p class="detail-line"><strong>Time:</strong> ${formattedTime}</p>
                <p class="detail-line"><strong>Account:</strong> ${email}</p>
                
                <p class="warning">If you did not initiate this login, please secure your account immediately by changing your password and contact our customer service team.</p>
              </div>
              
              <p style="font-size:16px;line-height:1.6;margin:0 0 14px 0;font-weight:400;letter-spacing:0.2px;color:#333;text-align:left;">Thank you for being a part of the LORAIN community. We've just received our exclusive new collection that we believe will perfectly complement your sophisticated style.</p>
            </div>
            
            <div style="text-align: center;">
              <a href="http://localhost:3000/Fashion-web" class="button">Explore New Arrivals</a>
            </div>
            
            <div class="signature">Luxuriously yours,</div>
            
            <div class="social-icons">
              <a href="#" style="color: #333333;">Instagram</a>
              <a href="#" style="color: #333333;">Facebook</a>
              <a href="#" style="color: #333333;">Pinterest</a>
            </div>
            
            <div class="footer" style="text-align:center;margin-top:18px;padding-top:10px;border-top:1px solid #e9e9e9;color:#888;font-size:13px;">
              <p style="font-size:16px;line-height:1.6;margin:0 0 14px 0;font-weight:400;letter-spacing:0.2px;color:#333;text-align:left;">&copy; ${new Date().getFullYear()} LORAIN. All rights reserved.</p>
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

// Send order confirmation email with product details and Cash on Delivery information
const sendOrderConfirmationEmail = async (email, userName, orderDetails) => {
  try {
    console.log(`Attempting to send order confirmation email to: ${email}`);

    const { orderId, products, totalAmount, shippingAddress, orderDate } = orderDetails;
    
    // Format currency - Converting to USD
    const formatPrice = (price) => {
      // Convert from INR to USD using approximate exchange rate
      const exchangeRate = 75;
      const priceInUSD = price / exchangeRate;
      
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(priceInUSD);
    };

    // Format date
    const formattedDate = new Date(orderDate).toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    // Generate product rows for the email
    const productRows = products.map(product => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;">
          <div style="display: flex; align-items: center;">
            <img src="${product.image}" alt="${product.name}" style="width: 60px; height: 60px; object-fit: cover; margin-right: 15px;">
            <div>
              <div style="font-family: 'Playfair Display', serif; font-size: 16px; font-weight: 500; margin-bottom: 4px;">${product.name}</div>
              <div style="font-size: 14px; color: #666;">
                ${product.selectedSize ? `Size: ${product.selectedSize}` : ''}
                ${product.selectedColor ? `Color: ${product.selectedColor}` : ''}
              </div>
            </div>
          </div>
        </td>
        <td style="padding: 12px; text-align: center; border-bottom: 1px solid #e0e0e0;">${product.quantity}</td>
        <td style="padding: 12px; text-align: right; border-bottom: 1px solid #e0e0e0; font-family: 'Montserrat', sans-serif;">${formatPrice(product.price)}</td>
        <td style="padding: 12px; text-align: right; border-bottom: 1px solid #e0e0e0; font-family: 'Montserrat', sans-serif;">${formatPrice(product.price * product.quantity)}</td>
      </tr>
    `).join('');

    const mailOptions = {
      from: `"LORAIN" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Your LORAIN Order Confirmation #${orderId}`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  @media only screen and (max-width: 600px) {
    body, .container, .content, .footer, .logo, .otp-box, .order-info, .reset-token {
      width: 100% !important;
      max-width: 100% !important;
      padding: 10px !important;
      box-sizing: border-box !important;
    }
    .container {
      padding: 10px !important;
    }
    .content, .order-info, .otp-box, .reset-token {
      padding: 12px !important;
      margin: 10px 0 !important;
    }
    h1, h2, h3 {
      font-size: 22px !important;
      line-height: 1.2 !important;
    }
    p, .footer, .address {
      font-size: 15px !important;
      line-height: 1.5 !important;
    }
    .reset-link, .otp-code, .order-btn {
      font-size: 16px !important;
      padding: 12px 10px !important;
      width: 100% !important;
      box-sizing: border-box !important;
      display: block !important;
    }
    .logo h1 {
      font-size: 24px !important;
      letter-spacing: 2px !important;
    }
    .order-table, .order-table th, .order-table td {
      font-size: 13px !important;
    }
  }
</style>
          <title>Order Confirmation</title>
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
              max-width: 750px;
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
            h3 {
              font-family: 'Playfair Display', serif;
              font-size: 22px;
              font-weight: 500;
              margin-top: 30px;
              margin-bottom: 15px;
              color: #000000;
            }
            p {
              font-size: 17px;
              line-height: 1.7;
              margin-bottom: 25px;
              font-weight: 400;
              letter-spacing: 0.3px;
              color: #333333;
            }
            .order-info {
              background-color: #f9f9f9;
              padding: 25px;
              margin: 30px 0;
              border: 1px solid #e9e9e9;
            }
            .order-number {
              font-family: 'Playfair Display', serif;
              font-size: 20px;
              font-weight: 600;
              letter-spacing: 1px;
              color: #000000;
              margin-bottom: 15px;
            }
            .detail-line {
              font-size: 16px;
              margin: 12px 0;
              display: flex;
              align-items: center;
            }
            .detail-line strong {
              min-width: 100px;
              display: inline-block;
              font-weight: 600;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 30px 0;
            }
            th {
              text-align: left;
              padding: 15px 12px;
              background-color: #f0f0f0;
              border-bottom: 2px solid #e0e0e0;
              font-family: 'Montserrat', sans-serif;
              font-size: 14px;
              font-weight: 500;
              text-transform: uppercase;
              letter-spacing: 1px;
              color: #333;
            }
            th:nth-child(2), td:nth-child(2) {
              text-align: center;
            }
            th:nth-child(3), th:nth-child(4), td:nth-child(3), td:nth-child(4) {
              text-align: right;
            }
            .summary {
              background-color: #f9f9f9;
              padding: 25px;
              margin: 30px 0;
              border: 1px solid #e9e9e9;
            }
            .summary-row {
              display: flex;
              justify-content: space-between;
              margin: 15px 0;
              font-size: 16px;
            }
            .summary-row.total {
              font-size: 20px;
              font-weight: 600;
              margin-top: 20px;
              padding-top: 20px;
              border-top: 1px solid #e0e0e0;
              font-family: 'Playfair Display', serif;
            }
            .payment-badge {
              display: inline-block;
              background-color: #000000;
              color: #ffffff;
              padding: 8px 15px;
              font-family: 'Montserrat', sans-serif;
              font-size: 12px;
              font-weight: 500;
              letter-spacing: 1px;
              text-transform: uppercase;
              margin-top: 10px;
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
            .note {
              font-family: 'Montserrat', sans-serif;
              font-size: 14px;
              color: #777777;
              font-style: italic;
              margin-top: 25px;
              line-height: 1.6;
            }
            .shipping-box {
              background-color: #f9f9f9;
              padding: 25px;
              margin: 30px 0;
              border: 1px solid #e9e9e9;
            }
            .address-box {
              font-family: 'Montserrat', sans-serif;
              font-size: 15px;
              line-height: 1.8;
              margin-top: 10px;
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
            .store-address {
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
          <div class="container" style="max-width:600px;margin:0 auto;padding:16px 8px;background:#fcfcfc;border-radius:8px;box-sizing:border-box;">

            <div class="logo" style="text-align:center;margin-bottom:24px;padding-bottom:12px;border-bottom:1px solid #e0e0e0;">

              <h1 style="font-family:'Playfair Display',serif;font-size:28px;font-weight:700;margin:0;letter-spacing:4px;text-transform:uppercase;color:#000;">LORAIN</h1>
            </div>
            
            <div class="content" style="background:#fff;padding:18px 12px 22px 12px;margin-bottom:20px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.04);border:1px solid #f0f0f0;">

              <p style="font-size: 15px; color: #555; margin-bottom: 5px;">Dear ${userName},</p>
              <p style="font-size: 16px;">Thank you for your order with LORAIN! We're delighted to confirm that we've received your order and it's being processed with care.</p>
              
              <div class="order-info" style="background:#f6f6f6;padding:16px 10px;margin:18px 0 18px 0;border-radius:7px;border:1px solid #e9e9e9;">

                <div class="order-number">Order #${orderId}</div>
                <div class="detail-line"><strong>Order Date:</strong> ${formattedDate}</div>
                <div class="detail-line"><strong>Payment:</strong> Cash on Delivery</div>
                <div class="detail-line"><strong>Estimated Delivery:</strong> ${new Date(Date.now() + 7*24*60*60*1000).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
              </div>
              <div class="payment-badge">CASH ON DELIVERY</div>
              </div>
              
              <h3>Order Summary</h3>
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${productRows}
                </tbody>
              </table>
              
              <div class="summary">
                <div class="summary-row">
                  <span>Subtotal:</span>
                  <span>${formatPrice(totalAmount)}</span>
                </div>
                <div class="summary-row">
                  <span>Shipping:</span>
                  <span>Free</span>
                </div>
                <div class="summary-row total">
                  <span>Total:</span>
                  <span>${formatPrice(totalAmount)}</span>
                </div>
              </div>
              
              <div style="margin-top: 25px; border: 1px solid #e9e9e9; padding: 20px; background-color: #f9f9f9;">
                <h3 style="font-family: 'Playfair Display', serif; font-size: 18px; margin-top: 0; margin-bottom: 15px;">Shipping Address</h3>
                <div style="font-family: 'Montserrat', sans-serif; font-size: 14px; line-height: 1.6;">
                  <strong>${shippingAddress.fullName}</strong><br>
                  ${shippingAddress.addressLine1}${shippingAddress.addressLine2 ? `, ${shippingAddress.addressLine2}` : ''}<br>
                  ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.postalCode}<br>
                  ${shippingAddress.country}<br>
                  <strong>Phone:</strong> ${shippingAddress.phone}
                </div>
              </div>
              
              <div style="margin-top: 25px; border: 1px solid #e9e9e9; padding: 20px; background-color: #f9f9f9;">
                <h3 style="font-family: 'Playfair Display', serif; font-size: 18px; margin-top: 0; margin-bottom: 15px;">Payment Information</h3>
                <div style="font-family: 'Montserrat', sans-serif; font-size: 14px; line-height: 1.6;">
                  <strong>Payment Method:</strong> Cash on Delivery<br>
                  <strong>Order Total:</strong> ${formatPrice(totalAmount)}<br>
                  <p style="margin-top: 10px; font-size: 13px; color: #666;">Please have the exact amount ready at the time of delivery.</p>
                </div>
              </div>
              
              <p class="note">Your order will be delivered within 5-7 business days. We'll send you another email with tracking information once your package is on its way.</p>
            </div>
            
            <div style="text-align: center;">
              <a href="http://localhost:3000/profile" class="button">Track Your Order</a>
            </div>
            
            <p style="font-size:16px;line-height:1.6;margin:0 0 14px 0;font-weight:400;letter-spacing:0.2px;color:#333;text-align:left;">If you have any questions about your order, please don't hesitate to contact our customer service team at <a href="mailto:support@lorain.com" style="color: #000000; text-decoration: underline;">support@lorain.com</a> or call us at +91 1234567890.</p>
            
            <div class="signature">Luxuriously yours,</div>
            
            <div class="social-icons">
              <a href="#" style="color: #333333;">Instagram</a>
              <a href="#" style="color: #333333;">Facebook</a>
              <a href="#" style="color: #333333;">Pinterest</a>
            </div>
            
            <div class="footer" style="text-align:center;margin-top:18px;padding-top:10px;border-top:1px solid #e9e9e9;color:#888;font-size:13px;">
              <p style="font-size:16px;line-height:1.6;margin:0 0 14px 0;font-weight:400;letter-spacing:0.2px;color:#333;text-align:left;">&copy; ${new Date().getFullYear()} LORAIN. All rights reserved.</p>
              <address class="store-address">
                LORAIN Boutique<br>
                Fashion Street, Adajan, Surat<br>
                Gujarat 395009, India
              </address>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Thank you for your order #${orderId} from LORAIN. Your total is ${formatPrice(totalAmount)} with payment method: Cash on Delivery. Your order will be delivered to ${shippingAddress.fullName}, ${shippingAddress.addressLine1}, ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.postalCode} within 5-7 business days.`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent to:', email);
    console.log('Message ID:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    return false;
  }
};

// Send password reset email
const sendPasswordResetEmail = async (email, userName, resetToken) => {
  try {
    // Log that we're starting the email sending process
    console.log(`Attempting to send password reset email to: ${email}`);

    // Validate inputs to prevent potential errors
    if (!email) {
      console.error('Missing email address for password reset email');
      return false;
    }

    if (!resetToken) {
      console.error('Missing reset token for password reset email');
      return false;
    }

    // Create email options with proper error handling
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const resetLink = `${frontendUrl}/reset-password?token=${encodeURIComponent(resetToken)}&email=${encodeURIComponent(email)}`;
    const currentYear = new Date().getFullYear();
    const formattedUsername = userName || 'Valued Customer';
    
    // Create email content with simplified HTML to reduce potential errors
    const mailOptions = {
      from: `"LORAIN" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Reset Your Password | LORAIN',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  @media only screen and (max-width: 600px) {
    body, .container, .content, .footer, .logo, .otp-box, .order-info, .reset-token {
      width: 100% !important;
      max-width: 100% !important;
      padding: 10px !important;
      box-sizing: border-box !important;
    }
    .container {
      padding: 10px !important;
    }
    .content, .order-info, .otp-box, .reset-token {
      padding: 12px !important;
      margin: 10px 0 !important;
    }
    h1, h2, h3 {
      font-size: 22px !important;
      line-height: 1.2 !important;
    }
    p, .footer, .address {
      font-size: 15px !important;
      line-height: 1.5 !important;
    }
    .reset-link, .otp-code, .order-btn {
      font-size: 16px !important;
      padding: 12px 10px !important;
      width: 100% !important;
      box-sizing: border-box !important;
      display: block !important;
    }
    .logo h1 {
      font-size: 24px !important;
      letter-spacing: 2px !important;
    }
    .order-table, .order-table th, .order-table td {
      font-size: 13px !important;
    }
  }
</style>
          <title>Password Reset</title>
          <style>
            body { 
              margin: 0; 
              padding: 0; 
              font-family: Georgia, serif;
              color: #1a1a1a;
              background-color: #ffffff;
              line-height: 1.6;
            }
            .container {
              max-width: 650px;
              margin: 0 auto;
              padding: 30px;
              border: 1px solid #e0e0e0;
              background-color: #fcfcfc;
            }
            .logo {
              text-align: center;
              margin-bottom: 30px;
              padding-bottom: 20px;
              border-bottom: 1px solid #e0e0e0;
            }
            .logo h1 {
              font-size: 36px;
              font-weight: 600;
              margin: 0;
              letter-spacing: 5px;
              text-transform: uppercase;
              color: #000000;
            }
            .content {
              padding: 30px;
              background-color: #ffffff;
              margin-bottom: 30px;
              border: 1px solid #f0f0f0;
            }
            h2 {
              font-size: 24px;
              font-weight: 500;
              margin-top: 0;
              margin-bottom: 20px;
              color: #000000;
            }
            p {
              font-size: 16px;
              line-height: 1.7;
              margin-bottom: 20px;
              color: #333333;
            }
            .reset-token {
              background-color: #f9f9f9;
              padding: 30px;
              text-align: center;
              margin: 20px 0;
              border: 1px solid #e9e9e9;
            }
            .reset-link {
              display: inline-block;
              background-color: #000000;
              color: #ffffff;
              text-decoration: none;
              padding: 12px 30px;
              margin: 15px 0;
              font-size: 14px;
              font-weight: 500;
              border: none;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e9e9e9;
              color: #888888;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container" style="max-width:600px;margin:0 auto;padding:16px 8px;background:#fcfcfc;border-radius:8px;box-sizing:border-box;">

            <div class="logo" style="text-align:center;margin-bottom:24px;padding-bottom:12px;border-bottom:1px solid #e0e0e0;">

              <h1 style="font-family:'Playfair Display',serif;font-size:28px;font-weight:700;margin:0;letter-spacing:4px;text-transform:uppercase;color:#000;">LORAIN</h1>
            </div>
            
            <div class="content" style="background:#fff;padding:18px 12px 22px 12px;margin-bottom:20px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.04);border:1px solid #f0f0f0;">

              <h2 style="font-family:'Playfair Display',serif;font-size:20px;font-weight:600;margin:0 0 14px 0;color:#000;letter-spacing:1px;text-align:left;">Password Reset Request</h2>
              <p style="font-size:16px;line-height:1.6;margin:0 0 14px 0;font-weight:400;letter-spacing:0.2px;color:#333;text-align:left;">Dear ${formattedUsername},</p>
              <p style="font-size:16px;line-height:1.6;margin:0 0 14px 0;font-weight:400;letter-spacing:0.2px;color:#333;text-align:left;">We received a request to reset your password for your LORAIN account. Please use the link below to reset your password:</p>
              
              <div class="reset-token" style="background:#f6f6f6;padding:18px 8px;text-align:center;margin:18px 0 18px 0;border-radius:7px;border:1px solid #e9e9e9;">

                <a href="${resetLink}" style="display:block;background:#000;color:#fff;text-decoration:none;padding:14px 0;margin:10px 0 0 0;font-size:18px;font-weight:600;border-radius:5px;text-align:center;">Reset Password</a>
                <p style="font-size: 14px; color: #777777; font-style: italic; margin-top: 20px;">This link will expire in 10 minutes.</p>
              </div>
              
              <p style="font-size:16px;line-height:1.6;margin:0 0 14px 0;font-weight:400;letter-spacing:0.2px;color:#333;text-align:left;">If you did not request this password reset, please ignore this email and your password will remain unchanged.</p>
            </div>
            
            <p style="font-size:16px;line-height:1.6;margin:0 0 14px 0;font-weight:400;letter-spacing:0.2px;color:#333;text-align:left;">Thank you for choosing LORAIN, where elegance meets quality.</p>
            
            <div class="footer" style="text-align:center;margin-top:18px;padding-top:10px;border-top:1px solid #e9e9e9;color:#888;font-size:13px;">
              <p style="font-size:16px;line-height:1.6;margin:0 0 14px 0;font-weight:400;letter-spacing:0.2px;color:#333;text-align:left;">&copy; ${currentYear} LORAIN. All rights reserved.</p>
              <address style="font-style:normal;margin-top:10px;line-height:1.5;color:#999;">
                LORAIN Boutique<br>
                Fashion Street, Adajan, Surat<br>
                Gujarat 395009, India
              </address>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Reset your LORAIN password with this link: ${resetLink}. It is valid for 10 minutes.`
    };

    // Attempt to send the email
    console.log('Prepared password reset email, attempting to send...');
    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully to:', email);
    console.log('Message ID:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    // Log the error in a safe way that won't cause additional errors
    try {
      console.error('Error details:', JSON.stringify(error, null, 2));
    } catch (jsonError) {
      console.error('Error converting error to JSON:', error.message);
    }
    return false;
  }
};

module.exports = { sendOTPEmail, sendLoginSuccessEmail, sendOrderConfirmationEmail, sendPasswordResetEmail }; 