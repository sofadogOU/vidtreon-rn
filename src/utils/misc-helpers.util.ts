import faker from 'faker'

export const getEmptyArray = (n: number) =>
  new Array(n).fill(null).map(() => ({
    id: faker.datatype.uuid(),
  }))
