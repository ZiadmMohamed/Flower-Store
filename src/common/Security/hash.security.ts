import * as bcrypt from 'bcrypt';

export const Hash = (
  plainText: string,
  saltRounds: number = Number(process.env.SALT_ROUNDS as string),
): string => {
  return bcrypt.hashSync(plainText, saltRounds);
};

export const compareHash = (plainText: string, saltRounds: string): boolean => {
  return bcrypt.compareSync(plainText, saltRounds);
};
