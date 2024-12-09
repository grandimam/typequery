# typequery

If you like this project, please give it a ⭐️ to show your support and help others find it! 🙌

A powerful and flexible SQL query builder library built with TypeScript, designed to help developers construct and manage SQL queries programmatically. This library provides an intuitive and chainable API for creating complex SQL queries while maintaining type safety, reducing the risk of SQL injection, and improving code readability.

### Features:

- **Type-safe API:** Leverages TypeScript's type system to ensure the correctness of queries.
- **Support for Common SQL Operations:** Supports SELECT, INSERT, UPDATE, and DELETE queries.
- **Flexible WHERE Clauses:** Easily add dynamic WHERE conditions using a Django-like approach (e.g., field**isnull, field**gte, etc.).
- **SQL Parameterization:** Avoid SQL injection risks with automatic parameterized queries.
- **SQL Dialect Support:** Built to support SQL databases like MySQL, PostgreSQL, and SQLite.
- **Easy to Extend:** Customize and extend the builder to support any additional SQL features you may need.

### Usage Example:

```typescript
import { QueryBuilder } from "./QueryBuilder";
import { DB } from "./manager";

DB.createConnection("db.sqlite");

const qb = new QueryBuilder();

// Example 1: Using AND & OR conditions

const query1 = qb
  .select("users")
  .where("name__exact", "Alice")
  .and("age__gte", 25)
  .and("email__isnull", true)
  .build();

console.log(query1); // "SELECT * FROM users WHERE name = ? AND age >= ? AND email IS NULL"
console.log(qb.executeQuery());

// Example 2: Mixed AND/OR with a custom condition
const query2 = qb
  .select("users")
  .where("age__gte", 25)
  .or("age__lte", 30)
  .and("name__contains", "John")
  .build();

console.log(query2); // "SELECT * FROM users WHERE age >= ? OR age <= ? AND name LIKE ?"
console.log(qb.executeQuery());

// Example 3: Building queries with chaining logic via the AND/OR classes
const query3 = new AND(qb, "name__exact", "Alice")
  .and("age__gte", 25)
  .or("email__isnull", true)
  .build();

console.log(query3); // "SELECT * FROM users WHERE name = ? AND age >= ? OR email IS NULL"
console.log(qb.executeQuery());
```

### Contributing

Feel free to open issues or pull requests! We welcome contributions to make the query builder more powerful and feature-rich.
