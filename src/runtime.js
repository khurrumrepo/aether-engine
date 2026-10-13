/**
 * ============================================================================
 * AETHER PROGRAMMING LANGUAGE - MASTER SYSTEM RUNTIME COUPLER
 * Module: src/runtime.js
 * Description: Unified enterprise orchestrator binding all 15 architectural
 *              subsystems together (Lexer, Parser, Semantic Analyzer, Codegen,
 *              Virtual Machine, Memory Manager, Entanglement, Mesh Router, ZK Proofs, IO).
 * ============================================================================
 */

import { AetherLexer } from './compiler/lexer.js';
import { AetherParser } from './compiler/parser.js';
import { AetherSemanticAnalyzer } from './compiler/semantic.js';
import { AetherCodeGenerator } from './compiler/codegen.js';
import { AetherVirtualMachine } from './vm/virtualMachine.js';
import { AetherMemoryManager } from './vm/memoryManager.js';
import { AetherEntanglementMatrix } from './vm/entanglement.js';
import { AetherMeshRouter } from './net/meshRouter.js';
import { AetherZKProofOrchestrator } from './net/zkProof.js';
import { AetherStandardLibraryIO } from './stdlib/io.js';

export class AetherSystemMasterRuntime {
    constructor(nodeId = '0xDEADBEEF') {
        this.nodeId = nodeId;
        this.io = new AetherStandardLibraryIO();
        this.memoryManager = new AetherMemoryManager(104857600); // 100MB
        this.entanglementMatrix = new AetherEntanglementMatrix(nodeId);
        this.meshRouter = new AetherMeshRouter(nodeId);
        this.zkOrchestrator = new AetherZKProofOrchestrator();
        this.virtualMachine = new AetherVirtualMachine();
        
        console.log(`[AETHER_RUNTIME]: Initialized Master System Runtime on node '${nodeId}'`);
    }

    async executeSourceCode(sourceCode) {
        console.log(`[RUNTIME_PIPELINE]: Starting end-to-end compilation & execution pipeline...`);
        const startTime = performance.now();

        // Step 1: Lexical Analysis
        const lexer = new AetherLexer(sourceCode);
        const tokens = lexer.tokenize();

        // Step 2: Parsing AST
        const parser = new AetherParser(tokens);
        const ast = parser.parse();

        // Step 3: Static Semantic Analysis & Crypto Auditing
        const semantic = new AetherSemanticAnalyzer(ast);
        const semanticResult = semantic.analyze();

        // Step 4: Bytecode Generation
        const codegen = new AetherCodeGenerator(ast);
        const bytecodeStream = codegen.generate();

        // Step 5: Virtual Machine Execution
        const vmResult = await this.virtualMachine.executeBytecode(bytecodeStream);

        const duration = performance.now() - startTime;
        console.log(`[RUNTIME_SUCCESS]: Pipeline completed in ${duration.toFixed(3)}ms.`);

        return {
            success: true,
            tokensCount: tokens.length,
            astNodes: ast.body.length,
            semanticAudit: semanticResult,
            bytecodeInstructions: bytecodeStream.length,
            vmExecution: vmResult,
            durationMs: duration
        };
    }
}