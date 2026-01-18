/**
 * Convex App Configuration
 *
 * This file configures the VoltAgent component for your Convex app.
 */
import { defineApp } from "convex/server";
import voltagent from "@voltagent/convex/convex.config";

const app = defineApp();

// Install the VoltAgent component
app.use(voltagent);

export default app;
