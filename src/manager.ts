import sqlite3 from "sqlite3";

export class DB {
  private static db: sqlite3.Database;

  static createConnection(dbFilePath: string): void {
    this.db = new sqlite3.Database(dbFilePath, (err) => {
      if (err) {
        console.error("Error opening SQLite database:", err.message);
      } else {
        console.log("Connected to the SQLite database.");
      }
    });
  }

  static getDb(): sqlite3.Database {
    return this.db;
  }

  static closeConnection(): void {
    if (this.db) {
      this.db.close((err) => {
        if (err) {
          console.error("Error closing the SQLite database:", err.message);
        } else {
          console.log("SQLite database connection closed.");
        }
      });
    }
  }
}

export default DB;
