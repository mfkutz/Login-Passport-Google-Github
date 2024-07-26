import { Router } from "express";
import passport from "passport";

const router = Router();

router.get("/github", passport.authenticate("github"));

// router.get("/google", (req, res) => res.send(req.user)); //for testing

router.get(
  "/google",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
  })
);

router.get(
  "/google-callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // Successful authentication, redirect home.
    // res.redirect("/");
    console.log("ver google", req.user);

    if (req.user) {
      req.session.user = req.user;
      return res.redirect("/");
    }

    res.json({ message: "I'm here!" });
  }
);

router.get(
  "/github-callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    console.log("ver esto:", req.user);

    if (req.user) {
      req.session.user = req.user;
      return res.redirect("/");
    }

    res.redirect("/login");
  }
);

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

export default router;
