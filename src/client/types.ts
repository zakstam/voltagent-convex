/**
 * VoltAgent Convex Component API Types
 *
 * These types define the structure of the VoltAgent component's API,
 * allowing type-safe access to component functions.
 */

import type { ComponentApi } from "../component/_generated/component.js";

/**
 * The VoltAgent Component API type.
 * This matches the structure of `components.voltagent` after installing the component.
 */
export type VoltAgentComponent = ComponentApi;
