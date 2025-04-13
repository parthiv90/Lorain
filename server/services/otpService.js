const OTP = require('../models/OTP');
const config = require('../config');
const nodemailer = require('nodemailer');
const twilio = require('twilio');

class OTPService {
  /**
   * OTP જનરેટ કરો અને ડેટાબેસમાં સેવ કરો
   * @param {Object} details - OTP માટેની માહિતી
   * @param {string} [details.phoneNumber] - યુઝરનો ફોન નંબર
   * @param {string} [details.email] - યુઝરનો ઇમેઇલ
   * @returns {Promise<string>} - જનરેટ થયેલ OTP
   */
  static async generateOTP(details) {
    const { phoneNumber, email } = details;

    // ચેક કરો કે ઓછામાં ઓછું એક ફીલ્ડ આપવામાં આવ્યું છે
    if (!phoneNumber && !email) {
      throw new Error('ફોન નંબર અથવા ઇમેઇલ આપવાની જરૂર છે');
    }

    // રેન્ડમ OTP જનરેટ કરો
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // ચેક કરો કે આ યુઝર માટે પહેલાથી કોઈ OTP એક્ઝિસ્ટ કરે છે
    let otpRecord = null;
    
    const filter = phoneNumber 
      ? { phoneNumber } 
      : { email };
    
    otpRecord = await OTP.findOne(filter);

    if (otpRecord) {
      // જો OTP પહેલાથી એક્ઝિસ્ટ કરે છે તો અપડેટ કરો
      otpRecord.otp = otp;
      otpRecord.verified = false;
      otpRecord.retryCount = 0;
      otpRecord.createdAt = Date.now();
    } else {
      // નવો OTP રેકોર્ડ બનાવો
      otpRecord = new OTP({
        phoneNumber,
        email,
        otp,
      });
    }

    await otpRecord.save();
    return otp;
  }

  /**
   * OTP વેલિડેટ કરો
   * @param {Object} details - વેલિડેશન માટેની માહિતી
   * @param {string} [details.phoneNumber] - યુઝરનો ફોન નંબર
   * @param {string} [details.email] - યુઝરનો ઇમેઇલ
   * @param {string} details.otp - વેરિફાય કરવા માટેનો OTP
   * @returns {Promise<boolean>} - વેલિડેશન સફળ છે કે નહીં
   */
  static async verifyOTP(details) {
    const { phoneNumber, email, otp } = details;

    if (!otp) {
      throw new Error('OTP આપવાની જરૂર છે');
    }

    if (!phoneNumber && !email) {
      throw new Error('ફોન નંબર અથવા ઇમેઇલ આપવાની જરૂર છે');
    }

    const filter = phoneNumber 
      ? { phoneNumber } 
      : { email };

    const otpRecord = await OTP.findOne(filter);

    if (!otpRecord) {
      throw new Error('OTP રેકોર્ડ મળ્યો નથી');
    }

    // ચેક કરો કે OTP એક્સપાયર થયો છે કે નહીં
    const now = Date.now();
    const createdAt = new Date(otpRecord.createdAt).getTime();
    const timeDiff = (now - createdAt) / 1000; // સેકન્ડમાં
    
    if (timeDiff > config.otp.expiry) {
      throw new Error('OTP એક્સપાયર થઈ ગયો છે');
    }

    // ચેક કરો કે રિટ્રાય લિમિટને ક્રોસ કરવામાં આવી છે કે નહીં
    if (otpRecord.retryCount >= config.otp.maxRetries) {
      throw new Error('મહત્તમ રિટ્રાય સીમા ઓળંગી ગઈ. નવો OTP જનરેટ કરો');
    }

    // ચેક કરો કે OTP મેચ થાય છે કે નહીં
    if (otpRecord.otp !== otp) {
      otpRecord.retryCount += 1;
      await otpRecord.save();
      throw new Error('અમાન્ય OTP');
    }

    // OTP વેરિફાય કરો
    otpRecord.verified = true;
    await otpRecord.save();
    return true;
  }

  /**
   * ઇમેઇલ દ્વારા OTP મોકલો
   * @param {string} email - યુઝરનો ઇમેઇલ
   * @param {string} otp - મોકલવા માટેનો OTP
   * @returns {Promise<boolean>} - OTP મોકલવામાં સફળતા
   */
  static async sendOTPByEmail(email, otp) {
    try {
      const transporter = nodemailer.createTransport({
        service: config.email.service,
        auth: config.email.auth,
      });

      await transporter.sendMail({
        from: config.email.sender,
        to: email,
        subject: 'તમારો વેરિફિકેશન કોડ',
        text: `તમારો OTP કોડ છે: ${otp}. આ કોડ ${config.otp.expiry / 60} મિનિટ માટે માન્ય છે.`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="color: #4a4a4a;">તમારો વેરિફિકેશન કોડ</h2>
            <p style="font-size: 16px; color: #666;">નીચે તમારો વન-ટાઇમ પાસવર્ડ (OTP) છે:</p>
            <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; border-radius: 5px; margin: 20px 0;">${otp}</div>
            <p style="color: #666; font-size: 14px;">આ કોડ ${config.otp.expiry / 60} મિનિટ માટે માન્ય છે.</p>
            <p style="color: #666; font-size: 14px;">જો તમે આ વિનંતી નથી કરી, તો કૃપા કરીને આ ઇમેઇલને અવગણો.</p>
          </div>
        `,
      });

      return true;
    } catch (error) {
      console.error('ઇમેઇલ મોકલવામાં ભૂલ:', error);
      throw new Error('OTP ઇમેઇલ મોકલવામાં નિષ્ફળ');
    }
  }

  /**
   * SMS દ્વારા OTP મોકલો
   * @param {string} phoneNumber - યુઝરનો ફોન નંબર
   * @param {string} otp - મોકલવા માટેનો OTP
   * @returns {Promise<boolean>} - OTP મોકલવામાં સફળતા
   */
  static async sendOTPBySMS(phoneNumber, otp) {
    try {
      const client = twilio(config.sms.accountSid, config.sms.authToken);
      
      await client.messages.create({
        body: `તમારો OTP કોડ છે: ${otp}. આ કોડ ${config.otp.expiry / 60} મિનિટ માટે માન્ય છે.`,
        from: config.sms.phoneNumber,
        to: phoneNumber
      });

      return true;
    } catch (error) {
      console.error('SMS મોકલવામાં ભૂલ:', error);
      throw new Error('OTP SMS મોકલવામાં નિષ્ફળ');
    }
  }
}

module.exports = OTPService; 