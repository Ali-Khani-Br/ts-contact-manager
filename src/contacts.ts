import { readAll, writeAll } from "./storage";
import type { Contact, ContactCreate, ContactUpdate, ContactID } from "./types";

// تولید شناسه ساده
function simpleId(): string {
  return Math.random().toString(36).slice(2, 10);
}

// کمک: اگر چیزی پیدا نشد، خطا بده (برای نِرو کردنِ نوع)
function assertContact(x: Contact | undefined, msg = "Contact not found"): asserts x is Contact {
  if (!x) throw new Error(msg);
}

// لیست
export async function listContacts(): Promise<Contact[]> {
  return readAll();
}

// افزودن
export async function addContact(input: ContactCreate): Promise<Contact> {
  const name = input.name?.trim();
  const email = input.email?.trim();
  const phone = input.phone ? input.phone.trim() : undefined;
  const tags = input.tags ?? [];

  if (!name || !email) {
    throw new Error("name and email are required");
  }

  const now = new Date().toISOString();
  const newContact: Contact = {
    id: simpleId(),
    name,
    email,
    phone,
    tags,
    createdAt: now,
    updatedAt: now,
  };

  const contacts = await readAll();

  const exists = contacts.some(
    (c) => c.email.toLowerCase() === newContact.email.toLowerCase()
  );
  if (exists) throw new Error("Email already exists");

  contacts.push(newContact);
  await writeAll(contacts);
  return newContact;
}

// پیدا کردن با ایمیل
export async function findByEmail(email: string): Promise<Contact | undefined> {
  const contacts = await readAll();
  return contacts.find((c) => c.email.toLowerCase() === email.toLowerCase());
}

// آپدیت — نسخه مرحله‌ای و بدون اسپرد patch
export async function updateContact(
  id: ContactID,
  patch: ContactUpdate
): Promise<Contact> {
  const contacts = await readAll();
  const idx = contacts.findIndex((c) => c.id === id);
  if (idx === -1) throw new Error("Contact not found");

  const current = contacts[idx];
  assertContact(current); // حالا current قطعاً از نوع Contact است

  // از شیء فعلی یک کپی می‌سازیم و مرحله‌ای مقدار می‌دهیم:
  const updated: Contact = { ...current, updatedAt: new Date().toISOString() };

  if (patch.name !== undefined) updated.name = patch.name.trim();
  if (patch.email !== undefined) updated.email = patch.email.trim();
  if (patch.phone !== undefined) updated.phone = patch.phone.trim();
  if (patch.tags !== undefined) updated.tags = patch.tags;

  contacts[idx] = updated;
  await writeAll(contacts);
  return updated;
}

// حذف
export async function removeContact(id: ContactID): Promise<void> {
  const contacts = await readAll();
  const next = contacts.filter((c) => c.id !== id);
  if (next.length === contacts.length) throw new Error("Contact not found");
  await writeAll(next);
}