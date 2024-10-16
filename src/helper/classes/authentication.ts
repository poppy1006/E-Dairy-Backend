import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import ApiError from "./api-error";
import generateOtp from "../functions/generateOtp";
import { OTP_EXPIRATION_TIME } from "../constants";
import emails from "../functions/mailer";

export default class Authentication {
  model: any;
  jwt_secret: string;
  jwt_expres_in: string;

  constructor(model: any) {
    this.model = model;
    this.jwt_secret = process.env.JWT_SECRET as string;
    this.jwt_expres_in = process.env.JWT_EXPIRE as string;
  }

  async signUp(name: string, email: string, password: string, role?: string) {
    const user_exist = await this.model.findUnique({ where: { email } });
    if (user_exist)
      throw new ApiError("An account is already associated with this email");

    const salt = await bcrypt.genSalt(10);
    const hashed_password = await bcrypt.hash(password, salt);

    const user = await this.model.create({
      data: { name, email, password: hashed_password, role },
    });
    return user;
  }

  async signIn(email: string, password: string) {
    const user = await this.model.findUnique({ where: { email } });
    if (!user) {
      throw new ApiError("Invalid email or password");
    }

    if (!user.password) throw new ApiError("Invalid email or password");
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new ApiError("Invalid email or password");
    }

    const token = jwt.sign(
      { id: user.id, email, name: user.name },
      this.jwt_secret
      // { expiresIn: this.jwt_expres_in } //TODO: uncomment this line
    );
    return { token, user };
  }

  async forgotPassword(email: string) {
    const user = await this.model.findUnique({ where: { email } });
    if (!user) throw new ApiError("Invalid email", 400);

    const otp = 111111; // generateOtp();
    await this.model.update({
      where: { email },
      data: { otp: { otp, createdAt: Date.now() } },
    });

    // await emails.forgotPassword(email, `${otp}`, user.name); // TODO: uncomment once SES is config-ed

    return true;
  }

  async verifyOTP(email: string, otp: string) {
    const user = await this.model.findUnique({ where: { email } });
    if (!user) throw new ApiError("Invalid email", 400);

    const storedOtp = user.otp;
    const currentTime = Date.now();

    if (
      !storedOtp ||
      storedOtp.otp.toString() !== otp.toString() ||
      currentTime - storedOtp.createdAt > OTP_EXPIRATION_TIME
    ) {
      throw new ApiError("otp expired or invalid");
    }

    return true;
  }

  async resetPassword(email: string, otp: string, newPassword: string) {
    if (!(await this.verifyOTP(email, otp))) {
      throw new ApiError("Invalid otp", 400);
    }

    const user = await this.model.findUnique({ where: { email } });
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    await this.model.update({
      where: { email },
      data: { password: hashedNewPassword },
    });

    const token = jwt.sign(
      { id: user.id, email, name: user.name },
      this.jwt_secret
      // { expiresIn: this.jwt_expres_in } //TODO: uncomment this line
    );
    return token;
  }
}
