import assert from "node:assert/strict";
import test from "node:test";
import { injectGrokPwaHead, readGrokExtensionsEnabled } from "./grok-pwa-shared.mjs";

const page = "<!doctype html><html><head><title>Lilula Beverages</title></head><body></body></html>";
const withBadge =
  '<!doctype html><html><head><script src="https://grok.com/grok-app-builder/extensions.js" defer></script></head><body></body></html>';
const ctx = { host: "example.co.za", site: { title: "Lilula Beverages", card: "custom" } };

function withEnv(value, run) {
  const before = process.env.VITE_GROK_EXTENSIONS;
  if (value === undefined) delete process.env.VITE_GROK_EXTENSIONS;
  else process.env.VITE_GROK_EXTENSIONS = value;
  try {
    run();
  } finally {
    if (before === undefined) delete process.env.VITE_GROK_EXTENSIONS;
    else process.env.VITE_GROK_EXTENSIONS = before;
  }
}

test("the Grok badge script is off by default", () => {
  withEnv(undefined, () => {
    assert.equal(readGrokExtensionsEnabled(), false);
    assert.doesNotMatch(injectGrokPwaHead(page, ctx), /extensions\.js/);
  });
});

test("a badge script already in the page is removed", () => {
  withEnv(undefined, () => {
    assert.doesNotMatch(injectGrokPwaHead(withBadge, ctx), /extensions\.js/);
  });
});

test("VITE_GROK_EXTENSIONS=0 keeps it off, =1 opts back in", () => {
  withEnv("0", () => {
    assert.doesNotMatch(injectGrokPwaHead(page, ctx), /extensions\.js/);
  });
  withEnv("1", () => {
    assert.equal(readGrokExtensionsEnabled(), true);
    assert.match(injectGrokPwaHead(page, ctx), /extensions\.js/);
  });
});
