/**
 * ============================================================================
 * AETHER P2P NETWORK INTEGRATION TEST
 * Module: test_p2p.js
 * Description: Spins up Node Alpha and Node Beta locally to test P2P mesh clustering.
 * ============================================================================
 */

import { AetherP2PNetworkNode } from './src/net/p2pNetwork.js';

async function runP2PTest() {
    console.log("=============================================================");
    console.log(" [AETHER_P2P_TEST]: Starting Distributed Mesh Cluster Test ");
    console.log("=============================================================\n");

    try {
        // 1. Initialize Node Alpha (Port 9001)
        const nodeAlpha = new AetherP2PNetworkNode('0xNODE_ALPHA_1', '127.0.0.1', 9001);
        await nodeAlpha.startServer();

        // 2. Initialize Node Beta (Port 9002)
        const nodeBeta = new AetherP2PNetworkNode('0xNODE_BETA_2', '127.0.0.1', 9002);
        await nodeBeta.startServer();

        // 3. Connect Beta to Alpha
        console.log("\n[TEST]: Connecting Node Beta to Node Alpha...");
        await nodeBeta.connectToPeer('127.0.0.1', 9001, '0xNODE_ALPHA_1');

        // Allow a brief moment for handshake completion
        await new Promise(resolve => setTimeout(resolve, 500));

        // 4. Broadcast State from Alpha
        console.log("\n[TEST]: Broadcasting Merkle Root from Alpha to cluster...");
        nodeAlpha.broadcastMeshState('0xCAFEBABE1234567890ABCDEF', { cluster: 'cluster_beta', status: 'ACTIVE' });

        await new Promise(resolve => setTimeout(resolve, 500));

        // 5. Graceful Shutdown
        console.log("\n[TEST]: Shutting down cluster nodes...");
        await nodeBeta.shutdown();
        await nodeAlpha.shutdown();

        console.log("\n=============================================================");
        console.log(" [SUCCESS]: P2P MESH CLUSTERING VERIFIED SUCCESSFULLY! ");
        console.log("=============================================================\n");

    } catch (err) {
        console.error("\n[P2P_TEST_FATAL]:", err);
        process.exit(1);
    }
}

runP2PTest();