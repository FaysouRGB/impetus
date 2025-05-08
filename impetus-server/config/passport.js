import passport from "passport";
import { Strategy as DiscordStrategy } from "passport-discord";
import User from "../models/User.js";
import { DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, DISCORD_CALLBACK_URL } from "./config.js";

export default () => {
  passport.use(
    new DiscordStrategy(
      {
        clientID: DISCORD_CLIENT_ID,
        clientSecret: DISCORD_CLIENT_SECRET,
        callbackURL: DISCORD_CALLBACK_URL,
        scope: ["identify"],
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ discordId: profile.id });
          if (!user) {
            user = await User.create({
              discordId: profile.id,
              username: profile.username,
              avatar: `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`,
            });
          } else if (user.username !== profile.username || user.avatar !== profile.avatar) {
            user.username = profile.username;
            user.avatar = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`;
            await user.save();
          }

          return done(null, user);
        } catch (error) {
          done(error, null);
        }
      }
    )
  );
};
