#!/usr/bin/env node

/**
 * ============================================================================
 * AETHER PROGRAMMING LANGUAGE - INTERPRETER CLI RUNNER V4.0
 * Module: bin/aether.js
 * Description: Directly evaluates AST via Virtual Machine Interpreter, 
 *              supporting variables, arithmetic expressions, and print outputs.
 * ============================================================================
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { AetherLexer } from '../src/compiler/lexer.js';
import { AetherParser } from '../src/compiler/parser.js';
import { AetherVirtualMachine } from '../src/vm/virtualMachine.js';
import { AetherCosmicNoiseEngine } from '../src/engine/cosmicNoiseEngine.js';
import { AetherAgentSwarmCoordinator, AetherAutonomousAgent } from '../src/agent/aiAgentSwarm.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class AetherCLI {
    constructor(args) {
        this.args = args;
        this.command = args[2];
        this.targetFile = args[3];
    }

    async run() {
        console.log("=============================================================");
        console.log("       AETHER PROGRAMMING LANGUAGE CLI RUNNER V4.0 (INTERPRETER) ");
        console.log("=============================================================\n");

        if (!this.command || this.command === '--help' || this.command === '-h') {
            this._printHelp();
            return;
        }

        if (this.command === 'run') {
            if (!this.targetFile) {
                console.error("[CLI_ERROR]: Missing target .aether source file. Usage: aether run <filename.aether>");
                process.exit(1);
            }
            await this._executeAetherEcosystem(this.targetFile);
        } else {
            console.error(`[CLI_ERROR]: Unknown command '${this.command}'. Run 'aether --help' for usage.`);
            process.exit(1);
        }
    }

    _printHelp() {
        console.log("Usage:");
        console.log("  node bin/aether.js run <source.aether>    Execute an Aether source file\n");
    }

    async _executeAetherEcosystem(filePath) {
        const resolvedPath = path.resolve(process.cwd(), filePath);
        
        if (!fs.existsSync(resolvedPath)) {
            console.error(`[CLI_FATAL]: Source file not found at path: '${resolvedPath}'`);
            process.exit(1);
        }

        console.log(`[CLI]: Reading raw source code from -> ${filePath}`);
        const sourceCode = fs.readFileSync(resolvedPath, 'utf8');

        // Step 1: Real Lexical Analysis
        console.log("[CLI]: Tokenizing source code via Aether Lexer...");
        const lexer = new AetherLexer(sourceCode);
        const tokens = lexer.tokenize();
        console.log(`[LEXER]: Successfully generated ${tokens.length} semantic tokens.`);

        // Step 2: Real Syntax Analysis (AST Parsing)
        console.log("[CLI]: Building Abstract Syntax Tree (AST) via Aether Parser...");
        const parser = new AetherParser(tokens);
        const ast = parser.parse();
        console.log(`[PARSER]: Successfully constructed AST with ${ast.body.length} root nodes.`);

        // Step 3: Boot Cosmic Noise Engine & AI Swarm
        console.log("[CLI]: Initializing Aether Cosmic Noise & AI Agent Subsystems...");
        const cosmicEngine = new AetherCosmicNoiseEngine();
        cosmicEngine.startEngine();
        const cosmicEvent = cosmicEngine.processRadioAstronomyStream('PULSAR_PSR_B1919+21', sourceCode);

        const swarmCoordinator = new AetherAgentSwarmCoordinator('COSMIC_CLUSTER_SWARM');
        const agentAlpha = new AetherAutonomousAgent('AGENT_ALPHA', 'VALIDATOR', '0xCOSMIC_ALPHA_99');
        swarmCoordinator.registerAgent(agentAlpha);
        await swarmCoordinator.deploySwarm();

        // Step 4: Execute AST via Virtual Machine Interpreter
        console.log("\n[CLI]: Executing AST inside Zero-Trust Virtual Machine Interpreter...\n");
        const vm = new AetherVirtualMachine();
        const executionResult = await vm.executeAST(ast);

        // Cleanup
        cosmicEngine.shutdownEngine();
        await swarmCoordinator.shutdownSwarm();

        console.log("\n=============================================================");
        console.log(" [AETHER_ECOSYSTEM_SUCCESS]: PROGRAM EXECUTED SUCCESSFULLY! ");
        console.log(` -> Total Execution Cycles: ${executionResult.cycles}`);
        console.log(` -> Final Result Output: ${executionResult.result}`);
        console.log(` -> Final Merkle State Root: ${executionResult.merkleRoot}`);
        console.log(` -> Cosmic Visual Signature: ${cosmicEvent.visualSignature}`);
        console.log("=============================================================\n");
    }
}

const cli = new AetherCLI(process.argv);
cli.run().catch(err => {
    console.error("\n[CLI_FATAL_CRASH]:", err.message);
    process.exit(1);
});