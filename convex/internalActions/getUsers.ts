import { v } from "convex/values";
import { internalQuery } from "../_generated/server";

export const getUsers = internalQuery({
  args: {},
  returns: v.array(
    v.object({
      email: v.string(),
      emailEnabled: v.optional(v.boolean()),
      pet: v.optional(
        v.object({
          name: v.string(),
          health: v.number(),
          hunger: v.number(),
          mood: v.string(),
        })
      ),
    })
  ),
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    const pets = await ctx.db.query("pets").collect();

    return users.map((user) => {
      const userPet = pets.find((pet) => pet.userId === user._id);
      return {
        email: user.email,
        emailEnabled: user.emailEnabled,
        pet: userPet
          ? {
              name: userPet.name,
              health: userPet.health,
              hunger: userPet.hunger,
              mood: userPet.mood,
            }
          : undefined,
      };
    });
  },
});
