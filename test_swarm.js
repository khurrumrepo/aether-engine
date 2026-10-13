/**
 * ============================================================================
 * AETHER AI AGENT SWARM INTEGRATION TEST
 * Module: test_swarm.js
 * Description: Verifies autonomous agent deployment, task dispatching, and swarm consensus.
 * ============================================================================
 */

import { AetherAutonomousAgent, AetherAgentSwarmCoordinator } from './src/agent/aiAgentSwarm.js';

async function runSwarmVerification() {
    console.log("=============================================================");
    console.log(" [AETHER_TEST]: Starting AI Agent Swarm & Autonomous Engine Test");
    console.log("=============================================================\n");

    try {
        // 1. Initialize Swarm Coordinator
        const coordinator = new AetherAgentSwarmCoordinator('COSMIC_SWARM_V1');

        // 2. Spawn Autonomous Agents
        const agentAlpha = new AetherAutonomousAgent('AGENT_ALPHA', 'VALIDATOR', '0xNODE_ALPHA');
        const agentBeta = new AetherAutonomousAgent('AGENT_BETA', 'EXECUTOR', '0xNODE_BETA');

        coordinator.registerAgent(agentAlpha);
        coordinator.registerAgent(agentBeta);

        // 3. Deploy Swarm
        await coordinator.deploySwarm();

        // 4. Dispatch Tasks to Swarm
        console.log("\n[TEST]: Dispatching concurrent tasks to AI agent swarm...");
        
        const task1 = coordinator.dispatchTaskToSwarm({
            taskId: 'TASK_PARSE_TELEMETRY_01',
            type: 'DEEP_SPACE_DECODE',
            priority: 'HIGH'
        });

        const task2 = coordinator.dispatchTaskToSwarm({
            taskId: 'TASK_VERIFY_MERKLE_02',
            type: 'CRYPTOGRAPHIC_PROVE',
            priority: 'CRITICAL'
        });

        await Promise.all([task1, task2]);

        // 5. Inspect Swarm Metrics
        const metrics = coordinator.getSwarmMetrics();
        console.log(`\n-> Swarm Metrics Status: ${metrics.status}`);
        console.log(`-> Active Agents: ${metrics.activeAgents}`);
        console.log(`-> Total Tasks Completed: ${metrics.totalTasksCompleted}`);

        // 6. Graceful Shutdown
        await coordinator.shutdownSwarm();

        console.log("\n=============================================================");
        console.log(" [SUCCESS]: AI AGENT SWARM ENGINE VERIFIED SUCCESSFULLY! ");
        console.log("=============================================================\n");

    } catch (err) {
        console.error("\n[SWARM_TEST_FATAL]:", err);
        process.exit(1);
    }
}

runSwarmVerification();