import { createClient } from "tinacms/dist/client";
import { queries } from "./types";
export const client = createClient({ url: 'http://localhost:4001/graphql', token: 'd3f6bda9e2511c880decbd81e911c9e0ace04f3b', queries,  });
export default client;
  