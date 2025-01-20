import { openDB } from "idb";
import { StateStorage } from "zustand/middleware";

const dbPromise = openDB("test-store", 1, {
  upgrade(db) {
    db.createObjectStore("state");
  },
});

const get = async (key: string) => {
  const db = await dbPromise;
  return db.get("state", key);
};

const set = async (key: string, value: unknown) => {
  const db = await dbPromise;
  await db.put("state", value, key);
};

const del = async (key: string) => {
  const db = await dbPromise;
  await db.delete("state", key);
};

export const storage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    const result = await get(name);
    return result ? JSON.stringify(result) : null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    const parsedValue = JSON.parse(value);
    await set(name, parsedValue);
  },
  removeItem: async (name: string): Promise<void> => {
    await del(name);
  },
};
