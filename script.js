// createAdmin.js
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs")

const prisma = new PrismaClient();

async function main() {
  const username = "Piero";
  const email = "admin@example.com";
  const password = "picantito12"; // cámbialo manualmente después
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingAdmin = await prisma.usuarios.findUnique({
    where: { username },
  });

  if (!existingAdmin) {
    await prisma.usuarios.create({
      data: {
        username,
        email,
        password: hashedPassword,
        rol: "Admin",
        estado: "Activado",
        nivel_acceso: "superadmin",
      },
    });
    console.log("✅ Usuario Admin creado");
  } else {
    console.log("ℹ️ Ya existe un usuario Admin, no se creó otro.");
  }
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
