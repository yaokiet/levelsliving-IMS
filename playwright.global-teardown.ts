import { execSync } from 'node:child_process';
import path from 'node:path';

export default async () => {
  const composeFile = path.join('server', 'docker-compose.yml');
  // Stop backend stack (keep volumes; add -v if you want a fresh DB each run)
  execSync(`docker compose -f ${composeFile} down -v`, { stdio: 'inherit' });
};
