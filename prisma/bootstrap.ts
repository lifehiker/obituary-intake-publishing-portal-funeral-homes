import { seedDemoData } from "./seed-data";

seedDemoData({ reset: false })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
