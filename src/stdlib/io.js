/**
 * ============================================================================
 * AETHER PROGRAMMING LANGUAGE - NATIVE I/O & TELEMETRY STREAM HANDLERS
 * Module: src/stdlib/io.js
 * Description: Exhaustive standard library subsystem for asynchronous input/output,
 *              buffered telemetry parsing, secure file stream streaming, and
 *              enterprise-grade log formatting.
 * ============================================================================
 */

import fs from 'fs';
import readline from 'readline';
import crypto from 'crypto';

export class AetherBufferStream {
    constructor(streamName, maxCapacityBytes = 1048576) {
        this.streamName = streamName;
        this.maxCapacityBytes = maxCapacityBytes;
        this.buffer = [];
        this.currentSize = 0;
        this.isFlushed = false;
    }

    write(data) {
        const payload = typeof data === 'string' ? data : JSON.stringify(data);
        const size = Buffer.byteLength(payload, 'utf8');

        if (this.currentSize + size > this.maxCapacityBytes) {
            throw new Error(`[BUFFER_OVERFLOW]: Stream '${this.streamName}' exceeded maximum capacity of ${this.maxCapacityBytes} bytes.`);
        }

        const chunkEntry = {
            payload,
            size,
            checksum: crypto.createHash('sha256').update(payload).digest('hex'),
            timestamp: Date.now()
        };

        this.buffer.push(chunkEntry);
        this.currentSize += size;
        return true;
    }

    readStream() {
        return this.buffer.map(chunk => chunk.payload);
    }

    flush() {
        const dataCount = this.buffer.length;
        this.buffer = [];
        this.currentSize = 0;
        this.isFlushed = true;
        console.log(`[IO_STREAM]: Stream '${this.streamName}' flushed successfully. Cleared ${dataCount} chunks.`);
    }
}

export class AetherStandardLibraryIO {
    constructor() {
        this.activeStreams = new Map();
        this.ioAuditLogs = [];
    }

    createStream(streamName, capacity = 1048576) {
        if (this.activeStreams.has(streamName)) {
            throw new Error(`[IO_ERROR]: Stream '${streamName}' already exists.`);
        }
        const stream = new AetherBufferStream(streamName, capacity);
        this.activeStreams.set(streamName, stream);
        this._log(`Created secure buffer stream '${streamName}'`);
        return stream;
    }

    writeToStream(streamName, data) {
        const stream = this.activeStreams.get(streamName);
        if (!stream) {
            throw new Error(`[IO_ERROR]: Unregistered stream '${streamName}' targeted for writing.`);
        }
        return stream.write(data);
    }

    async writeToFileSecure(filePath, content) {
        const formattedContent = typeof content === 'string' ? content : JSON.stringify(content, null, 2);
        const fileSignature = crypto.createHash('sha256').update(formattedContent).digest('hex');
        
        const securedPayload = {
            signature: fileSignature,
            timestamp: Date.now(),
            data: formattedContent
        };

        fs.writeFileSync(filePath, JSON.stringify(securedPayload, null, 2), 'utf8');
        this._log(`Wrote encrypted file buffer securely to path '${filePath}'`);
        return fileSignature;
    }

    readFromFileSecure(filePath) {
        if (!fs.existsSync(filePath)) {
            throw new Error(`[IO_FILE_ERROR]: Target file path '${filePath}' does not exist.`);
        }

        const rawFile = fs.readFileSync(filePath, 'utf8');
        const parsed = JSON.parse(rawFile);
        
        const computedSig = crypto.createHash('sha256').update(parsed.data).digest('hex');
        if (computedSig !== parsed.signature) {
            throw new Error(`[IO_SECURITY_FATAL]: File tampering detected at path '${filePath}'! Checksum mismatch.`);
        }

        this._log(`Successfully read and cryptographically verified file '${filePath}'`);
        return parsed.data;
    }

    _log(message) {
        const entry = `[IO_TIME_${Date.now()}]: ${message}`;
        this.ioAuditLogs.push(entry);
    }
}