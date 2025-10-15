import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data (safe for dev)
  await prisma.song.deleteMany()
  await prisma.artist.deleteMany()
  await prisma.category.deleteMany()

  const yonezu = await prisma.artist.create({ data: { name: '米津玄師' } })
  const utada = await prisma.artist.create({ data: { name: '宇多田ヒカル' } })
  const oneok = await prisma.artist.create({ data: { name: 'ONE OK ROCK' } })

  const pops = await prisma.category.create({ data: { name: 'ポップス' } })
  const rock = await prisma.category.create({ data: { name: 'ロック' } })
  const ballad = await prisma.category.create({ data: { name: 'バラード' } })

  await prisma.song.create({
    data: {
      title: 'Lemon',
      artist: { connect: { id: yonezu.id } },
      originalUrl: 'https://www.youtube.com/watch?v=SX_ViT4Ra7k',
      duration: 243,
      difficulty: '中',
      notes: '定番の実力曲',
      categories: { connect: [{ id: pops.id }, { id: ballad.id }] }
    }
  })

  await prisma.song.create({
    data: {
      title: 'First Love',
      artist: { connect: { id: utada.id } },
      originalUrl: 'https://www.youtube.com/watch?v=9U3H3qfl146',
      duration: 285,
      difficulty: '易',
      notes: '人気のバラード',
      categories: { connect: [{ id: ballad.id }] }
    }
  })

  await prisma.song.create({
    data: {
      title: 'Wherever You Are',
      artist: { connect: { id: oneok.id } },
      originalUrl: 'https://www.youtube.com/watch?v=2d8fO2ZR2xA',
      duration: 230,
      difficulty: '中〜高',
      notes: '盛り上がるロック曲',
      categories: { connect: [{ id: rock.id }] }
    }
  })

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

