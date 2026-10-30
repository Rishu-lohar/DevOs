import "dotenv/config";
import { db } from "../lib/db";


async function main() {
  const user = await db.user.create({
    data: {
      name: "Rishu",
      email: "rishu@DevHub.com",
    },
  });

  console.log("User created:", user);
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());