module.exports = (requiredRoleId) => {
    return (req, res, next) => {
      if (req.user.role_id !== requiredRoleId) {
        return res.status(403).json({ error: "Access denied" });
      }
      next();
    };
  };
  