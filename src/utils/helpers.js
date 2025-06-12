// Helper function để kiểm tra độ phức tạp mật khẩu
export const isPasswordComplex = (password) => {
  if (password.length < 8) return false;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasNonAlphas = /\W/.test(password); // Ký tự đặc biệt
  return hasUpperCase && hasLowerCase && hasNumbers && hasNonAlphas;
};

// Helper function để kiểm tra định dạng email
export const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};