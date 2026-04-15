import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const clubs = sqliteTable("clubs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  brand: text("brand").notNull(),
  model: text("model").notNull(),
  variant: text("variant"),
  loft: real("loft").notNull(),
  clubType: text("club_type").notNull(),
  enabled: integer("enabled").notNull().default(1),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: text("created_at").notNull(),
});

export const calibrations = sqliteTable("calibrations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  clubId: integer("club_id").notNull(),
  yardage: real("yardage").notNull(),
  createdAt: text("created_at").notNull(),
});

export const rounds = sqliteTable("rounds", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  courseName: text("course_name").notNull(),
  date: text("date").notNull(),
  tees: text("tees"),
  notes: text("notes"),
  createdAt: text("created_at").notNull(),
});

export const shots = sqliteTable("shots", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  roundId: integer("round_id").notNull(),
  holeNumber: integer("hole_number").notNull(),
  clubId: integer("club_id"),
  distanceToPin: real("distance_to_pin"),
  playsAsDistance: real("plays_as_distance"),
  result: text("result"),
  putts: integer("putts"),
  notes: text("notes"),
  createdAt: text("created_at").notNull(),
});

export const settings = sqliteTable("settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
});

export const insertClubSchema = createInsertSchema(clubs).omit({ id: true });
export const insertCalibrationSchema = createInsertSchema(calibrations).omit({ id: true });
export const insertRoundSchema = createInsertSchema(rounds).omit({ id: true });
export const insertShotSchema = createInsertSchema(shots).omit({ id: true });
export const insertSettingSchema = createInsertSchema(settings).omit({ id: true });

export type Club = typeof clubs.$inferSelect;
export type InsertClub = z.infer<typeof insertClubSchema>;
export type Calibration = typeof calibrations.$inferSelect;
export type InsertCalibration = z.infer<typeof insertCalibrationSchema>;
export type Round = typeof rounds.$inferSelect;
export type InsertRound = z.infer<typeof insertRoundSchema>;
export type Shot = typeof shots.$inferSelect;
export type InsertShot = z.infer<typeof insertShotSchema>;
export type Setting = typeof settings.$inferSelect;
export type InsertSetting = z.infer<typeof insertSettingSchema>;
