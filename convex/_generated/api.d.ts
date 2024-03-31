/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * Generated by convex@1.10.0.
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as apiKeys from "../apiKeys.js";
import type * as constants from "../constants.js";
import type * as files_images from "../files/images.js";
import type * as files_process from "../files/process.js";
import type * as functions from "../functions.js";
import type * as generations_do from "../generations/do.js";
import type * as generations_imageModels from "../generations/imageModels.js";
import type * as generations_run from "../generations/run.js";
import type * as http from "../http.js";
import type * as jobs from "../jobs.js";
import type * as migrations from "../migrations.js";
import type * as providers_aws from "../providers/aws.js";
import type * as providers_clerk from "../providers/clerk.js";
import type * as providers_elevenlabs from "../providers/elevenlabs.js";
import type * as providers_sinkin from "../providers/sinkin.js";
import type * as providers_togetherai from "../providers/togetherai.js";
import type * as rules from "../rules.js";
import type * as speech from "../speech.js";
import type * as threads_inference from "../threads/inference.js";
import type * as threads_models from "../threads/models.js";
import type * as threads_threads from "../threads/threads.js";
import type * as types from "../types.js";
import type * as users from "../users.js";
import type * as util from "../util.js";
import type * as utils_retrier from "../utils/retrier.js";
import type * as utils_scripts from "../utils/scripts.js";
import type * as validators from "../validators.js";
import type * as voices from "../voices.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  apiKeys: typeof apiKeys;
  constants: typeof constants;
  "files/images": typeof files_images;
  "files/process": typeof files_process;
  functions: typeof functions;
  "generations/do": typeof generations_do;
  "generations/imageModels": typeof generations_imageModels;
  "generations/run": typeof generations_run;
  http: typeof http;
  jobs: typeof jobs;
  migrations: typeof migrations;
  "providers/aws": typeof providers_aws;
  "providers/clerk": typeof providers_clerk;
  "providers/elevenlabs": typeof providers_elevenlabs;
  "providers/sinkin": typeof providers_sinkin;
  "providers/togetherai": typeof providers_togetherai;
  rules: typeof rules;
  speech: typeof speech;
  "threads/inference": typeof threads_inference;
  "threads/models": typeof threads_models;
  "threads/threads": typeof threads_threads;
  types: typeof types;
  users: typeof users;
  util: typeof util;
  "utils/retrier": typeof utils_retrier;
  "utils/scripts": typeof utils_scripts;
  validators: typeof validators;
  voices: typeof voices;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
