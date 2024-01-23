import { v2 as cloudinary } from "cloudinary";
interface cloundOptions {
  cloud_name: string;
  api_key: string;
  api_secret: string;
  basePath: string;
}

interface SignedUrl {
  Url: string;
  Parameters: Record<string, any>;
  Signature: string;
}

export default class CloundinaryService {
  private static service?: CloundinaryService;
  private static options?: cloundOptions;

  private _cloundinary = cloudinary;
  private cloundOptions?: cloundOptions;
  private constructor(options: cloundOptions) {
    this._cloundinary.config({ ...options, secure: true });
    this.cloundOptions = options;
  }
  public static useOptionCloundinaryService(options: cloundOptions) {
    return (this.options = options);
  }
  public static get instance() {
    if (!this.service) {
      if (!this.options) {
        throw new Error("Cloundinary service must be have an its instance");
      }
      this.service = new CloundinaryService(this.options);
    }
    return this.service;
  }

  public SignImageUploadUrl(parmater?: Record<string, any>): string {
    var url = this._cloundinary.utils.api_url("upload");
    const signedUrl = this.signUrl(url, this.toDictionary(parmater));
    return `${signedUrl.Url}?signature=${signedUrl.Signature}&api_key=${
      this.cloundOptions!.api_key
    }&${Object.entries(signedUrl.Parameters)
      .map(([key, value]) => `${key}=${value}`)
      .join("&")}`;
  }

  private toDictionary(
    parameters: Record<string, any> | null | undefined
  ): Record<string, any> {
    const dictionary: Record<string, any> = {};

    if (parameters) {
      for (const [key, value] of Object.entries(parameters)) {
        if (value !== null && value !== undefined) {
          dictionary[key] = value;
        }
      }
    }

    return dictionary;
  }
  private signUrl(url: string, parameters?: Record<string, any>): SignedUrl {
    parameters!.timestamp = Math.floor(Date.now() / 1000).toString();

    if (parameters && parameters.folder) {
      parameters.folder = `${this.cloundOptions!.basePath}/${
        parameters.folder
      }`;
    } else {
      parameters!.folder = this.cloundOptions!.basePath;
    }
    const signature = this._cloundinary.utils.api_sign_request(
      parameters!,
      this._cloundinary.config().api_secret!
    );

    return {
      Url: url,
      Parameters: parameters || {},
      Signature: signature,
    };
  }
}
