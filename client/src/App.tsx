import { useEffect, useState } from "react";
import { getContacts, createContact, deleteContactApi, updateContactApi, type Contact } from "./api";
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
      setError(e.message);
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
      setError("Name and email required");
      return;
    }
    try {
      setError(null);
      const created = await createContact({ name, email, phone: phone || undefined });
      setContacts((s) => [created, ...s]);
      setName(""); setEmail(""); setPhone("");
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
    if (newName == null) return;
    try {
      const updated = await updateContactApi(c.id, { name: newName });
      setContacts((s) => s.map((x) => (x.id === updated.id ? updated : x)));
    } catch (e: any) {
      setError(e.message);
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: "24px auto", fontFamily: "system-ui, sans-serif" }}>
      <h1>Contact Manager (React)</h1>

      <form onSubmit={onAdd} style={{ marginBottom: 16 }}>
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <button type="submit">Add</button>
      </form>

      {error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}

      {loading ? (
        <div>Loading…</div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left" }}>Name</th>
              <th style={{ textAlign: "left" }}>Email</th>
              <th style={{ textAlign: "left" }}>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.email}</td>
                <td>{c.phone ?? "—"}</td>
                <td>
                  <button onClick={() => onUpdate(c)}>Edit</button>{" "}
                  <button onClick={() => onDelete(c.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}