import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const TEST_USER = {
  login: 'TEST_LOGIN',
  password: 'TEST_PWD',
};

const TEST_ARTIST = {
  name: 'TEST_ARTIST',
  grammy: true,
};

const TEST_TRACK = {
  name: 'TEST_TRACK',
  duration: 123,
};

const TEST_ALBUM = {
  name: 'TEST_ALBUM',
  year: 1990,
};

async function main() {
  await prisma.album.create({ data: TEST_ALBUM });
  await prisma.artist.create({ data: TEST_ARTIST });
  await prisma.track.create({ data: TEST_TRACK });
  await prisma.user.create({ data: TEST_USER });
}

// main()
//   .catch((e) => {
//     console.error(e), process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
