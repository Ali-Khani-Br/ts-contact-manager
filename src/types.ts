export type ContactID = string;

export interface Contact {
    id: ContactID;
    name: string;
    email: string;
    phone?: string;
    tags?: string[];
    createdAt: string;
    updatedAt: string;
}

export type ContactCreate = {
    name: string;
    email: string;
    phone?: string;
    tags?: string[];
};

export type ContactUpdate = Partial<Pick<Contact, "name" | "email" | "phone" | "tags">>; 