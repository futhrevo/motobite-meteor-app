const smtp = {
  username: 'SMTP_Injection',
  password: 'c17fb845a2591f75c827b18603615bb0b8e4556b',
  server: 'smtp.sparkpostmail.com',
  port: 2525,
};

process.env.MAIL_URL = `smtp://${encodeURIComponent(smtp.username)}:${encodeURIComponent(smtp.password)}@${encodeURIComponent(smtp.server)}:${smtp.port}`;
