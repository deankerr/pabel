/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * Generated by convex@1.7.1.
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as generations from "../generations.js";
import type * as image_civitai from "../image/civitai.js";
import type * as image_openai from "../image/openai.js";
import type * as image_sinkin from "../image/sinkin.js";
import type * as imageModelProviders from "../imageModelProviders.js";
import type * as imageModels from "../imageModels.js";
import type * as providers from "../providers.js";
import type * as util from "../util.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  generations: typeof generations;
  "image/civitai": typeof image_civitai;
  "image/openai": typeof image_openai;
  "image/sinkin": typeof image_sinkin;
  imageModelProviders: typeof imageModelProviders;
  imageModels: typeof imageModels;
  providers: typeof providers;
  util: typeof util;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
