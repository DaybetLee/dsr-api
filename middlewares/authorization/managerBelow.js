const config = require("config");

module.exports = (req, res, next) => {
  if (
    config.get("userPriority")[req.user.role] <=
    config.get("userPriority")["manager"]
  )
    next();
  else return res.status(403).send("Access Denied");
};
