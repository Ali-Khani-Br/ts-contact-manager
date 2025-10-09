const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export type Contact = {
    id: string;
    name: string;
    email: string;
    phone?: string;
    tags?: string[];
    createdAt: string;
    updatedAt: string;
};

export async function getContacts(): Promise<Contact[]> {
    const res = await fetch(`${BASE}/contacts`);
    if(!res.ok) throw new Error("Failed to fetch contacts");
    return res.json();
}

export async function createContact(input:{
    name:string;
    email: string;
    phone?:string;
}){
    const res = await fetch(`${BASE}/contacts`, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(input),
    });
    if(!res.ok){
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to create");
    }
    return res.json();
}

export async function updateContactApi(id:string, patch:
    Partial<{name:string;email:string;phone:string;tags:string[]}>){
        const res = await fetch(`${BASE}/contacts/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify(patch),
        });
        if(!res.ok){
            const err = await res.json().catch(() =>({}));
            throw new Error(err.error || "Failed to update");
        }
        return res.json();
    }

    export async function deleteContactApi(id: string){
        const res = await fetch(`${BASE}/contacts/${id}`, {
            method: "DELETE",
        });
        if(!res.ok){
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || "Failed to delete");
        }
        return res.json();
    }