export class CancelledOperationError extends Error {
  constructor() { super('Operação cancelada antes da próxima chamada.'); this.name = 'CancelledOperationError'; }
}

export function isUnavailableError(error) {
  const message = `${error?.code || ''} ${error?.message || error || ''}`.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  return [429, 502, 503, 504].includes(Number(error?.status ?? error?.statusCode)) ||
    /indisponiv|unavailable|service.?down|overloaded|rate.?limit|quota|network|failed to fetch|timeout|timed out|connection|conexao|econn/.test(message);
}

/** One operation at a time. A pause never resubmits the failed operation. */
export class SafeProductionQueue {
  constructor({ onProgress = () => {} } = {}) {
    this.onProgress = onProgress;
    this.pending = [];
    this.tasks = [];
    this.active = null;
    this.paused = false;
    this.cancelled = false;
    this.reason = '';
    this.nextId = 1;
    this.waiters = [];
  }

  snapshot() {
    return {
      state: this.active ? (this.cancelled ? 'cancelling' : 'running') : this.cancelled ? 'cancelled' : this.paused ? 'paused' : this.pending.length ? 'pending' : 'idle',
      paused: this.paused, cancelled: this.cancelled, reason: this.reason,
      active: this.active ? { id: this.active.id, label: this.active.label } : null,
      pending: this.pending.length, total: this.tasks.length,
      completed: this.tasks.filter(t => t.status === 'completed').length,
      failed: this.tasks.filter(t => t.status === 'error').length,
      cancelledCount: this.tasks.filter(t => t.status === 'cancelled').length,
      tasks: this.tasks.map(({ id, label, status, error }) => ({ id, label, status, ...(error ? { error } : {}) })),
    };
  }

  emit(event = {}) {
    // A rendering/persistence callback error must never cause a paid request to be repeated.
    try { this.onProgress({ ...event, queue: this.snapshot() }); } catch { /* Observer owns its error. */ }
    if (!this.active && (this.paused || this.cancelled || !this.pending.length)) {
      for (const resolve of this.waiters.splice(0)) resolve(this.snapshot());
    }
  }

  enqueue(run, { label = 'Operação', pauseOnError = true } = {}) {
    if (this.cancelled) return Promise.resolve({ cancelled: true });
    const promise = new Promise((resolve, reject) => {
      const task = { id: this.nextId++, label, run, resolve, reject, pauseOnError, status: 'pending' };
      this.pending.push(task);
      this.tasks.push(task);
    });
    this.emit({ type: 'queued', label });
    this.pump();
    return promise;
  }

  async pump() {
    if (this.active || this.paused || this.cancelled) return;
    const task = this.pending.shift();
    if (!task) { this.emit(); return; }
    this.active = task;
    task.status = 'running';
    this.emit({ type: 'started', taskId: task.id, label: task.label });
    try {
      const result = await task.run();
      // Cancellation stops the NEXT call. Results already paid for are always delivered.
      task.status = 'completed';
      task.resolve(result);
      this.emit({ type: 'completed', taskId: task.id, label: task.label });
    } catch (error) {
      if (error instanceof CancelledOperationError) {
        task.status = 'cancelled';
        task.resolve({ cancelled: true });
        this.emit({ type: 'cancelled', taskId: task.id, label: task.label });
        return;
      }
      task.status = 'error';
      task.error = error?.message || String(error);
      if (task.pauseOnError) {
        this.paused = true;
        this.reason = isUnavailableError(error) ? 'service-unavailable' : 'review-required';
      }
      task.reject(error);
      this.emit({ type: 'error', taskId: task.id, label: task.label, error: task.error });
    } finally {
      this.active = null;
      this.emit();
      if (!this.paused && !this.cancelled) this.pump();
    }
  }

  pause(reason = 'user') { this.paused = true; this.reason = reason; this.emit({ type: 'paused' }); return this.snapshot(); }
  resume() {
    if (this.cancelled) return this.snapshot();
    this.paused = false;
    this.reason = '';
    this.emit({ type: 'resumed' });
    this.pump();
    return this.snapshot();
  }
  cancel() {
    this.cancelled = true;
    this.reason = 'cancelled';
    for (const task of this.pending.splice(0)) {
      task.status = 'cancelled';
      task.resolve({ cancelled: true });
    }
    this.emit({ type: 'cancelled' });
    return this.snapshot();
  }
  reset() {
    if (this.active || this.pending.length) throw new Error('Aguarde a operação em andamento ou cancele os itens pendentes antes de iniciar outra fila.');
    this.paused = false;
    this.cancelled = false;
    this.reason = '';
    this.tasks = [];
    this.emit({ type: 'reset' });
  }
  untilStopped() {
    if (!this.active && (this.paused || this.cancelled || !this.pending.length)) return Promise.resolve(this.snapshot());
    return new Promise(resolve => this.waiters.push(resolve));
  }
}
