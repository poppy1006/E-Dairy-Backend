const generatePassword = () => {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const password = [];
  const min = 8;
  const max = 25;

  for (let i = 0; i < Math.floor(Math.random() * (max - min + 1)) + min; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password.push(charset[randomIndex]);
  }

  return password.join("");
};

export default generatePassword;
