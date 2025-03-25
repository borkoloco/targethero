function roleMiddleware(allowedRoles) {
  return (req, res, next) => {
    const user = req.user;

    if (!user || !allowedRoles.includes(user.role)) {
      return res
        .status(403)
        .json({ error: "Access denied. Insufficient role." });
    }

    next();
  };
}

module.exports = roleMiddleware;
