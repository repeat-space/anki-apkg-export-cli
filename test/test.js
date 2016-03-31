import test from 'ava';
import { execFileSync } from 'child_process';

test('cli', t => {
  const result = execFileSync('../cli.js', ['test-deck', __dirname + '/fixtures/*.txt', ' - ']);
  t.regex(result.toString(), /2 words were processed/g);
});
