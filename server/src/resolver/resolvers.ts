export const resolvers = {
  Query: {
    sayHello: (_: any, arg: { name: string }) => `Hello ${arg.name}!`
  }
};
