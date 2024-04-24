/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * Generated by convex@1.11.2.
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as constants from "../constants.js";
import type * as functions from "../functions.js";
import type * as generated_images from "../generated_images.js";
import type * as generation from "../generation.js";
import type * as http from "../http.js";
import type * as jobs from "../jobs.js";
import type * as lib_sharp from "../lib/sharp.js";
import type * as lib_utils from "../lib/utils.js";
import type * as messages from "../messages.js";
import type * as providers_aws from "../providers/aws.js";
import type * as providers_clerk from "../providers/clerk.js";
import type * as providers_openrouter from "../providers/openrouter.js";
import type * as providers_sinkin from "../providers/sinkin.js";
import type * as providers_togetherai from "../providers/togetherai.js";
import type * as rules from "../rules.js";
import type * as threads from "../threads.js";
import type * as types from "../types.js";
import type * as users from "../users.js";
import type * as utils from "../utils.js";
import type * as validators from "../validators.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  constants: typeof constants;
  functions: typeof functions;
  generated_images: typeof generated_images;
  generation: typeof generation;
  http: typeof http;
  jobs: typeof jobs;
  "lib/sharp": typeof lib_sharp;
  "lib/utils": typeof lib_utils;
  messages: typeof messages;
  "providers/aws": typeof providers_aws;
  "providers/clerk": typeof providers_clerk;
  "providers/openrouter": typeof providers_openrouter;
  "providers/sinkin": typeof providers_sinkin;
  "providers/togetherai": typeof providers_togetherai;
  rules: typeof rules;
  threads: typeof threads;
  types: typeof types;
  users: typeof users;
  utils: typeof utils;
  validators: typeof validators;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
