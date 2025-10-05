import fs from "fs/promises";
import path from "path";
import type { Contact } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "contacts.json");

async function ensureStore() {
    await fs.mkdir(DATA_DIR, { recursive: true });

    try {
        await fs.access(DATA_FILE);
    } catch {
        await fs.writeFile(DATA_FILE, "[]", "utf-8");
    }
}

export async function readAll(): Promise<Contact[]> {
    await ensureStore();
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw) as Contact[];
}

export async function writeAll(contacts: Contact[]): Promise<void> {
    await ensureStore();
    const pretty = JSON.stringify(contacts, null, 2);
    await fs.writeFile(DATA_FILE, pretty, "utf-8");
}