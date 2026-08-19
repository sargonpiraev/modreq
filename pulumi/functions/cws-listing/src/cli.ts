import { loadCwsListing } from "./load";

loadCwsListing()
  .then((result) => {
    console.log(JSON.stringify(result));
  })
  .catch((err) => {
    console.error(err instanceof Error ? err.message : String(err));
    process.exitCode = 1;
  });
