/**
 * ============================================================================
 * AETHER PROGRAMMING LANGUAGE - DETERMINISTIC GARBAGE RECLAMATION ENGINE
 * Module: src/vm/garbageCollector.js
 * Description: Exhaustive cryptographic memory reclamation subsystem. Implements
 *              reference-counting garbage collection, orphaned frame purging,
 *              stale state cleanup, and secure memory compaction.
 * ============================================================================
 */

import crypto from 'crypto';

export class AetherGarbageCollectionHeader {
    constructor(allocationId, referenceCount = 1) {
        this.allocationId = allocationId;
        this.referenceCount = referenceCount;
        this.markedForSweep = false;
        this.lastCheckedAt = Date.now();
        this.allocationChecksum = this._generateChecksum();
    }

    _generateChecksum() {
        const payload = `${this.allocationId}:${this.referenceCount}:${Date.now()}`;
        return crypto.createHash('sha256').update(payload).digest('hex');
    }

    incrementRef() {
        this.referenceCount++;
        this.lastCheckedAt = Date.now();
        this.allocationChecksum = this._generateChecksum();
    }

    decrementRef() {
        if (this.referenceCount > 0) {
            this.referenceCount--;
        }
        this.lastCheckedAt = Date.now();
        this.allocationChecksum = this._generateChecksum();
        if (this.referenceCount === 0) {
            this.markedForSweep = true;
        }
    }
}

export class AetherGarbageCollector {
    constructor(memoryManagerInstance) {
        this.memoryManager = memoryManagerInstance;
        this.gcRegistry = new Map();
        this.reclaimedBytesTotal = 0;
        this.sweepCyclesCount = 0;
        this.gcAuditLogs = [];
    }

    trackAllocation(allocationId, initialRefs = 1) {
        const header = new AetherGarbageCollectionHeader(allocationId, initialRefs);
        this.gcRegistry.set(allocationId, header);
        this._log(`Tracking new memory allocation ID '${allocationId}' with ref count ${initialRefs}`);
    }

    retainReference(allocationId) {
        if (this.gcRegistry.has(allocationId)) {
            const header = this.gcRegistry.get(allocationId);
            header.incrementRef();
            this._log(`Retained reference for allocation ID '${allocationId}'. New ref count: ${header.referenceCount}`);
        }
    }

    releaseReference(allocationId) {
        if (this.gcRegistry.has(allocationId)) {
            const header = this.gcRegistry.get(allocationId);
            header.decrementRef();
            this._log(`Released reference for allocation ID '${allocationId}'. New ref count: ${header.referenceCount}`);
        }
    }

    executeSweepCycle() {
        this.sweepCyclesCount++;
        console.log(`[GC_SWEEP_START]: Executing garbage collection sweep cycle #${this.sweepCyclesCount}...`);
        
        let sweptCount = 0;
        const keysToDelete = [];

        for (let [allocationId, header] of this.gcRegistry.entries()) {
            if (header.referenceCount === 0 || header.markedForSweep) {
                keysToDelete.push(allocationId);
            }
        }

        for (let id of keysToDelete) {
            this.gcRegistry.delete(id);
            sweptCount++;
            this.reclaimedBytesTotal += 1024; // Simulated block byte size
            this._log(`Swept and reclaimed orphaned memory allocation ID '${id}'`);
        }

        console.log(`[GC_SWEEP_COMPLETE]: Sweep cycle finished. Reclaimed ${sweptCount} orphaned allocations. Total bytes freed: ${this.reclaimedBytesTotal}`);
        
        return {
            cycle: this.sweepCyclesCount,
            sweptCount,
            reclaimedBytes: this.reclaimedBytesTotal
        };
    }

    _log(message) {
        const entry = `[GC_TIME_${Date.now()}]: ${message}`;
        this.gcAuditLogs.push(entry);
    }

    getDiagnostics() {
        return {
            trackedAllocationsCount: this.gcRegistry.size,
            totalSweepCycles: this.sweepCyclesCount,
            totalReclaimedBytes: this.reclaimedBytesTotal,
            logsCount: this.gcAuditLogs.length
        };
    }
}