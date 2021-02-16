/* eslint-disable linebreak-style */

module.exports = {
  up: queryInterface =>
    queryInterface.bulkInsert('Types', [
      {
        id: 1,
        name: `SUV`,
        status: 'true',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        name: `MPV`,
        status: 'true',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        name: `Sedan`,
        status: 'true',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        name: `LCGG`,
        status: 'true',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 5,
        name: `City Car`,
        status: 'true',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 6,
        name: `Coupe`,
        status: 'true',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 7,
        name: `Hatchback`,
        status: 'true',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 8,
        name: `Sports`,
        status: 'true',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 9,
        name: `Jeep`,
        status: 'true',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 10,
        name: `Mobil Listrik`,
        status: 'true',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]),

  down: queryInterface => queryInterface.bulkDelete('Types', null, {})
};
