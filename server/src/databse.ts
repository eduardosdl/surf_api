import config, { IConfig } from 'config';
import mongoose from 'mongoose';

const dbConfig: IConfig = config.get('App.database');

export const connect = async (): Promise<void> => {
  mongoose.set('strictQuery', true);
  await mongoose.connect(dbConfig.get('mongoUrl'));
};

export const close = (): Promise<void> => mongoose.connection.close();
