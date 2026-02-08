import nodemailer, { Transporter } from "nodemailer";

class SendEmailService {
  private transporter: Transporter | null = null;

  private getTransporter(): Transporter {
    if (!this.transporter) {
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        throw new Error("EMAIL_USER and EMAIL_PASS must be set in .env file");
      }

      this.transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
    }

    return this.transporter;
  }

  async sendAccessEmail(to: string, accessToken: string) {
    const transporter = this.getTransporter();
    const mailOptions = {
      from: `"Classroom Management System" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Your OPT - Classroom System",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background: #ffffff;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              padding: 40px;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .header h1 {
              color: #2563eb;
              margin: 0;
              font-size: 24px;
            }
            .content {
              margin: 20px 0;
            }
            .token-box {
              background: #f3f4f6;
              border-left: 4px solid #2563eb;
              padding: 20px;
              border-radius: 6px;
              margin: 20px 0;
              text-align: center;
            }
            .token {
              font-size: 32px;
              font-weight: bold;
              color: #1e40af;
              letter-spacing: 4px;
              font-family: 'Courier New', monospace;
            }
            .info {
              background: #fef3c7;
              border-left: 4px solid #f59e0b;
              padding: 15px;
              border-radius: 6px;
              margin: 20px 0;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              color: #6b7280;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎓 Classroom Management System</h1>
            </div>
            
            <div class="content">
              <h2>Hello,</h2>
              <h5>Here is your otp to log in to the system:</h5>
              
              <div class="token-box">
                <div class="token">${accessToken}</div>
              </div>
              
              <div class="info">
                <strong> Important:</strong> This otp is valid for <strong>5 minute </strong> from now.
              </div>
              
              <p>Please use this token to complete your login process.</p>
            </div>
            
            <div class="footer">
              <p>Best regards,<br><strong>Classroom Management Team</strong></p>
              <p style="font-size: 12px; color: #9ca3af;">
                If you didn't request this token, please ignore this email.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    return true;
  }

  async sendLinkUpdate(to: string, token: string, name: string): Promise<any> {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const setupLink = `${frontendUrl}/student/setup?token=${token}`;

    const emailContent = {
      from: `"Classroom Management System" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Complete Your Account Setup - Classroom System",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background: #ffffff;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              padding: 40px;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .header h1 {
              color: #2563eb;
              margin: 0;
              font-size: 28px;
            }
            .welcome {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              border-radius: 8px;
              text-align: center;
              margin: 20px 0;
            }
            .welcome h2 {
              margin: 0;
              font-size: 24px;
            }
            .content {
              margin: 20px 0;
            }
            .button-container {
              text-align: center;
              margin: 30px 0;
            }
            .setup-button {
              display: inline-block;
              background: #2563eb;
              color: white;
              padding: 15px 40px;
              text-decoration: none;
              border-radius: 6px;
              font-weight: bold;
              font-size: 16px;
              box-shadow: 0 4px 6px rgba(37, 99, 235, 0.3);
              transition: background 0.3s;
            }
            .setup-button:hover {
              background: #1e40af;
            }
            .info {
              background: #fef3c7;
              border-left: 4px solid #f59e0b;
              padding: 15px;
              border-radius: 6px;
              margin: 20px 0;
            }
            .steps {
              background: #f9fafb;
              padding: 20px;
              border-radius: 6px;
              margin: 20px 0;
            }
            .steps ol {
              margin: 10px 0;
              padding-left: 20px;
            }
            .steps li {
              margin: 8px 0;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              color: #6b7280;
              font-size: 14px;
            }
            .link-fallback {
              background: #f3f4f6;
              padding: 15px;
              border-radius: 6px;
              margin: 20px 0;
              word-break: break-all;
              font-size: 12px;
              color: #6b7280;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎓 Classroom Management System</h1>
            </div>
            
            <div class="welcome">
              <h2>Welcome, ${name}! 👋</h2>
              <p style="margin: 10px 0 0 0;">Your instructor has created an account for you</p>
            </div>
            
            <div class="content">
              <p>Hi <strong>${name}</strong>,</p>
              <p>Great news! Your instructor has set up an account for you in our Classroom Management System.</p>
              
              <div class="steps">
                <strong>📝 Next Steps:</strong>
                <ol>
                  <li>Click the button below to access the setup page</li>
                  <li>Create your username and password</li>
                  <li>Start using the system!</li>
                </ol>
              </div>
              
              <div class="button-container">
                <a href="${setupLink}" class="setup-button">
                  Complete Account Setup →
                </a>
              </div>
              
              <div class="info">
                <strong>⏰ Important:</strong> This setup link will expire in <strong>24 hours</strong>.
              </div>
              
              <p>If the button doesn't work, copy and paste this link into your browser:</p>
              <div class="link-fallback">
                ${setupLink}
              </div>
            </div>
            
            <div class="footer">
              <p>Best regards,<br><strong>Classroom Management Team</strong></p>
              <p style="font-size: 12px; color: #9ca3af;">
                If you didn't expect this email or have any questions, please contact your instructor.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    try {
      const transporter = this.getTransporter();
      const info = await transporter.sendMail(emailContent);
    } catch (error) {
      throw new Error("Email delivery failed");
    }
  }
}

export const sendEmailService = new SendEmailService();
