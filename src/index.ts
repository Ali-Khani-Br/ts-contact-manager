import { addContact, listContacts, updateContact, removeContact, findByEmail } from "./contacts";


type Args = Record<string, string | boolean | undefined>;

function parseArgs(argv: string[]): { cmd: string; args: Args } {
  const [, , cmd = "", ...rest] = argv; // دو تای اول node و مسیر فایل هستن
  const args: Args = {};

  // rest مثل ["--name","Ali","--email","a@b.com","--phone","123"]
  for (let i = 0; i < rest.length; i++) {
    const token = rest[i];
    if (token.startsWith("--")) {
      const key = token.slice(2); // "--name" -> "name"
      const next = rest[i + 1];
      if (next && !next.startsWith("--")) {
        args[key] = next;
        i++; // یه خونه اضافه جلو می‌ریم چون مقدار رو هم خوردیم
      } else {
        args[key] = true; // فلگ بدون مقدار (مثلا --verbose)
      }
    }
  }
  return { cmd, args };
}

async function main() {
    const { cmd, args } = parseArgs(process.argv);
  
    try {
      switch (cmd) {
        case "add": {
          // ورودی‌های ضروری
          const name = String(args.name ?? "").trim();
          const email = String(args.email ?? "").trim();
          const phone = args.phone ? String(args.phone) : undefined;
  
          if (!name || !email) {
            throw new Error('Usage: npm run dev -- add --name "Ali" --email "ali@mail.com" [--phone "123"]');
          }
  
          const c = await addContact({ name, email, phone, tags: [] });
          console.log("✅ Added:", c);
          break;
        }
  
        case "list": {
          const all = await listContacts();
          // فقط فیلدهای مهم رو جدول کنیم
          console.table(all.map(({ id, name, email, phone, updatedAt }) => ({ id, name, email, phone, updatedAt })));
          break;
        }
  
        case "update": {
          // ایده: راحت‌ترین راه یافتن مخاطب، ایمیل فعلیشه
          const email = String(args.email ?? "").trim(); // ایمیلی که الان ثبت شده
          if (!email) throw new Error('Usage: npm run dev -- update --email "current@mail.com" [--name "New"] [--phone "999"] [--newemail "new@mail.com"]');
  
          const target = await findByEmail(email);
          if (!target) throw new Error("contact not found by email");
  
          // پَچِ اختیاری‌ها
          const patch = {
            name: args.name ? String(args.name) : undefined,
            email: args.newemail ? String(args.newemail) : undefined, // اجازه می‌دیم ایمیل عوض شه
            phone: args.phone ? String(args.phone) : undefined,
          };
  
          const updated = await updateContact(target.id, patch);
          console.log("Updated:", updated);
          break;
        }
  
        case "remove": {
          const email = String(args.email ?? "").trim();
          if (!email) throw new Error('Usage: npm run dev -- remove --email "someone@mail.com"');
  
          const target = await findByEmail(email);
          if (!target) throw new Error("contact not found");
          await removeContact(target.id);
          console.log("🗑️ Removed:", target.email);
          break;
        }
  
        default: {
          console.log(`Usage:
    npm run dev -- add --name "Ali" --email "ali@mail.com" [--phone "123"]
    npm run dev -- list
    npm run dev -- update --email "ali@mail.com" [--name "Ali Reza"] [--phone "999"] [--newemail "ali2@mail.com"]
    npm run dev -- remove --email "ali@mail.com"`);
        }
      }
    } catch (e: any) {
      console.error("Error:", e.message);
      process.exit(1);
    }
  }
  
  main();