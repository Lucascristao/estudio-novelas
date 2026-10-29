const DB_NAME = 'sanja-estudio-novelas';

/** IndexedDB keeps full media without the small localStorage quota. No network calls. */
export function createProjectStorage(indexedDB = globalThis.indexedDB) {
  let connection;
  let writes = Promise.resolve();
  async function open() {
    if (!indexedDB) throw new Error('O salvamento local não está disponível neste ambiente. Baixe o projeto JSON.');
    connection ??= new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = () => request.result.createObjectStore('projects');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => { connection = null; reject(request.error); };
      request.onblocked = () => reject(new Error('Feche outras versões do estúdio para ativar o salvamento local.'));
    });
    return connection;
  }
  async function transact(mode, action) {
    const db = await open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('projects', mode);
      const request = action(tx.objectStore('projects'));
      let result;
      request.onsuccess = () => { result = request.result; };
      tx.oncomplete = () => resolve(result);
      tx.onerror = () => reject(tx.error || request.error);
      tx.onabort = () => reject(tx.error || new Error('Salvamento interrompido.'));
    });
  }
  return {
    load: () => transact('readonly', store => store.get('last')),
    save(project) {
      const value = { project, savedAt: new Date().toISOString() };
      writes = writes.catch(() => {}).then(() => transact('readwrite', store => store.put(value, 'last')));
      return writes.then(() => value.savedAt);
    },
  };
}
