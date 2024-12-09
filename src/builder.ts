import { DB } from "./manager";

export class QueryBuilder {
  query: string;
  values: any[];
  private conditions: string[];

  constructor() {
    this.query = "";
    this.values = [];
    this.conditions = [];
  }

  select(columns: string[] = ["*"]): QueryBuilder {
    this.query = `SELECT ${columns.join(", ")}`;
    return this;
  }

  delete(table: string): QueryBuilder {
    this.query = `DELETE FROM ${table}`;
    return this;
  }

  build(): string {
    if (this.conditions.length > 0) {
      this.query += ` WHERE ${this.conditions.join(" ")}`;
    }
    return this.query;
  }

  getValues(): any[] {
    return this.values;
  }

  private processCondition(
    field: string,
    value: any
  ): { clause: string; values: any[] } {
    const [column, lookup] = field.split("__");
    let clause = "";
    let values: any[] = [];

    switch (lookup) {
      case "isnull":
        clause = `${column} IS ${value ? "NULL" : "NOT NULL"}`;
        break;
      case "in":
        clause = `${column} IN (${value.map(() => "?").join(", ")})`;
        values = value;
        break;
      case "gte":
        clause = `${column} >= ?`;
        values = [value];
        break;
      case "lte":
        clause = `${column} <= ?`;
        values = [value];
        break;
      case "exact":
        clause = `${column} = ?`;
        values = [value];
        break;
      case "gt":
        clause = `${column} > ?`;
        values = [value];
        break;
      case "lt":
        clause = `${column} < ?`;
        values = [value];
        break;
      case "contains":
        clause = `${column} LIKE ?`;
        values = [`%${value}%`];
        break;
      case "startswith":
        clause = `${column} LIKE ?`;
        values = [`${value}%`];
        break;
      case "endswith":
        clause = `${column} LIKE ?`;
        values = [`%${value}`];
        break;
      default:
        clause = `${column} = ?`;
        values = [value];
    }

    return { clause, values };
  }

  and(field: string, value: any): QueryBuilder {
    return this.addCondition("AND", field, value);
  }

  or(field: string, value: any): QueryBuilder {
    return this.addCondition("OR", field, value);
  }

  private addCondition(
    operator: "AND" | "OR",
    field: string,
    value: any
  ): QueryBuilder {
    const { clause, values } = this.processCondition(field, value);
    if (this.conditions.length) {
      this.conditions.push(`${operator} ${clause}`);
    } else {
      this.conditions.push(clause);
    }
    this.values.push(...values);
    return this;
  }

  executeQuery(): Promise<any> {
    return new Promise((resolve, reject) => {
      const db = DB.getDb();

      db.all(this.query, this.values, (err, rows) => {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      });
    });
  }

  closeConnection(): void {
    DB.closeConnection();
  }
}

class AND {
  constructor(
    public builder: QueryBuilder,
    public field: string,
    public value: any
  ) {}

  and(field: string, value: any): QueryBuilder {
    return this.builder.and(field, value);
  }

  or(field: string, value: any): QueryBuilder {
    return this.builder.or(field, value);
  }
}

class OR {
  constructor(
    public builder: QueryBuilder,
    public field: string,
    public value: any
  ) {}

  and(field: string, value: any): QueryBuilder {
    return this.builder.and(field, value);
  }

  or(field: string, value: any): QueryBuilder {
    return this.builder.or(field, value);
  }
}
