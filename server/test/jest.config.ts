import { resolve } from 'node:path';
import { Config } from 'jest';
import rootConfig from '../jest.config';

const root = resolve(__dirname, '..');

const config: Config = {
  ...rootConfig,
  ...{
    testMatch: ['<rootDir>/test/**/*.spec.ts'],
    rootDir: root,
    displayName: 'end2end-test',
    setupFilesAfterEnv: ['<rootDir>/test/jest_setup.ts'],
  },
};

export default config;
