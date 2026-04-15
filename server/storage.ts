import {
  type Club, type InsertClub, clubs,
  type Calibration, type InsertCalibration, calibrations,
  type Round, type InsertRound, rounds,
  type Shot, type InsertShot, shots,
  type Setting, settings,
} from "@shared/schema";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { eq, asc, desc } from "drizzle-orm";

const sqlite = new Database("data.db");
sqlite.pragma("journal_mode = WAL");

export const db = drizzle(sqlite);

export class DatabaseStorage {
  // Clubs
  async getClubs(): Promise<Club[]> {
    return db.select().from(clubs).orderBy(asc(clubs.sortOrder)).all();
  }

  async getClub(id: number): Promise<Club | undefined> {
    return db.select().from(clubs).where(eq(clubs.id, id)).get();
  }

  async createClub(club: InsertClub): Promise<Club> {
    return db.insert(clubs).values(club).returning().get();
  }

  async updateClub(id: number, data: Partial<InsertClub>): Promise<Club | undefined> {
    return db.update(clubs).set(data).where(eq(clubs.id, id)).returning().get();
  }

  async deleteClub(id: number): Promise<void> {
    db.delete(calibrations).where(eq(calibrations.clubId, id)).run();
    db.delete(clubs).where(eq(clubs.id, id)).run();
  }

  async deleteAllClubs(): Promise<void> {
    db.delete(calibrations).run();
    db.delete(clubs).run();
  }

  // Calibrations
  async getCalibrations(clubId?: number): Promise<Calibration[]> {
    if (clubId !== undefined) {
      return db.select().from(calibrations).where(eq(calibrations.clubId, clubId)).all();
    }
    return db.select().from(calibrations).all();
  }

  async createCalibration(cal: InsertCalibration): Promise<Calibration> {
    return db.insert(calibrations).values(cal).returning().get();
  }

  async deleteCalibration(id: number): Promise<void> {
    db.delete(calibrations).where(eq(calibrations.id, id)).run();
  }

  // Rounds
  async getRounds(): Promise<Round[]> {
    return db.select().from(rounds).orderBy(desc(rounds.date)).all();
  }

  async getRound(id: number): Promise<Round | undefined> {
    return db.select().from(rounds).where(eq(rounds.id, id)).get();
  }

  async createRound(round: InsertRound): Promise<Round> {
    return db.insert(rounds).values(round).returning().get();
  }

  async updateRound(id: number, data: Partial<InsertRound>): Promise<Round | undefined> {
    return db.update(rounds).set(data).where(eq(rounds.id, id)).returning().get();
  }

  async deleteRound(id: number): Promise<void> {
    db.delete(shots).where(eq(shots.roundId, id)).run();
    db.delete(rounds).where(eq(rounds.id, id)).run();
  }

  // Shots
  async getShots(roundId: number): Promise<Shot[]> {
    return db.select().from(shots).where(eq(shots.roundId, roundId)).orderBy(asc(shots.holeNumber), asc(shots.id)).all();
  }

  async getAllShots(): Promise<Shot[]> {
    return db.select().from(shots).all();
  }

  async createShot(shot: InsertShot): Promise<Shot> {
    return db.insert(shots).values(shot).returning().get();
  }

  async updateShot(id: number, data: Partial<InsertShot>): Promise<Shot | undefined> {
    return db.update(shots).set(data).where(eq(shots.id, id)).returning().get();
  }

  async deleteShot(id: number): Promise<void> {
    db.delete(shots).where(eq(shots.id, id)).run();
  }

  // Settings
  async getSettings(): Promise<Setting[]> {
    return db.select().from(settings).all();
  }

  async getSetting(key: string): Promise<Setting | undefined> {
    return db.select().from(settings).where(eq(settings.key, key)).get();
  }

  async setSetting(key: string, value: string): Promise<Setting> {
    const existing = await this.getSetting(key);
    if (existing) {
      return db.update(settings).set({ value }).where(eq(settings.key, key)).returning().get();
    }
    return db.insert(settings).values({ key, value }).returning().get();
  }

  async deleteSetting(key: string): Promise<void> {
    db.delete(settings).where(eq(settings.key, key)).run();
  }

  async deleteAllData(): Promise<void> {
    db.delete(shots).run();
    db.delete(rounds).run();
    db.delete(calibrations).run();
    db.delete(clubs).run();
    db.delete(settings).run();
  }
}

export const storage = new DatabaseStorage();
