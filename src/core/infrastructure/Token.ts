import jwtwebtoken, {
  JwtPayload,
  SignOptions,
  DecodeOptions,
  VerifyOptions,
  Jwt,
  VerifyErrors,
} from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { native } from "rimraf";
export interface Payload extends JwtPayload {
  userId: ObjectId;
}
export interface Options extends SignOptions {}
export interface OptionsDecode extends DecodeOptions {}
export interface OptionsVerify extends VerifyOptions {}
export class Token {
  private exp: string | number | undefined = "1h";
  private secret: string;

  constructor(secret: string) {
    this.secret = secret;
  }
  public generateToken(userId: ObjectId): string {
    const payload: Payload = {
      userId: userId,
    };
    const options: Options = {
      expiresIn: this.exp,
      algorithm: "HS256",
    };
    return this.sign(payload, options);
  }
  public sign(payload: Payload, options: Options): string {
    return jwtwebtoken.sign(payload, this.secret, options);
  }
  public decode(token: string, options: OptionsDecode) {
    return jwtwebtoken.decode(token, options);
  }
  public verify(
    token: string,
    callback: (
      error: VerifyErrors | null,
      decoded?: Jwt | JwtPayload | string | undefined
    ) => void
  ) {
    return jwtwebtoken.verify(token, this.secret, (err, decoded) => {
      if (err) {
        callback(err);
      } else {
        callback(null, decoded);
      }
    });
  }
}
