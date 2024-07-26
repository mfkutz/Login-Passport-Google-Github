import passport from "passport";
import GitHubStrategy from "passport-github2";
import GoogleStrategy from "passport-google-oauth20";
import { userModel } from "../models/user.model.js";
import { config } from "dotenv";

config();

export const initializePassport = () => {
  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:8080/api/session/github-callback",
        scope: ["user:email"],
      },
      async (access_token, refresh_token, profile, done) => {
        try {
          console.log(profile);

          const email = profile.emails[0].value;

          const user = await userModel.findOne({
            email,
          });

          if (user) {
            return done(null, user);
          }

          const newUser = await userModel.create({
            name: profile.displayName,
            email,
            age: profile.agle || 0,
            githubId: profile.id,
          });

          return done(null, newUser);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "google",
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:8080/api/session/google-callback",
        scope: ["email", "profile"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails[0].value;
          const user = await userModel.findOne({
            email,
          });

          if (user) {
            return done(null, user);
          }

          const newUser = await userModel.create({
            name: profile.displayName,
            email,
            age: profile.age || 0,
            googleId: profile.id,
          });

          return done(null, newUser);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    // console.log("serializing user!!!!", user);
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await userModel.findById(id);

      return done(null, user);
    } catch (error) {
      return done(`Hubo un error: ${error.message}`);
    }
  });
};
