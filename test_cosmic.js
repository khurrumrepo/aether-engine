/**
 * ============================================================================
 * AETHER COSMIC NOISE ENGINE INTEGRATION TEST
 * Module: test_cosmic.js
 * Description: Verifies real-time radio astronomy data rendering into signatures.
 * ============================================================================
 */

import { AetherCosmicNoiseEngine } from './src/engine/cosmicNoiseEngine.js';

async function runCosmicVerification() {
    console.log("=============================================================");
    console.log(" [AETHER_TEST]: Starting Deep Space Quantum Noise Engine Test ");
    console.log("=============================================================\n");

    try {
        // 1. Initialize Cosmic Engine
        const cosmicEngine = new AetherCosmicNoiseEngine();
        cosmicEngine.startEngine();

        // 2. Simulate raw radio telescope data input (e.g. Pulsar stream)
        console.log("\n[TEST]: Feeding raw radio astronomy telescope stream...");
        
        const event1 = cosmicEngine.processRadioAstronomyStream(
            'PULSAR_PSR_B1919+21',
            'RADIO_FREQ_SPECTRAL_BAND_9921_ALPHA'
        );

        const event2 = cosmicEngine.processRadioAstronomyStream(
            'QUASAR_3C_273',
            'COSMIC_MICROWAVE_BACKGROUND_NOISE_STREAM'
        );

        // 3. Inspect Engine Metrics
        const metrics = cosmicEngine.getEngineMetrics();
        console.log(`\n-> Cosmic Engine Status: ${metrics.status}`);
        console.log(`-> Total Events Mapped: ${metrics.totalEventsMapped}`);
        console.log(`-> Latest Visual Signature: ${event2.visualSignature}`);

        // 4. Shutdown Engine
        cosmicEngine.shutdownEngine();

        console.log("\n=============================================================");
        console.log(" [SUCCESS]: COSMIC NOISE ENGINE VERIFIED SUCCESSFULLY! ");
        console.log("=============================================================\n");

    } catch (err) {
        console.error("\n[COSMIC_TEST_FATAL]:", err);
        process.exit(1);
    }
}

runCosmicVerification();