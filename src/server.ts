import express from "express";
import cors from "cors";
import { addContact, listContacts, findByEmail, updateContact, removeContact } from "./contacts";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/health", (_req, res) => {
    res.json({ ok: true });
});

app.get("/Contacts", async (_req, res) => {
    try {
        const contacts = await listContacts();
        res.json(contacts);
    } catch (e: any) {
        res.status(500).json({ error: e.message || "Internal Server Error" });
    }
});

app.post("/contacts", async (req, res) => {
    try {
        const { name, email, phone, tags } = req.body || {};

        if (!name || !email) {
            return res.status(400).json({ error: "name and email are required" });
        }
        const created = await addContact({
            name: String(name),
            email: String(email),
            phone: phone ? String(phone) : undefined,
            tags: Array.isArray(tags) ? tags.map(String) : []
        });
        res.status(201).json(created);
    } catch (e: any) {
        res.status(400).json({ error: e.message || "Bad Request" });
    }
});

app.patch("/contacts/:id", async(req, res) =>{
    try{
        const { id } = req.params;
        const patch = req.body;
        const updated = await updateContact(id, patch);
        res.json(updated);
    }catch(e:any){
        res.status(500).json({error:e.message || "Internal Server Error"});
    }
});

type PatchBody = Partial<{ name: string; email: string; phone: string; tags: string[] }>;

async function updateHandler(req: express.Request, res: express.Response) {
  try {
    const { id } = req.params;
    const patch = req.body as PatchBody;
    const updated = await updateContact(id, patch);
    res.json(updated);
  } catch (e: any) {
    res.status(400).json({ error: e.message || "Bad Request" });
  }
}

// هر دو مسیر به یک هندلر وصل می‌شوند
app.patch("/contacts/:id", updateHandler);
app.put("/contacts/:id", updateHandler);

app.delete("/contacts/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await removeContact(id);
      res.json({ ok: true, id });
    } catch (e: any) {
      res.status(400).json({ error: e.message || "Bad Request" });
    }
  });

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

