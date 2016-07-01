import test from 'ava';
import { execFileSync } from 'child_process';

test('cli', t => {
  const result = execFileSync('../cli.js', [__dirname + '/fixtures/list-1.txt']);
  t.regex(result.toString(), /1 cards have been processed/g);
});
