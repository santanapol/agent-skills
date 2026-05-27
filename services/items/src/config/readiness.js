let databaseReady = false;

export function isDatabaseReady() {
  return databaseReady;
}

export function setDatabaseReady(ready) {
  databaseReady = ready;
}
