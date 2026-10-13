/**
 * ============================================================================
 * AETHER PROGRAMMING LANGUAGE - LOW-LEVEL BYTECODE CODE GENERATOR
 * Module: src/compiler/codegen.js
 * Description: Transforms validated Abstract Syntax Trees (AST) into optimized,
 *              cryptographically signed execution bytecode instruction streams
 *              for the Aether Zero-Trust Virtual Machine.
 * ============================================================================
 */

import crypto from 'crypto';

export class AetherBytecodeInstruction {
    constructor(opcode, operands = {}, metadata = {}) {
        this.opcode = opcode;         // e.g., 'OP_DEPLOY_MESH', 'OP_BIND_STREAM'
        this.operands = operands;     // Target names, IDs, configuration maps
        this.metadata = metadata;     // Timestamps, source lines, execution flags
        this.instructionChecksum = this._generateChecksum();
    }

    _generateChecksum() {
        const payload = `${this.opcode}:${JSON.stringify(this.operands)}:${Date.now()}`;
        return crypto.createHash('sha256').update(payload).digest('hex');
    }
}

export class AetherCodeGenerator {
    constructor(ast) {
        if (!ast || !Array.isArray(ast.body)) {
            throw new Error("[CODEGEN_FATAL]: Code Generator requires a valid AST with a body array.");
        }
        this.ast = ast;
        this.bytecodeStream = [];
        this.generationTimestamp = Date.now();
    }

    generate() {
        console.log("[CODEGEN_ENGINE]: Starting AST to Bytecode compilation pipeline...");

        // Emit header initialization instruction
        this.bytecodeStream.push(new AetherBytecodeInstruction('OP_INIT_MATRIX', {
            version: '4.8.2-PROD',
            timestamp: this.generationTimestamp
        }));

        for (let node of this.ast.body) {
            this._compileNodeToBytecode(node);
        }

        // Emit termination instruction
        this.bytecodeStream.push(new AetherBytecodeInstruction('OP_HALT_MATRIX', {
            status: 'SUCCESS'
        }));

        console.log(`[CODEGEN_ENGINE]: Successfully compiled AST into ${this.bytecodeStream.length} low-level cryptographic instructions.`);
        return this.bytecodeStream;
    }

    _compileNodeToBytecode(node) {
        if (!node) return;

        switch (node.type) {
            case 'MeshDeclaration':
                this._compileMeshDeclaration(node);
                break;
            case 'StreamDeclaration':
                this._compileStreamDeclaration(node);
                break;
            case 'ExecBlock':
                this._compileExecBlock(node);
                break;
            default:
                throw new Error(`[CODEGEN_ERROR]: Unknown AST node type encountered during code generation: '${node.type}'`);
        }
    }

    _compileMeshDeclaration(node) {
        const meshName = node.name;
        const nodeId = node.properties.node_id || '0x0000';
        const securityMode = node.properties.security || 'ZK_SHA256';
        const bandwidth = node.properties.bandwidth || '1GB';

        console.log(`[CODEGEN]: Compiling mesh declaration '${meshName}' -> OP_DEPLOY_MESH`);

        const instruction = new AetherBytecodeInstruction('OP_DEPLOY_MESH', {
            name: meshName,
            nodeId: nodeId,
            security: securityMode,
            bandwidth: bandwidth
        }, { line: node.line });

        this.bytecodeStream.push(instruction);
    }

    _compileStreamDeclaration(node) {
        const streamName = node.name;
        const steps = node.steps || [];

        console.log(`[CODEGEN]: Compiling stream pipeline '${streamName}' -> OP_BIND_STREAM`);

        const instruction = new AetherBytecodeInstruction('OP_BIND_STREAM', {
            name: streamName,
            pipelineSteps: steps
        }, { line: node.line });

        this.bytecodeStream.push(instruction);
    }

    _compileExecBlock(node) {
        const blockName = node.name;
        const instructions = node.instructions || [];

        console.log(`[CODEGEN]: Compiling execution block '${blockName}' -> OP_EXEC_CORE`);

        // Emit block entry instruction
        this.bytecodeStream.push(new AetherBytecodeInstruction('OP_ENTER_EXEC_BLOCK', {
            blockName: blockName
        }, { line: node.line }));

        // Emit nested instruction commands
        for (let instr of instructions) {
            this.bytecodeStream.push(new AetherBytecodeInstruction('OP_INVOKE_COMMAND', {
                command: instr.command,
                argument: instr.argument
            }, { line: node.line }));
        }

        // Emit block exit instruction
        this.bytecodeStream.push(new AetherBytecodeInstruction('OP_EXIT_EXEC_BLOCK', {
            blockName: blockName
        }));
    }
}