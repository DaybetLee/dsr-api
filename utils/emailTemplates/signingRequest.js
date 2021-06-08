module.exports = (manager, user) => {
  return `
      <p>Hi ${manager.name},</p>
      <p>This email is to notify you that you have received a new signing request from ${user.name}.</p>
      <footer>
        <hr>
        <a>This is an auto-generated email; please do not reply to this email.</a>
      </footer>
      `;
};
