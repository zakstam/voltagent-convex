/**
 * VoltAgent Convex Component API Types
 *
 * These types define the structure of the VoltAgent component's API,
 * allowing type-safe access to component functions.
 *
 * Note: Types are simplified to avoid "excessively deep" TypeScript errors
 * when combined with other Convex components.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFunctionReference = any;

/**
 * The VoltAgent Component API type.
 * This matches the structure of `components.voltagent` after installing the component.
 *
 * Types are intentionally simplified to prevent TypeScript depth issues
 * when multiple Convex components are used together.
 */
export type VoltAgentComponent = {
  conversations: {
    create: AnyFunctionReference;
    get: AnyFunctionReference;
    getByResourceId: AnyFunctionReference;
    getByUserId: AnyFunctionReference;
    queryConversations: AnyFunctionReference;
    update: AnyFunctionReference;
    remove: AnyFunctionReference;
  };
  messages: {
    add: AnyFunctionReference;
    addMany: AnyFunctionReference;
    get: AnyFunctionReference;
    clear: AnyFunctionReference;
  };
  steps: {
    save: AnyFunctionReference;
    get: AnyFunctionReference;
  };
  workingMemory: {
    get: AnyFunctionReference;
    set: AnyFunctionReference;
    remove: AnyFunctionReference;
  };
  workflows: {
    get: AnyFunctionReference;
    queryRuns: AnyFunctionReference;
    set: AnyFunctionReference;
    update: AnyFunctionReference;
    getSuspended: AnyFunctionReference;
  };
};
