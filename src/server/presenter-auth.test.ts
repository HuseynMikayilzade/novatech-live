import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseLiveState } from "../domain/live.ts";
import { PRESENTER_TTL_SEC, signPresenterToken, verifyPresenterToken } from "./presenter-auth.ts";

const SECRET = "correct-horse-battery-staple";
const NOW = Date.UTC(2026, 9, 21, 10, 0, 0);

describe("presenter token", () => {
  it("verifies a fresh token signed with the same key", () => {
    assert.equal(verifyPresenterToken(signPresenterToken(SECRET, NOW), SECRET, NOW + 1000), true);
  });

  it("rejects expired tokens", () => {
    const token = signPresenterToken(SECRET, NOW);
    assert.equal(verifyPresenterToken(token, SECRET, NOW + PRESENTER_TTL_SEC * 1000 + 1), false);
  });

  it("rejects tokens after the admin key is rotated", () => {
    assert.equal(verifyPresenterToken(signPresenterToken(SECRET, NOW), "another-long-secret-key", NOW), false);
  });

  it("rejects tampered or malformed tokens", () => {
    const [expiry, sig] = signPresenterToken(SECRET, NOW).split(".") as [string, string];
    assert.equal(verifyPresenterToken(`${Number(expiry) + 3600}.${sig}`, SECRET, NOW), false);
    assert.equal(verifyPresenterToken(`${expiry}.${sig}x`, SECRET, NOW), false);
    assert.equal(verifyPresenterToken(`${expiry}.${sig}.extra`, SECRET, NOW), false);
    assert.equal(verifyPresenterToken("", SECRET, NOW), false);
    assert.equal(verifyPresenterToken(undefined, SECRET, NOW), false);
  });

  it("is disabled when no usable admin key is configured", () => {
    assert.equal(verifyPresenterToken(signPresenterToken("short", NOW), "short", NOW), false);
    assert.equal(verifyPresenterToken(signPresenterToken(SECRET, NOW), undefined, NOW), false);
  });
});

describe("parseLiveState", () => {
  const updatedAt = new Date(NOW).toISOString();

  it("accepts a valid state and orders questions by catalog", () => {
    assert.deepEqual(parseLiveState({ slide: 12, questionIds: ["satisfaction", "first-step"], updatedAt }), {
      slide: 12,
      questionIds: ["first-step", "satisfaction"],
      updatedAt,
    });
  });

  it("accepts content slides without questions", () => {
    assert.deepEqual(parseLiveState({ slide: 3, questionIds: [], updatedAt })?.questionIds, []);
  });

  it("rejects unknown questions, bad slides and junk", () => {
    assert.equal(parseLiveState({ slide: 2, questionIds: ["nope"], updatedAt }), null);
    assert.equal(parseLiveState({ slide: 0, questionIds: [], updatedAt }), null);
    assert.equal(parseLiveState({ slide: 2.5, questionIds: [], updatedAt }), null);
    assert.equal(parseLiveState({ slide: 2, questionIds: [], updatedAt: "yesterday" }), null);
    assert.equal(parseLiveState("{}"), null);
    assert.equal(parseLiveState(null), null);
  });
});
