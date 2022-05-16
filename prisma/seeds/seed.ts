import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.growthGroup.createMany({
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

  await prisma.devotional.createMany({
    data: [
      {
        author: 'João Galli',
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam tortor erat, hendrerit id augue ut, mattis posuere metus. Curabitur in turpis interdum, dignissim sapien et, varius dolor. Phasellus in dolor vitae ante dictum volutpat non ultrices eros. Cras lacinia gravida tellus sit amet posuere. Etiam non molestie dolor. Etiam ac blandit mi, a lacinia mauris. Aliquam id dignissim justo, et sollicitudin elit. Sed vel viverra turpis, non posuere tellus. Suspendisse bibendum nisi neque, vel faucibus dolor sodales a. Duis finibus augue in sapien vehicula, eu facilisis erat aliquet. Mauris tincidunt magna a enim luctus ullamcorper. Donec imperdiet enim mauris, sit amet fringilla neque aliquet quis. Nulla sit amet quam quis nulla scelerisque varius. Mauris vel erat urna. Integer congue ultricies nisl. Vivamus ullamcorper lacus magna, efficitur facilisis tortor rutrum in. Cras ultrices turpis ullamcorper lectus commodo aliquet. Curabitur imperdiet sit amet nunc et pulvinar. Phasellus ut lectus sollicitudin, luctus augue congue, imperdiet ex. Praesent vulputate, metus at congue suscipit, ante sem commodo libero, et fringilla mi est vitae tortor. Duis porttitor sollicitudin turpis id scelerisque. Duis dignissim condimentum porttitor. Aenean malesuada justo porttitor massa pellentesque, ut feugiat justo suscipit. Etiam quam tellus, interdum id lorem eget, consequat egestas dolor. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Maecenas ut libero in felis tempor auctor quis nec nisl. Nullam vehicula lacus quis ante sodales, at lacinia neque varius. Nam in pulvinar nisi. Vestibulum eu est dapibus, feugiat justo sit amet, aliquet lorem. Ut eget nisi id massa consectetur commodo. Donec lacinia dictum est, a mattis massa dignissim malesuada. Etiam augue ligula, pretium id suscipit sit amet, facilisis non est. Fusce commodo tortor nec neque ornare, in pharetra libero blandit. Quisque nec velit nec est vehicula rutrum. Praesent faucibus tristique odio, vel mattis lorem pretium sit amet. Duis pellentesque urna eu aliquam dapibus. Nunc elit nisl, lobortis a massa id, rutrum vehicula eros. Donec a dolor ac ligula laoreet hendrerit id eu mauris. Integer vulputate, massa vel pharetra pulvinar, ligula ante rhoncus ipsum, in viverra dolor massa vitae ante. Mauris volutpat consectetur nisi, sit amet vehicula nunc aliquam non. Sed mauris quam, bibendum aliquam venenatis non, ullamcorper eu massa. Donec commodo faucibus vulputate. Praesent quis tristique nunc, sit amet molestie diam. Etiam non justo ac felis vestibulum porttitor at vitae nisi. Quisque posuere felis eros, sed accumsan nulla lacinia at. Praesent pretium ipsum turpis, eu varius ante lobortis id. Pellentesque pellentesque quam ac est fermentum, eu interdum dolor pellentesque. Vivamus sagittis auctor mi eu tincidunt. Praesent a sem orci. In convallis laoreet elementum. Pellentesque lorem mi, varius non luctus eu, dapibus a ex. In non tortor vel turpis aliquam pulvinar. Sed cursus condimentum quam. Pellentesque vehicula mattis tortor, eget volutpat ex luctus non. In ultricies sed velit eu euismod. Duis iaculis lorem eu turpis convallis finibus. Sed dictum varius molestie. Quisque blandit quis sem lacinia facilisis. Ut tellus velit, fringilla ut malesuada eu, bibendum in dui. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac.',
        title: 'Dias corridos',
      },
      {
        author: 'Brenda Melo',
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam tortor erat, hendrerit id augue ut, mattis posuere metus. Curabitur in turpis interdum, dignissim sapien et, varius dolor. Phasellus in dolor vitae ante dictum volutpat non ultrices eros. Cras lacinia gravida tellus sit amet posuere. Etiam non molestie dolor. Etiam ac blandit mi, a lacinia mauris. Aliquam id dignissim justo, et sollicitudin elit. Sed vel viverra turpis, non posuere tellus. Suspendisse bibendum nisi neque, vel faucibus dolor sodales a. Duis finibus augue in sapien vehicula, eu facilisis erat aliquet. Mauris tincidunt magna a enim luctus ullamcorper. Donec imperdiet enim mauris, sit amet fringilla neque aliquet quis. Nulla sit amet quam quis nulla scelerisque varius. Mauris vel erat urna. Integer congue ultricies nisl. Vivamus ullamcorper lacus magna, efficitur facilisis tortor rutrum in. Cras ultrices turpis ullamcorper lectus commodo aliquet. Curabitur imperdiet sit amet nunc et pulvinar. Phasellus ut lectus sollicitudin, luctus augue congue, imperdiet ex. Praesent vulputate, metus at congue suscipit, ante sem commodo libero, et fringilla mi est vitae tortor. Duis porttitor sollicitudin turpis id scelerisque. Duis dignissim condimentum porttitor. Aenean malesuada justo porttitor massa pellentesque, ut feugiat justo suscipit. Etiam quam tellus, interdum id lorem eget, consequat egestas dolor. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Maecenas ut libero in felis tempor auctor quis nec nisl. Nullam vehicula lacus quis ante sodales, at lacinia neque varius. Nam in pulvinar nisi. Vestibulum eu est dapibus, feugiat justo sit amet, aliquet lorem. Ut eget nisi id massa consectetur commodo. Donec lacinia dictum est, a mattis massa dignissim malesuada. Etiam augue ligula, pretium id suscipit sit amet, facilisis non est. Fusce commodo tortor nec neque ornare, in pharetra libero blandit. Quisque nec velit nec est vehicula rutrum. Praesent faucibus tristique odio, vel mattis lorem pretium sit amet. Duis pellentesque urna eu aliquam dapibus. Nunc elit nisl, lobortis a massa id, rutrum vehicula eros. Donec a dolor ac ligula laoreet hendrerit id eu mauris. Integer vulputate, massa vel pharetra pulvinar, ligula ante rhoncus ipsum, in viverra dolor massa vitae ante. Mauris volutpat consectetur nisi, sit amet vehicula nunc aliquam non. Sed mauris quam, bibendum aliquam venenatis non, ullamcorper eu massa. Donec commodo faucibus vulputate. Praesent quis tristique nunc, sit amet molestie diam. Etiam non justo ac felis vestibulum porttitor at vitae nisi. Quisque posuere felis eros, sed accumsan nulla lacinia at. Praesent pretium ipsum turpis, eu varius ante lobortis id. Pellentesque pellentesque quam ac est fermentum, eu interdum dolor pellentesque. Vivamus sagittis auctor mi eu tincidunt. Praesent a sem orci. In convallis laoreet elementum. Pellentesque lorem mi, varius non luctus eu, dapibus a ex. In non tortor vel turpis aliquam pulvinar. Sed cursus condimentum quam. Pellentesque vehicula mattis tortor, eget volutpat ex luctus non. In ultricies sed velit eu euismod. Duis iaculis lorem eu turpis convallis finibus. Sed dictum varius molestie. Quisque blandit quis sem lacinia facilisis. Ut tellus velit, fringilla ut malesuada eu, bibendum in dui. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac.',
        title: 'Dias corridos',
      },
      {
        author: 'Victória Gesteira',
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam tortor erat, hendrerit id augue ut, mattis posuere metus. Curabitur in turpis interdum, dignissim sapien et, varius dolor. Phasellus in dolor vitae ante dictum volutpat non ultrices eros. Cras lacinia gravida tellus sit amet posuere. Etiam non molestie dolor. Etiam ac blandit mi, a lacinia mauris. Aliquam id dignissim justo, et sollicitudin elit. Sed vel viverra turpis, non posuere tellus. Suspendisse bibendum nisi neque, vel faucibus dolor sodales a. Duis finibus augue in sapien vehicula, eu facilisis erat aliquet. Mauris tincidunt magna a enim luctus ullamcorper. Donec imperdiet enim mauris, sit amet fringilla neque aliquet quis. Nulla sit amet quam quis nulla scelerisque varius. Mauris vel erat urna. Integer congue ultricies nisl. Vivamus ullamcorper lacus magna, efficitur facilisis tortor rutrum in. Cras ultrices turpis ullamcorper lectus commodo aliquet. Curabitur imperdiet sit amet nunc et pulvinar. Phasellus ut lectus sollicitudin, luctus augue congue, imperdiet ex. Praesent vulputate, metus at congue suscipit, ante sem commodo libero, et fringilla mi est vitae tortor. Duis porttitor sollicitudin turpis id scelerisque. Duis dignissim condimentum porttitor. Aenean malesuada justo porttitor massa pellentesque, ut feugiat justo suscipit. Etiam quam tellus, interdum id lorem eget, consequat egestas dolor. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Maecenas ut libero in felis tempor auctor quis nec nisl. Nullam vehicula lacus quis ante sodales, at lacinia neque varius. Nam in pulvinar nisi. Vestibulum eu est dapibus, feugiat justo sit amet, aliquet lorem. Ut eget nisi id massa consectetur commodo. Donec lacinia dictum est, a mattis massa dignissim malesuada. Etiam augue ligula, pretium id suscipit sit amet, facilisis non est. Fusce commodo tortor nec neque ornare, in pharetra libero blandit. Quisque nec velit nec est vehicula rutrum. Praesent faucibus tristique odio, vel mattis lorem pretium sit amet. Duis pellentesque urna eu aliquam dapibus. Nunc elit nisl, lobortis a massa id, rutrum vehicula eros. Donec a dolor ac ligula laoreet hendrerit id eu mauris. Integer vulputate, massa vel pharetra pulvinar, ligula ante rhoncus ipsum, in viverra dolor massa vitae ante. Mauris volutpat consectetur nisi, sit amet vehicula nunc aliquam non. Sed mauris quam, bibendum aliquam venenatis non, ullamcorper eu massa. Donec commodo faucibus vulputate. Praesent quis tristique nunc, sit amet molestie diam. Etiam non justo ac felis vestibulum porttitor at vitae nisi. Quisque posuere felis eros, sed accumsan nulla lacinia at. Praesent pretium ipsum turpis, eu varius ante lobortis id. Pellentesque pellentesque quam ac est fermentum, eu interdum dolor pellentesque. Vivamus sagittis auctor mi eu tincidunt. Praesent a sem orci. In convallis laoreet elementum. Pellentesque lorem mi, varius non luctus eu, dapibus a ex. In non tortor vel turpis aliquam pulvinar. Sed cursus condimentum quam. Pellentesque vehicula mattis tortor, eget volutpat ex luctus non. In ultricies sed velit eu euismod. Duis iaculis lorem eu turpis convallis finibus. Sed dictum varius molestie. Quisque blandit quis sem lacinia facilisis. Ut tellus velit, fringilla ut malesuada eu, bibendum in dui. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac.',
        title: 'Dias corridos',
      },
      {
        author: 'Paula Eduarda',
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam tortor erat, hendrerit id augue ut, mattis posuere metus. Curabitur in turpis interdum, dignissim sapien et, varius dolor. Phasellus in dolor vitae ante dictum volutpat non ultrices eros. Cras lacinia gravida tellus sit amet posuere. Etiam non molestie dolor. Etiam ac blandit mi, a lacinia mauris. Aliquam id dignissim justo, et sollicitudin elit. Sed vel viverra turpis, non posuere tellus. Suspendisse bibendum nisi neque, vel faucibus dolor sodales a. Duis finibus augue in sapien vehicula, eu facilisis erat aliquet. Mauris tincidunt magna a enim luctus ullamcorper. Donec imperdiet enim mauris, sit amet fringilla neque aliquet quis. Nulla sit amet quam quis nulla scelerisque varius. Mauris vel erat urna. Integer congue ultricies nisl. Vivamus ullamcorper lacus magna, efficitur facilisis tortor rutrum in. Cras ultrices turpis ullamcorper lectus commodo aliquet. Curabitur imperdiet sit amet nunc et pulvinar. Phasellus ut lectus sollicitudin, luctus augue congue, imperdiet ex. Praesent vulputate, metus at congue suscipit, ante sem commodo libero, et fringilla mi est vitae tortor. Duis porttitor sollicitudin turpis id scelerisque. Duis dignissim condimentum porttitor. Aenean malesuada justo porttitor massa pellentesque, ut feugiat justo suscipit. Etiam quam tellus, interdum id lorem eget, consequat egestas dolor. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Maecenas ut libero in felis tempor auctor quis nec nisl. Nullam vehicula lacus quis ante sodales, at lacinia neque varius. Nam in pulvinar nisi. Vestibulum eu est dapibus, feugiat justo sit amet, aliquet lorem. Ut eget nisi id massa consectetur commodo. Donec lacinia dictum est, a mattis massa dignissim malesuada. Etiam augue ligula, pretium id suscipit sit amet, facilisis non est. Fusce commodo tortor nec neque ornare, in pharetra libero blandit. Quisque nec velit nec est vehicula rutrum. Praesent faucibus tristique odio, vel mattis lorem pretium sit amet. Duis pellentesque urna eu aliquam dapibus. Nunc elit nisl, lobortis a massa id, rutrum vehicula eros. Donec a dolor ac ligula laoreet hendrerit id eu mauris. Integer vulputate, massa vel pharetra pulvinar, ligula ante rhoncus ipsum, in viverra dolor massa vitae ante. Mauris volutpat consectetur nisi, sit amet vehicula nunc aliquam non. Sed mauris quam, bibendum aliquam venenatis non, ullamcorper eu massa. Donec commodo faucibus vulputate. Praesent quis tristique nunc, sit amet molestie diam. Etiam non justo ac felis vestibulum porttitor at vitae nisi. Quisque posuere felis eros, sed accumsan nulla lacinia at. Praesent pretium ipsum turpis, eu varius ante lobortis id. Pellentesque pellentesque quam ac est fermentum, eu interdum dolor pellentesque. Vivamus sagittis auctor mi eu tincidunt. Praesent a sem orci. In convallis laoreet elementum. Pellentesque lorem mi, varius non luctus eu, dapibus a ex. In non tortor vel turpis aliquam pulvinar. Sed cursus condimentum quam. Pellentesque vehicula mattis tortor, eget volutpat ex luctus non. In ultricies sed velit eu euismod. Duis iaculis lorem eu turpis convallis finibus. Sed dictum varius molestie. Quisque blandit quis sem lacinia facilisis. Ut tellus velit, fringilla ut malesuada eu, bibendum in dui. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac.',
        title: 'Dias corridos',
      },
      {
        author: 'Kézia Araújo',
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam tortor erat, hendrerit id augue ut, mattis posuere metus. Curabitur in turpis interdum, dignissim sapien et, varius dolor. Phasellus in dolor vitae ante dictum volutpat non ultrices eros. Cras lacinia gravida tellus sit amet posuere. Etiam non molestie dolor. Etiam ac blandit mi, a lacinia mauris. Aliquam id dignissim justo, et sollicitudin elit. Sed vel viverra turpis, non posuere tellus. Suspendisse bibendum nisi neque, vel faucibus dolor sodales a. Duis finibus augue in sapien vehicula, eu facilisis erat aliquet. Mauris tincidunt magna a enim luctus ullamcorper. Donec imperdiet enim mauris, sit amet fringilla neque aliquet quis. Nulla sit amet quam quis nulla scelerisque varius. Mauris vel erat urna. Integer congue ultricies nisl. Vivamus ullamcorper lacus magna, efficitur facilisis tortor rutrum in. Cras ultrices turpis ullamcorper lectus commodo aliquet. Curabitur imperdiet sit amet nunc et pulvinar. Phasellus ut lectus sollicitudin, luctus augue congue, imperdiet ex. Praesent vulputate, metus at congue suscipit, ante sem commodo libero, et fringilla mi est vitae tortor. Duis porttitor sollicitudin turpis id scelerisque. Duis dignissim condimentum porttitor. Aenean malesuada justo porttitor massa pellentesque, ut feugiat justo suscipit. Etiam quam tellus, interdum id lorem eget, consequat egestas dolor. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Maecenas ut libero in felis tempor auctor quis nec nisl. Nullam vehicula lacus quis ante sodales, at lacinia neque varius. Nam in pulvinar nisi. Vestibulum eu est dapibus, feugiat justo sit amet, aliquet lorem. Ut eget nisi id massa consectetur commodo. Donec lacinia dictum est, a mattis massa dignissim malesuada. Etiam augue ligula, pretium id suscipit sit amet, facilisis non est. Fusce commodo tortor nec neque ornare, in pharetra libero blandit. Quisque nec velit nec est vehicula rutrum. Praesent faucibus tristique odio, vel mattis lorem pretium sit amet. Duis pellentesque urna eu aliquam dapibus. Nunc elit nisl, lobortis a massa id, rutrum vehicula eros. Donec a dolor ac ligula laoreet hendrerit id eu mauris. Integer vulputate, massa vel pharetra pulvinar, ligula ante rhoncus ipsum, in viverra dolor massa vitae ante. Mauris volutpat consectetur nisi, sit amet vehicula nunc aliquam non. Sed mauris quam, bibendum aliquam venenatis non, ullamcorper eu massa. Donec commodo faucibus vulputate. Praesent quis tristique nunc, sit amet molestie diam. Etiam non justo ac felis vestibulum porttitor at vitae nisi. Quisque posuere felis eros, sed accumsan nulla lacinia at. Praesent pretium ipsum turpis, eu varius ante lobortis id. Pellentesque pellentesque quam ac est fermentum, eu interdum dolor pellentesque. Vivamus sagittis auctor mi eu tincidunt. Praesent a sem orci. In convallis laoreet elementum. Pellentesque lorem mi, varius non luctus eu, dapibus a ex. In non tortor vel turpis aliquam pulvinar. Sed cursus condimentum quam. Pellentesque vehicula mattis tortor, eget volutpat ex luctus non. In ultricies sed velit eu euismod. Duis iaculis lorem eu turpis convallis finibus. Sed dictum varius molestie. Quisque blandit quis sem lacinia facilisis. Ut tellus velit, fringilla ut malesuada eu, bibendum in dui. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac.',
        title: 'Dias corridos',
      }
    ]
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
