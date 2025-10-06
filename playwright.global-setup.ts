import { execSync } from 'node:child_process';
import waitOn from 'wait-on';
import path from 'node:path';

export default async () => {
  const composeFile = path.join('server', 'docker-compose.yml');

  // Bring up backend stack
  execSync(`docker compose -f ${composeFile} up -d --build`, { stdio: 'inherit' });

  // Wait until FastAPI is listening on 8000 (no /health required)
  await waitOn({
    resources: ['tcp:localhost:8000'],
    timeout: 120_000,
  });
};
