module.exports = (user, password) => {
  return `
        <p>Hi ${user.name},</p>
        <p>The Digital Service Report account has been created and below is the password to login.</p>
        <p>
            Password: ${password}
        </p>
        <p>Please kindly provide your signature in <b>My Reports</b> section in order to continue the usage.
        <br>Please kindly contact the system administrator if you face any obstacles.
        </p>
        <footer>
          <hr>
          <a>This is an auto-generated email; please do not reply to this email.</a>
        </footer>
        `;
};
