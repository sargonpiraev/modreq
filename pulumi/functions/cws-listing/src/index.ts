import type { Request, Response } from "./http-types";
import { loadCwsListing } from "./load";

/** Cloud Functions Gen1 HTTP entrypoint — listing snapshot only. */
export async function loadCwsListingHttp(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    if (req.method !== "POST" && req.method !== "GET") {
      res.status(405).json({ error: "method not allowed" });
      return;
    }
    const result = await loadCwsListing();
    res.status(200).json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("cws listing ETL failed:", message);
    res.status(500).json({ error: message });
  }
}
