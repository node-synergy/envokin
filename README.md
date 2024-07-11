# Envokin
- Envokin is a powerful and intuitive environment variable validation library for Node.js applications.
- Designed to ensure the integrity and correctness of your environment configurations, Envokin simplifies the process of validating environment variables, making your application more robust and secure.

# Usage

### Base syntax
`const envokin = new Envokin(schema, options) `
- `schema`- An object that specifies the format of required vars
- `options` - An (optional) object, which supports the following keys:
    - `source` - Can be an object or path to file (`.json`, `.env`).
    - `strict` - Boolean value, default is `false`

> If the `source` key is not provided in the `options`, `Envokin` will use the variables from `process.env` for validation.
> If the `strict` flag is set to `true` in the `options`, a `ValidationError` will be thrown if a value for a key from the schema is not provided in the environment variables.

### Basic Usage

 ```ts
import { Envokin } from 'envokin'

const envokin = new Envokin({
  HOST: 'host',
  PORT: 'port',
  URL: 'url',
  EMAIL: 'email',
  IP: 'ip',
  IP4: 'ip4',
  IP6: 'ip6',
  STRING: 'string',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
  JSON: 'json',
  CUSTOM_VALUE: {
      validator: (_: string, value: unknown): boolean => typeof value === 'string',
      transformer: (value: unknown): string => String(value).toUpperCase()
    }
});

envokin.get('EMAIL'); // -> A string value containing a valid email
envokin.get('PORT'); // -> A number value containing a valid port
envokin.isDev; // true if NODE_ENV === 'dev' | 'develop' | 'development'
envokin.isTest; // true if NODE_ENV === 'test' | 't'
envokin.isProduction; // true if NODE_ENV == 'production' | 'prod'
...
