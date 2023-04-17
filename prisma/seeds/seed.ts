import { Devotional, PrismaClient, Region, Role } from '@prisma/client'

const prisma = new PrismaClient()

async function seedUsers() {
  await prisma.user.createMany({
    skipDuplicates: true,
    data: [
      {
        name: 'John Doe',
        email: 'johndoe@example.com',
        phone: '+1 555-1234',
        password: 'password123',
        birthdate: new Date('1990-01-01'),
        role: Role.ADMIN,
        region: 'FEC',
        active: true,
      },
      {
        name: 'Jane Smith',
        email: 'janesmith@example.com',
        phone: '+1 555-5678',
        password: 'password456',
        birthdate: new Date('1995-06-15'),
        role: Role.USER,
        region: 'AEP',
        active: true,
      },
    ],
  })
}

async function seedDevotionals() {
  const devotionals: Devotional[] = [
    {
      createdAt: new Date('2021-04-18T10:00:00.000Z'),
      scheduledTo: new Date('2023-04-18T10:00:00.000Z'),
      title: 'Title of the first devotional',
      body: 'Body of the first devotional',
      slug: 'title-of-the-first-devotional',
      author: 'Author 1',
      coverImage: 'https://example.com/cover-image-1.png',
      coverThumbnail: 'https://example.com/cover-thumbnail-1.png',
      assetId: 'asset-id-1',
      readingTimeInMinutes: 10,
      region: Region.AEP,
      id: 'uuid-1',
    },
    {
      scheduledTo: new Date('2023-04-19T10:00:00.000Z'),
      title: 'Title of the second devotional',
      body: 'Body of the second devotional',
      slug: 'title-of-the-second-devotional',
      author: 'Author 2',
      coverImage: 'https://example.com/cover-image-2.png',
      coverThumbnail: 'https://example.com/cover-thumbnail-2.png',
      assetId: 'asset-id-2',
      readingTimeInMinutes: 8,
      region: Region.FEC,
      createdAt: new Date('2021-04-18T10:00:00.000Z'),
      id: 'uuid-2',
    },
    // Add more devotionals as needed
  ]

  await prisma.devotional.createMany({ data: devotionals })
}

async function seedNews() {
  const data = [
    {
      title: 'New product launch',
      body: 'We are thrilled to announce the launch of our latest product. Click here to learn more!',
      slug: 'new-product-launch',
      coverImage: 'https://example.com/images/new-product.jpg',
      coverThumbnail: 'https://example.com/images/new-product-thumbnail.jpg',
      assetId: '12345',
      highlightText: 'Introducing our most advanced product yet!',
      region: Region.AEP,
    },
    {
      title: 'Upcoming sale',
      body: 'Get ready for our biggest sale of the year! Starting on Monday, save up to 50% off on all products.',
      slug: 'upcoming-sale',
      coverImage: 'https://example.com/images/sale.jpg',
      coverThumbnail: 'https://example.com/images/sale-thumbnail.jpg',
      assetId: '67890',
      highlightText: "Don't miss out on these amazing deals!",
      region: Region.FEC,
    },
    {
      title: 'New partnership',
      body: 'We are excited to announce our new partnership with XYZ company. Click here to learn more about this exciting collaboration.',
      slug: 'new-partnership',
      coverImage: 'https://example.com/images/partnership.jpg',
      coverThumbnail: 'https://example.com/images/partnership-thumbnail.jpg',
      assetId: '54321',
      highlightText: 'Together, we will revolutionize the industry!',
      region: Region.AEP,
    },
  ]

  await prisma.news.createMany({ data })
}

async function seedGrowthGroups() {
  await prisma.growthGroup.createMany({
    skipDuplicates: true,
    data: [
      {
        name: 'GC H.Yrigoyen',
        lat: -34.60981418092227,
        lng: -58.38508015609746,
        addressInfo: 'Hypolito Yrigoyen 1315 - 10M',
        whatsappLink: 'https://chat.whatsapp.com/K45TkS17LF72vxmLqqYwHn',
        leadership: ['Vinícius', 'Letícia', 'Rayanny'],
        weekDay: 'Terça-feira',
        scheduledTime: '19:30',
      },
      {
        name: 'GC Soler',
        lat: -34.579875071009695,
        lng: -58.43376886846698,
        addressInfo: 'Soler 5717',
        whatsappLink: 'https://chat.whatsapp.com/Je0gAqmaG9D8sbnsh7tKXc',
        leadership: ['Victoria', 'Isly'],
        weekDay: 'Terça-feira',
        scheduledTime: '20:00',
      },
      {
        name: 'GC J. Salguero',
        lat: -34.58064953455574,
        lng: -58.4087016470643,
        addressInfo: 'Jerónimo Salguero 2685',
        whatsappLink: 'https://chat.whatsapp.com/FDBN2JuALNNBEJybSU0Ri6',
        leadership: ['João Mateus', 'Michelle'],
        weekDay: 'Quarta-feira',
        scheduledTime: '19:30',
      },
      {
        name: 'GC Bulnes',
        lat: -34.595068465748334,
        lng: -58.416578525546484,
        addressInfo: 'Bulnes 1437',
        whatsappLink: 'https://chat.whatsapp.com/LRxXVmeJ3lN6mcjUwuzlF0',
        leadership: ['Vitor', 'Daniel'],
        weekDay: 'Quarta-feira',
        scheduledTime: '19:00',
      },
      {
        name: 'GC Congresso',
        lat: -34.60861712409075,
        lng: -58.39062334530023,
        addressInfo: 'Rodriguez Pena 36 - 6B',
        whatsappLink: 'https://chat.whatsapp.com/G0WoXX0xcn36oEuuypkqBT',
        leadership: ['Caio', 'Júlia'],
        weekDay: 'Quarta-feira',
        scheduledTime: '19:00',
      },
      {
        name: 'GC Larrea',
        lat: -34.59947443746407,
        lng: -58.40241869807525,
        addressInfo: 'Larrea 785',
        whatsappLink: 'https://chat.whatsapp.com/JQ7ZdfmSbvE6CfUtGSVLtA',
        leadership: ['Theo', 'Hiure'],
        weekDay: 'Quarta-feira',
        scheduledTime: '19:00',
      },
      {
        name: 'GC Corrientes',
        lat: -34.60441961618236,
        lng: -58.39635054337697,
        addressInfo: 'Av. Corrientes 2075',
        whatsappLink: 'https://chat.whatsapp.com/DNYahaoz37O1I0DSTIfUIp',
        leadership: ['Kadmyell', 'Camilla'],
        weekDay: 'Quarta-feira',
        scheduledTime: '19:00',
      },
      {
        name: 'GC Gallo',
        lat: -34.602065820304794,
        lng: -58.413115707810285,
        addressInfo: 'Gallo 606 - Torre 1, Piso 14, Dpto 6',
        whatsappLink: 'https://chat.whatsapp.com/G7rKDiHbh0O5OqkTUEh8RB',
        leadership: ['Bruno', 'Paula'],
        weekDay: 'Quinta-feira',
        scheduledTime: '19:00',
      },
      {
        name: 'GC Tucumán',
        lat: -34.60172420443972,
        lng: -58.38919895625769,
        addressInfo: 'Tucumán 1581 - Timbre 13',
        whatsappLink: 'https://chat.whatsapp.com/JR6p5WHm0uG3ui7Fqr59iW',
        leadership: ['Victória', 'Ana Flávia'],
        weekDay: 'Quinta-feira',
        scheduledTime: '19:00',
      },
      {
        name: 'GC Lavalle',
        lat: -34.60330598241452,
        lng: -58.39634860143513,
        addressInfo: 'Lavalle 2060',
        whatsappLink: 'https://chat.whatsapp.com/FOaUZoKj8Yu2Y9dyvXyoCY',
        leadership: ['Davi', 'Patrich'],
        weekDay: 'Sexta-feira',
        scheduledTime: '19:00',
      },
      {
        name: 'GC San Luis',
        lat: -34.59987166303368,
        lng: -58.40479372270067,
        addressInfo: 'San Luis 2742 - 3C',
        whatsappLink: 'https://chat.whatsapp.com/Ge55t0Bt4gQDcv45Weyxq1',
        leadership: ['André', 'Brenda'],
        weekDay: 'Sexta-feira',
        scheduledTime: '19:00',
      },
      {
        name: 'GC Córdoba',
        lat: -34.59946966988031,
        lng: -58.38845633169726,
        addressInfo: 'Av. Cordoba 1504 - 8A',
        whatsappLink: 'https://chat.whatsapp.com/KcQuzuBTM2Y67v8CiGHStX',
        leadership: ['Gabriel', 'Jordana'],
        weekDay: 'Sábado',
        scheduledTime: '18:00',
      },
      {
        name: 'GC Discipulado',
        lat: -34.60893836473444,
        lng: -58.380037230798116,
        addressInfo: 'Av. de Mayo 962 - Timbre 1-4',
        whatsappLink: 'https://chat.whatsapp.com/HzammbuqA3bHiiqbIFhlVO',
        leadership: ['André', 'Brenda'],
        weekDay: 'Sábado',
        scheduledTime: '10:00',
      },
    ],
  })
}

async function seedEvents() {
  const data = [
    {
      title: 'Community Service Day',
      description:
        'Join us for a day of giving back to the community! We will be cleaning up local parks and streets, planting trees, and more.',
      coverImage: 'https://example.com/images/community-service-day.jpg',
      coverThumbnail: 'https://example.com/images/community-service-day-thumbnail.jpg',
      assetId: 'c75f1b0f-c84f-413e-bb06-9399ac39c36a',
      maxSlots: 50,
      subscriptionsScheduledTo: new Date('2023-05-10T00:00:00Z'),
      subscriptionsDueDate: new Date('2023-05-07T23:59:59Z'),
      eventDate: new Date('2023-05-13T08:00:00Z'),
      region: Region.AEP,
      EventsSubscriptions: {
        create: [
          {
            userName: 'John Doe',
            userEmail: 'johndoe@example.com',
            userPhone: '+1 555-1234',
          },
          {
            userName: 'Jane Smith',
            userEmail: 'janesmith@example.com',
            userPhone: '+1 555-5678',
          },
        ],
      },
    },
    {
      title: 'Family Movie Night',
      description:
        'Bring the whole family for a night of fun and entertainment! We will be screening the latest blockbuster movies and serving free popcorn and drinks.',
      coverImage: 'https://example.com/images/family-movie-night.jpg',
      coverThumbnail: 'https://example.com/images/family-movie-night-thumbnail.jpg',
      assetId: '11b179fc-08ea-4d9d-a9a2-5c9602e6fc84',
      maxSlots: 100,
      subscriptionsScheduledTo: new Date('2023-05-17T00:00:00Z'),
      subscriptionsDueDate: new Date('2023-05-15T23:59:59Z'),
      eventDate: new Date('2023-05-20T18:00:00Z'),
      region: Region.FEC,
      EventsSubscriptions: {
        create: [
          {
            userName: 'Bob Johnson',
            userEmail: 'bobjohnson@example.com',
            userPhone: '+1 555-9012',
          },
          {
            userName: 'Alice Williams',
            userEmail: 'alicewilliams@example.com',
            userPhone: '+1 555-3456',
          },
          {
            userName: 'Tom Smith',
            userEmail: 'tomsmith@example.com',
            userPhone: '+1 555-7890',
          },
        ],
      },
    },
  ]

  await prisma.events.createMany({ data })
}

async function main() {
  await seedDevotionals()
  await seedUsers()
  await seedNews()
  await seedEvents()
  await seedGrowthGroups()
}

main()
  .catch((e) => {
    console.error(e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
