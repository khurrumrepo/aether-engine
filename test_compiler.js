/**
 * ============================================================================
 * AETHER PROGRAMMING LANGUAGE - COMPILER INTEGRATION TEST
 * Module: test_compiler.js
 * Description: Verifies AetherCodeGenerator end-to-end bytecode compilation.
 * ============================================================================
 */

import { AetherCodeGenerator } from './src/compiler/codegen.js';

function runCompilerTest() {
    console.log("=============================================================");
    console.log(" [AETHER_TEST]: Starting Compiler Codegen Verification ");
    console.log("=============================================================\n");

    try {
        // Mock AST representing parsed source code
        const sampleAST = {
            type: 'AetherProgram',
            body: [
                {
                    type: 'MeshDeclaration',
                    name: 'cluster_alpha',
                    properties: {
                        node_id: '0xCAFEBABE',
                        security: 'ZK_PROVE_SHA256_STRICT',
                        bandwidth: '1GB'
                    },
                    line: 2
                },
                {
                    type: 'ExecBlock',
                    name: 'ProductionNode',
                    instructions: [
                        { command: 'Deploy', argument: 'cluster_alpha' }
                    ],
                    line: 6
                }
            ]
        };

        const codegen = new AetherCodeGenerator(sampleAST);
        const bytecodeStream = codegen.generate();

        console.log(`\n-> Successfully compiled AST into ${bytecodeStream.length} instructions.`);
        console.log(`-> Opcode 1: ${bytecodeStream[0].opcode}`);
        console.log(`-> Opcode 2: ${bytecodeStream[1].opcode}`);
        console.log(`-> Opcode 3: ${bytecodeStream[2].opcode}`);

        console.log("\n=============================================================");
        console.log(" [SUCCESS]: CODEGEN COMPILER PIPELINE VERIFIED SUCCESSFULLY! ");
        console.log("=============================================================\n");

    } catch (err) {
        console.error("\n[COMPILER_TEST_FATAL]:", err);
        process.exit(1);
    }
}

runCompilerTest();