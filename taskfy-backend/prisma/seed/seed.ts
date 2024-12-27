import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const defaultName = 'Admin Admin';
  const defaultUserEmail = 'admin@example.com';
  const defaultUserPassword = 'admin123';

  // Check if the user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: defaultUserEmail },
  });

  if (!existingUser) {
    // Hash the password
    const hashedPassword = await bcrypt.hash(defaultUserPassword, 10);

    // Create the default user
    await prisma.user.create({
      data: {
        name: defaultName,
        email: defaultUserEmail,
        password: hashedPassword,
        role: 'MANAGER',
      },
    });

    console.log('Default user created:', defaultUserEmail);
  } else {
    console.log('Default user already exists:', defaultUserEmail);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
