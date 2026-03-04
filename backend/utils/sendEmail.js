import nodemailer from 'nodemailer';

const sendEmail = async ({ to, subject, html }) => {
    // Create a transporter based on environment
    let transporter;

    // Use real SMTP if credentials are provided, otherwise use Ethereal in development
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    } else if (process.env.NODE_ENV !== 'production') {
        // Development fallback: Use Ethereal test account
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });
    } else {
        throw new Error('SMTP credentials are required in production');
    }

    const mailOptions = {
        from: process.env.EMAIL_FROM || '"ASTU Gebeya" <noreply@astugebeya.com>',
        to,
        subject,
        html,
    };

    const info = await transporter.sendMail(mailOptions);

    // In development, log the preview URL
    if (process.env.NODE_ENV !== 'production') {
        console.log(`📧 Email Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }

    return info;
};

export default sendEmail;
