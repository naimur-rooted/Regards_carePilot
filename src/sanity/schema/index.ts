import { article } from './article';
import { branch } from './branch';
import { diagnosticTest } from './diagnostic-test';
import { doctor } from './doctor';
import { localeString, localeText } from './locale';
import { notice } from './notice';
import { specialty } from './specialty';

/**
 * All document and object types available in the CarePilot Sanity Studio.
 * `localeString` / `localeText` are shared object types used by every
 * bilingual content model.
 */
export const schemaTypes = [
  localeString,
  localeText,
  specialty,
  branch,
  doctor,
  diagnosticTest,
  article,
  notice,
];
