'use strict'
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value)
          })
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value))
        } catch (e) {
          reject(e)
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value))
        } catch (e) {
          reject(e)
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected)
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next())
    })
  }
Object.defineProperty(exports, '__esModule', { value: true })
const client_1 = require('@prisma/client')
const prisma = new client_1.PrismaClient()
function main() {
  return __awaiter(this, void 0, void 0, function* () {
    yield prisma.growthGroup.createMany({
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
  })
}
main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() =>
    __awaiter(void 0, void 0, void 0, function* () {
      yield prisma.$disconnect()
    }),
  )
