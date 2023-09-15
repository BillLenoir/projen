import { readFileSync } from 'fs';
import { join as pathJoin, dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
export const typeDefs = readFileSync(pathJoin(__dirname, '..', '..', 'schema.graphql'), 'utf8');