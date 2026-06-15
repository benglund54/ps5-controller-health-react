import { app } from "./app.js";
import { env } from "./config/env.js";

app.listen(env.port, () => {
  console.log(
    `[middleware] listening on http://localhost:${env.port} (mode=${env.sourceMode})`
  );
});

