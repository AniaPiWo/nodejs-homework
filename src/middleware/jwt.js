import passport from "passport";

function authMiddleware(req, res, next) {
  passport.authenticate("jwt", { session: false }, (error, user) => {
    if (error || !user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = user;
    return next();
  })(req, res, next);
}

export default authMiddleware;
