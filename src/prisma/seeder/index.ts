import { PrismaClient } from "@prisma/client";
import Authentication from "../../helper/classes/authentication";
import hashPassword from "../../helper/functions/hashPassword";
const prisma = new PrismaClient();
const authentication = new Authentication(prisma.admin);

async function main() {
  await authentication.signUp(
    "admin",
    "admin@swathanthra.app",
    "admin@123",
    "SUPER_ADMIN"
  );

  const mesm = await prisma.institutions.create({
    data: {
      name: "MES MARAMPALLY COLLEGE",
      location: "MARAMPALLY, ALUVA, ERNAKULAM",
    },
  });

  await prisma.department.create({
    data: {
      name: "BCA",
      institution_id: mesm.id,
    },
  });

  // create an institution admin
  await prisma.admin.create({
    data: {
      name: "admin",
      email: "admin@mesm.com",
      password: await hashPassword("admin@123"),
      role: "INSTITUTION_ADMIN",
      institution_id: mesm.id,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
