import SendmailTransport from "nodemailer/lib/sendmail-transport";
import SMTPTransport from "nodemailer/lib/smtp-transport";

export interface SmtpTransportOption extends SMTPTransport.Options {}
export interface SmtpEmailOption extends SendmailTransport {}
