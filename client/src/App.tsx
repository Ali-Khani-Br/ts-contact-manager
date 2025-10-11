import { useEffect, useState } from "react";
import {
  getContacts,
  createContact,
  deleteContactApi,
  updateContactApi,
} from "./api";
import type { Contact } from "./api";
import "./App.css";

export default function App() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await getContacts();
      setContacts(data);
    } catch (e: any) {
      setError(e.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onAdd(e?: React.FormEvent) {
    e?.preventDefault();
    if (!name || !email) {
      setError("Name and email are required");
      return;
    }
    try {
      setError(null);
      const created = await createContact({
        name,
        email,
        phone: phone || undefined,
      });
      setContacts((s) => [created, ...s]);
      setName("");
      setEmail("");
      setPhone("");
    } catch (e: any) {
      setError(e.message);
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this contact?")) return;
    try {
      await deleteContactApi(id);
      setContacts((s) => s.filter((c) => c.id !== id));
    } catch (e: any) {
      setError(e.message);
    }
  }

  async function onUpdate(c: Contact) {
    const newName = prompt("New name:", c.name);
    if (newName == null || !newName.trim()) return;
    try {
      const updated = await updateContactApi(c.id, { name: newName.trim() });
      setContacts((s) => s.map((x) => (x.id === updated.id ? updated : x)));
    } catch (e: any) {
      setError(e.message);
    }
  }

  return (
    <div className="container">
      <div className="header">
        <h1 className="title">Contact Manager</h1>
        <span className="subtitle">Express + TypeScript + React</span>
      </div>

      <div className="card">
        <form className="form" onSubmit={onAdd}>
          <input
            className="input"
            placeholder="Name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="input"
            placeholder="Email *"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="input"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <button className="btn" type="submit">
            Add
          </button>
        </form>

        {error && (
          <div className="badge" role="alert" style={{ marginBottom: 10 }}>
            {error}
          </div>
        )}

        <div className="table-wrap">
          {loading ? (
            <div style={{ padding: 16 }}>Loading…</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((c) => (
                  <tr key={c.id}>
                    <td>{c.name}</td>
                    <td>{c.email}</td>
                    <td>{c.phone ?? "—"}</td>
                    <td style={{ textAlign: "right" }}>
                      <button className="btn-ghost" onClick={() => onUpdate(c)}>
                        Edit
                      </button>{" "}
                      <button
                        className="btn btn-danger"
                        onClick={() => onDelete(c.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {contacts.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} style={{ padding: 16, textAlign: "center", color: "#94a3b8" }}>
                      No contacts yet — add your first one!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        <div className="footer">
          <span>API:</span>
          <code>{(import.meta as any).env?.VITE_API_URL ?? "http://localhost:3000"}</code>
        </div>
      </div>
    </div>
  );
}