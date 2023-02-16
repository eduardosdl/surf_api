import * as path from 'path';
import moduleAlias from 'module-alias';

const file = path.resolve(__dirname, '../..');

moduleAlias.addAliases({
  '@src': path.join(file, 'src'),
  '@test': path.join(file, 'test'),
});
