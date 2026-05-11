import { describe, it, expect } from "vitest";
import {
  Status,
  statusConfig,
  allStatuses,
  getStatusConfig,
  getStatusColor,
} from "./statuses";

describe("statuses", () => {
  describe("Status constants", () => {
    it("defines all five statuses", () => {
      expect(Status.VERIFIED).toBe("verified");
      expect(Status.IN_PROGRESS).toBe("inProgress");
      expect(Status.ATTENTION).toBe("attention");
      expect(Status.RISK).toBe("risk");
      expect(Status.NEUTRAL).toBe("neutral");
    });

    it("allStatuses contains all five values", () => {
      expect(allStatuses).toHaveLength(5);
      expect(allStatuses).toContain(Status.VERIFIED);
      expect(allStatuses).toContain(Status.IN_PROGRESS);
      expect(allStatuses).toContain(Status.ATTENTION);
      expect(allStatuses).toContain(Status.RISK);
      expect(allStatuses).toContain(Status.NEUTRAL);
    });
  });

  describe("statusConfig", () => {
    it("has config entries for every status", () => {
      for (const s of allStatuses) {
        const cfg = statusConfig[s];
        expect(cfg).toBeDefined();
        expect(cfg.label).toBeTruthy();
        expect(cfg.labelShort).toBeTruthy();
        expect(cfg.badgeClass).toContain("bg-");
        expect(cfg.description).toBeTruthy();
      }
    });

    it("Verified status has expected values", () => {
      expect(statusConfig[Status.VERIFIED].label).toBe("Verified");
      expect(statusConfig[Status.VERIFIED].labelShort).toBe("OK");
    });

    it("In Progress status has expected values", () => {
      expect(statusConfig[Status.IN_PROGRESS].label).toBe("In Progress");
      expect(statusConfig[Status.IN_PROGRESS].labelShort).toBe("Active");
    });

    it("Risk status has expected values", () => {
      expect(statusConfig[Status.RISK].label).toBe("Risk");
      expect(statusConfig[Status.RISK].labelShort).toBe("Error");
    });

    it("all badge classes are non-empty strings", () => {
      for (const s of allStatuses) {
        expect(statusConfig[s].badgeClass.length).toBeGreaterThan(0);
      }
    });

    it("all cssVar names follow --status-<key> pattern", () => {
      for (const s of allStatuses) {
        expect(statusConfig[s].cssVar).toMatch(/^--status-/);
        expect(statusConfig[s].cssVarForeground).toMatch(
          /^--status-.*-foreground$/,
        );
      }
    });
  });

  describe("getStatusConfig", () => {
    it("returns the config for each valid status", () => {
      expect(getStatusConfig(Status.VERIFIED).label).toBe("Verified");
      expect(getStatusConfig(Status.IN_PROGRESS).label).toBe("In Progress");
      expect(getStatusConfig(Status.ATTENTION).label).toBe("Attention");
      expect(getStatusConfig(Status.RISK).label).toBe("Risk");
      expect(getStatusConfig(Status.NEUTRAL).label).toBe("Neutral");
    });
  });

  describe("getStatusColor", () => {
    it("returns cssVar for background type by default", () => {
      expect(getStatusColor(Status.VERIFIED)).toBe("--status-verified");
    });

    it("returns cssVarForeground when type is foreground", () => {
      expect(getStatusColor(Status.VERIFIED, "foreground")).toBe(
        "--status-verified-foreground",
      );
    });

    it("returns background for explicit background type", () => {
      expect(getStatusColor(Status.RISK, "background")).toBe("--status-risk");
    });
  });
});
