import * as bcrypt from "bcrypt";

const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  const hashed_password = await bcrypt.hash(password, salt);
  return hashed_password;
};

export default hashPassword;
