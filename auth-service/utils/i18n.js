const messages = {
  en: {
    NOT_FOUND: "Not found",
    INVALID_DATA: "Invalid data",
    NO_TOKEN: "No token provided",
    INVALID_TOKEN: "Invalid token",
    ADMIN_ONLY: "Admin only",
    USER_EXISTS: "User already exists",
    WRONG_PASSWORD: "Wrong password",
    USER_NOT_FOUND: "User not found"
  },
  ru: {
    NOT_FOUND: "Не найдено",
    INVALID_DATA: "Неверные данные",
    NO_TOKEN: "Токен отсутствует",
    INVALID_TOKEN: "Неверный токен",
    ADMIN_ONLY: "Только для администратора",
    USER_EXISTS: "Пользователь уже существует",
    WRONG_PASSWORD: "Неверный пароль",
    USER_NOT_FOUND: "Пользователь не найден"
  }
};

module.exports = (req, key) => {
  const lang = req.headers["accept-language"] || "en";
  return messages[lang]?.[key] || messages.en[key];
};