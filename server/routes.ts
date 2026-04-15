import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // ── Clubs ──
  app.get("/api/clubs", async (_req, res) => {
    const clubs = await storage.getClubs();
    res.json(clubs);
  });

  app.get("/api/clubs/:id", async (req, res) => {
    const club = await storage.getClub(Number(req.params.id));
    if (!club) return res.status(404).json({ message: "Club not found" });
    res.json(club);
  });

  app.post("/api/clubs", async (req, res) => {
    const club = await storage.createClub(req.body);
    res.status(201).json(club);
  });

  app.post("/api/clubs/bulk", async (req, res) => {
    const clubsData = req.body as any[];
    const created = [];
    for (const c of clubsData) {
      created.push(await storage.createClub(c));
    }
    res.status(201).json(created);
  });

  app.patch("/api/clubs/:id", async (req, res) => {
    const club = await storage.updateClub(Number(req.params.id), req.body);
    if (!club) return res.status(404).json({ message: "Club not found" });
    res.json(club);
  });

  app.delete("/api/clubs/:id", async (req, res) => {
    await storage.deleteClub(Number(req.params.id));
    res.status(204).send();
  });

  app.delete("/api/clubs", async (_req, res) => {
    await storage.deleteAllClubs();
    res.status(204).send();
  });

  // ── Calibrations ──
  app.get("/api/calibrations", async (req, res) => {
    const clubId = req.query.clubId ? Number(req.query.clubId) : undefined;
    const cals = await storage.getCalibrations(clubId);
    res.json(cals);
  });

  app.post("/api/calibrations", async (req, res) => {
    const cal = await storage.createCalibration(req.body);
    res.status(201).json(cal);
  });

  app.delete("/api/calibrations/:id", async (req, res) => {
    await storage.deleteCalibration(Number(req.params.id));
    res.status(204).send();
  });

  // ── Rounds ──
  app.get("/api/rounds", async (_req, res) => {
    const r = await storage.getRounds();
    res.json(r);
  });

  app.get("/api/rounds/:id", async (req, res) => {
    const r = await storage.getRound(Number(req.params.id));
    if (!r) return res.status(404).json({ message: "Round not found" });
    res.json(r);
  });

  app.post("/api/rounds", async (req, res) => {
    const r = await storage.createRound(req.body);
    res.status(201).json(r);
  });

  app.patch("/api/rounds/:id", async (req, res) => {
    const r = await storage.updateRound(Number(req.params.id), req.body);
    if (!r) return res.status(404).json({ message: "Round not found" });
    res.json(r);
  });

  app.delete("/api/rounds/:id", async (req, res) => {
    await storage.deleteRound(Number(req.params.id));
    res.status(204).send();
  });

  // ── Shots ──
  app.get("/api/rounds/:roundId/shots", async (req, res) => {
    const s = await storage.getShots(Number(req.params.roundId));
    res.json(s);
  });

  app.get("/api/shots", async (_req, res) => {
    const s = await storage.getAllShots();
    res.json(s);
  });

  app.post("/api/shots", async (req, res) => {
    const s = await storage.createShot(req.body);
    res.status(201).json(s);
  });

  app.patch("/api/shots/:id", async (req, res) => {
    const s = await storage.updateShot(Number(req.params.id), req.body);
    if (!s) return res.status(404).json({ message: "Shot not found" });
    res.json(s);
  });

  app.delete("/api/shots/:id", async (req, res) => {
    await storage.deleteShot(Number(req.params.id));
    res.status(204).send();
  });

  // ── Settings ──
  app.get("/api/settings", async (_req, res) => {
    const s = await storage.getSettings();
    res.json(s);
  });

  app.get("/api/settings/:key", async (req, res) => {
    const s = await storage.getSetting(req.params.key);
    if (!s) return res.status(404).json({ message: "Setting not found" });
    res.json(s);
  });

  app.put("/api/settings/:key", async (req, res) => {
    const s = await storage.setSetting(req.params.key, req.body.value);
    res.json(s);
  });

  // ── Data export/import/reset ──
  app.get("/api/export", async (_req, res) => {
    const clubsData = await storage.getClubs();
    const calibrationsData = await storage.getCalibrations();
    const roundsData = await storage.getRounds();
    const allShots = await storage.getAllShots();
    const settingsData = await storage.getSettings();
    res.json({ clubs: clubsData, calibrations: calibrationsData, rounds: roundsData, shots: allShots, settings: settingsData });
  });

  app.post("/api/import", async (req, res) => {
    const data = req.body;
    await storage.deleteAllData();
    if (data.clubs) {
      for (const c of data.clubs) {
        const { id, ...rest } = c;
        await storage.createClub(rest);
      }
    }
    if (data.calibrations) {
      for (const c of data.calibrations) {
        const { id, ...rest } = c;
        await storage.createCalibration(rest);
      }
    }
    if (data.rounds) {
      for (const r of data.rounds) {
        const { id, ...rest } = r;
        await storage.createRound(rest);
      }
    }
    if (data.shots) {
      for (const s of data.shots) {
        const { id, ...rest } = s;
        await storage.createShot(rest);
      }
    }
    if (data.settings) {
      for (const s of data.settings) {
        await storage.setSetting(s.key, s.value);
      }
    }
    res.json({ message: "Data imported successfully" });
  });

  app.post("/api/reset", async (_req, res) => {
    await storage.deleteAllData();
    res.json({ message: "All data reset" });
  });

  // ── Weather proxy ──
  app.get("/api/weather", async (req, res) => {
    const { lat, lon } = req.query;
    if (!lat || !lon) return res.status(400).json({ message: "lat and lon required" });
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,wind_direction_10m&temperature_unit=fahrenheit&wind_speed_unit=mph`;
      const response = await fetch(url);
      const data = await response.json();
      res.json(data);
    } catch {
      res.status(502).json({ message: "Weather API unavailable" });
    }
  });

  return httpServer;
}
