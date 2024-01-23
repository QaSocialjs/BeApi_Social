import * as Mailer from "nodemailer";
import { SmtpEmailOption, SmtpTransportOption } from "../models/SmtpOption";

export default class SendMailService {
  private static options: SmtpTransportOption | undefined;
  public static sendMailService: SendMailService | null = null;
  private transporter: Mailer.Transporter | undefined;

  private constructor(options: SmtpTransportOption) {
    this.transporter = Mailer.createTransport(options);
  }

  public static getInstance(): SendMailService {
    if (!SendMailService.sendMailService) {
      if (!SendMailService.options) {
        throw new Error(
          "Transporter not initialized. Call useOptions() first."
        );
      }
      SendMailService.sendMailService = new SendMailService(
        SendMailService.options
      );
    }
    return SendMailService.sendMailService;
  }

  public static useOptions(options: SmtpTransportOption) {
    SendMailService.options = options;
  }

  public async sendMail(
    options: SmtpTransportOption
  ): Promise<Mailer.SentMessageInfo> {
    if (!this.transporter) {
      throw new Error("Transporter not initialized. Call getInstance() first.");
    }
    return await this.transporter.sendMail(options);
  }
}

export const optionTransport: SmtpTransportOption = {
  service: "gmail",
  port: 2525,
  auth: {
    user: "anhla12h@gmail.com",
    pass: "zsis gucy jmkj esrg",
  },
};
