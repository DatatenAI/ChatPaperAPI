import process from "process";
import mailer from "nodemailer";
import compileTemplate from "string-template";


type  MailParameterTypes = {
    register: {
        link: string;
    },
    reset_password: {
        link: string;
    },
    change_email: {
        link: string;
    }
}
export type MailType = keyof MailParameterTypes;

type SendFunction = (type: MailType, options: {
    subject: string;
    params: MailParameterTypes[typeof type];
    to: string;
    from?: string
}) => Promise<void>


const templates: Record<MailType, string> = {
    register: "{link}",
    change_email: "{link}",
    reset_password: "{link}",

}

const transporter = mailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
});

const fillTemplate = (mailType: MailType, params: MailParameterTypes[typeof mailType]) => {
    const templateFile = templates[mailType];
    return compileTemplate(templateFile, params);
}
export const sendMail: SendFunction = async (type, options) => {
    const html = fillTemplate(type, options.params);
    await transporter.sendMail({
        html,
        subject: options.subject,
        to: options.to,
        from: options.from || process.env.SMTP_FROM
    });
};

