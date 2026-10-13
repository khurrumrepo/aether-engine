/**
 * ============================================================================
 * AETHER PROGRAMMING LANGUAGE - MASTER CLI RUNNER & ADVANCED REPL SHELL
 * Module: index.js
 * Description: Exhaustive command-line interface runner, interactive REPL shell,
 *              enterprise benchmark suite, telemetry log visualizer, and system
 *              diagnostics aggregator for the Aether Distributed Language.
 * ============================================================================
 */

import readline from 'readline';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { AetherSystemMasterRuntime } from './src/runtime.js';

const MASTER_BANNER = `
============================================================================
    CHRONOS-MESH // AETHER DISTRIBUTED PROGRAMMING LANGUAGE
    VERSION: 4.8.2-PROD | CODENAME: QUANTUM-AEON
    STATUS: ZERO-TRUST SECURE MATRIX ACTIVE & HARDENED
============================================================================
`;

export class AetherBenchmarkSuite {
    constructor(runtime) {
        this.runtime = runtime;
        this.benchmarkResults = [];
    }

    async runFullSuite() {
        console.log("[BENCHMARK_SUITE]: Initializing high-volume stress tests...");
        const iterations = 50;
        let successCount = 0;
        const startTime = performance.now();

        for (let i = 0; i < iterations; i++) {
            const testPayload = `
                @mesh cluster_benchmark_${i} :: {
                    node_id := 0x${i.toString(16).padStart(4, '0')},
                    security := ZK_PROVE_SHA256_STRICT,
                    bandwidth := 10GB
                }
                exec BenchmarkNode_${i} {
                    Deploy(cluster_benchmark_${i})
                }
            `;

            try {
                const res = await this.runtime.executeSourceCode(testPayload);
                if (res.success) successCount++;
            } catch (e) {
                console.error(`[BENCHMARK_ERROR]: Iteration ${i} failed: ${e.message}`);
            }
        }

        const totalDuration = performance.now() - startTime;
        const report = {
            iterations,
            successCount,
            failureCount: iterations - successCount,
            totalDurationMs: totalDuration,
            avgLatencyMs: totalDuration / iterations,
            timestamp: Date.now()
        };

        this.benchmarkResults.push(report);
        console.log(`[BENCHMARK_COMPLETE]: Executed ${iterations} iterations in ${totalDuration.toFixed(3)}ms. Success Rate: ${(successCount/iterations)*100}%`);
        return report;
    }
}

export class AetherInteractiveREPL {
    constructor(runtime) {
        this.runtime = runtime;
        this.benchmarkSuite = new AetherBenchmarkSuite(runtime);
        this.rl = null;
        this.commandHistory = [];
    }

    start() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: 'aether-engine> '
        });

        console.log(MASTER_BANNER);
        console.log("[SYSTEM_READY]: Runtime active. Type 'exit' to quit, 'help' for manual, 'diag' for system stats, or 'bench' to run stress tests.\n");
        this.rl.prompt();

        this.rl.on('line', async (line) => {
            const trimmed = line.trim();
            this.commandHistory.push(trimmed);

            try {
                await this._handleCommand(trimmed);
            } catch (err) {
                console.error(`[REPL_ERROR]: ${err.message}`);
            }

            this.rl.prompt();
        });

        this.rl.on('close', () => {
            console.log("[SHUTDOWN]: Terminating Aether Distributed Matrix. Goodbye.");
            process.exit(0);
        });
    }

    async _handleCommand(input) {
        if (input.length === 0) return;

        switch (input) {
            case 'exit':
                this.rl.close();
                break;

            case 'help':
                console.log(`
                ================ AETHER REPL COMMAND MANUAL ================
                * exit       : Terminate the runtime session safely.
                * diag       : Display real-time system diagnostics and memory states.
                * bench      : Execute full enterprise stress test benchmark suite.
                * history    : Show previously entered commands in this session.
                * clear      : Clear console output buffer.
                * [source]   : Execute raw Aether source code string directly.
                ============================================================
                `);
                break;

            case 'diag':
                console.log("[DIAGNOSTICS]: Memory Diagnostics:", JSON.stringify(this.runtime.memoryManager.getMemoryDiagnostics(), null, 2));
                console.log("[DIAGNOSTICS]: Router Diagnostics:", JSON.stringify(this.runtime.meshRouter.getRouterDiagnostics(), null, 2));
                console.log("[DIAGNOSTICS]: ZK Proof Diagnostics:", JSON.stringify(this.runtime.zkOrchestrator.getDiagnostics(), null, 2));
                break;

            case 'bench':
                await this.benchmarkSuite.runFullSuite();
                break;

            case 'history':
                console.log("[SESSION_HISTORY]:");
                this.commandHistory.forEach((cmd, idx) => {
                    console.log(`  [${idx}]: ${cmd}`);
                });
                break;

            case 'clear':
                console.clear();
                console.log(MASTER_BANNER);
                break;

            default:
                const res = await this.runtime.executeSourceCode(input);
                console.log(`[REPL_SUCCESS]: Executed successfully.`);
                console.log(`  -> Tokens: ${res.tokensCount}`);
                console.log(`  -> AST Nodes: ${res.astNodes}`);
                console.log(`  -> Merkle State Root: ${res.vmExecution.merkleRoot}`);
                console.log(`  -> Duration: ${res.durationMs.toFixed(3)}ms`);
                break;
        }
    }
}

async function runEnterpriseDemo(runtime) {
    console.log("\n[SYSTEM_BOOT]: Executing Default Enterprise Demonstration Program...\n");

    const sampleSourceCode = `
        @mesh cluster_alpha :: {
            node_id := 0xDEADBEEF,
            security := ZK_PROVE_SHA256_STRICT,
            bandwidth := 10GB
        }

        stream telemetry_pipeline {
            input stream_buffer_alpha
        }

        exec MasterControlNode {
            Deploy(cluster_alpha)
        }
    `;

    try {
        const result = await runtime.executeSourceCode(sampleSourceCode);
        console.log(`\n[PIPELINE_SUCCESS]: Execution finished in ${result.durationMs.toFixed(2)}ms.`);
        console.log(`[MERKLE_ROOT]: ${result.vmExecution.merkleRoot}\n`);
    } catch (err) {
        console.error(`[EXECUTION_FATAL]: ${err.message}`);
    }
}

async function main() {
    const runtime = new AetherSystemMasterRuntime('0xDEADBEEF');

    const args = process.argv.slice(2);
    if (args.includes('--bench')) {
        const suite = new AetherBenchmarkSuite(runtime);
        await suite.runFullSuite();
        process.exit(0);
    } else {
        await runEnterpriseDemo(runtime);
        const repl = new AetherInteractiveREPL(runtime);
        repl.start();
    }
}

main().catch(err => {
    console.error("[FATAL_CRASH]:", err);
    process.exit(1);
});