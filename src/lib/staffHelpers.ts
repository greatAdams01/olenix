function generateStaffPassword(): string {
  const chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let password = '';
  for (let i = 0; i < 10; i++) {
    password += chars[Math.floor(Math.random() * chars.length)];
  }
  return password;
}

function staffLoginUrl(): string {
  return `${window.location.origin}/admin/login`;
}

function buildStaffWelcomeMessage(email: string, password: string): string {
  return `Your Olenix admin account is ready.

Login page: ${staffLoginUrl()}
Email: ${email}
Password: ${password}

Sign in, then go to Settings to change your password.`;
}

export { generateStaffPassword, staffLoginUrl, buildStaffWelcomeMessage };
