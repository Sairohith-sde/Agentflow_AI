const jobs = [];
let working = false;

async function drain() {
  if (working) return;
  working = true;

  while (jobs.length) {
    const job = jobs.shift();
    try {
      await job.handler();
    } catch (error) {
      console.error(`In-memory job failed: ${error.message}`);
    }
  }

  working = false;
}

export function enqueueInMemory(handler) {
  jobs.push({ handler });
  setTimeout(drain, 0);
}
