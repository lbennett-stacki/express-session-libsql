# express-session-libsql

LibSQL session store for express-session

## Development

```bash
npm run build
npm run dev
```

## Usage

```typescript
import * as session from "express-session";
import { LibSqlSessionStore } from "express-session-libsql";

const clientOptions = {
  url: "libsql://localhost:5432",
  authToken: "my-secret-token",
};

const store = new LibSqlSessionStore(clientOptions);

session({
  secret: ["secret", "previous_secret"],
  store,
  resave: false,
  saveUninitialized: false,
});
```

Alternatively, you can pass in an existing client instance

```typescript
import { createClient } from "@libsql/client";
import { LibSqlSessionStore } from "express-session-libsql";

const clientOptions = {
  url: "libsql://localhost:5432",
  authToken: "my-secret-token",
};

const client = createClient(clientOptions);

const store = new LibSqlSessionStore({ client });
```
