import "@testing-library/jest-dom";
import { expect, afterEach, beforeEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";
import messages from "@/i18n/messages/hr.json";

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

function getMessage(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

function formatMessage(message: string, values?: Record<string, unknown>) {
  if (!values) return message;
  return message.replace(/\{(\w+)\}/g, (_, key: string) => {
    const value = values[key];
    return value === undefined ? `{${key}}` : String(value);
  });
}

vi.mock("@/i18n/navigation", async () => {
  const React = await import("react");

  return {
    Link: ({
      href,
      children,
      ...props
    }: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
      href: string;
      children?: React.ReactNode;
    }) =>
      React.createElement("a", { href, ...props }, children),
    usePathname: () => "/",
    useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
    redirect: vi.fn(),
    getPathname: vi.fn(),
  };
});

vi.mock("next-intl", () => ({
  useLocale: () => "hr",
  useTranslations: (namespace?: string) => {
    return (key: string, values?: Record<string, unknown>) => {
      const fullKey = namespace ? `${namespace}.${key}` : key;
      const resolved = getMessage(messages, fullKey);

      if (typeof resolved === "string") {
        return formatMessage(resolved, values);
      }

      return fullKey;
    };
  },
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

global.localStorage = localStorageMock as Storage;

// Mock ResizeObserver for Radix UI components (Slider, etc.)
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Clear localStorage before each test
beforeEach(() => {
  localStorage.clear();
});

// Cleanup after each test
afterEach(() => {
  cleanup();
});
