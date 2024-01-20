/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * Generated by convex@1.8.0.
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as constants from "../constants.js";
import type * as files_images from "../files/images.js";
import type * as files_imagesLib from "../files/imagesLib.js";
import type * as files_plaiceholder from "../files/plaiceholder.js";
import type * as generations from "../generations.js";
import type * as http from "../http.js";
import type * as imageModelProviders from "../imageModelProviders.js";
import type * as imageModels from "../imageModels.js";
import type * as migrate from "../migrate.js";
import type * as providers_openai from "../providers/openai.js";
import type * as providers_sinkin from "../providers/sinkin.js";
import type * as types from "../types.js";
import type * as users from "../users.js";
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
  constants: typeof constants;
  "files/images": typeof files_images;
  "files/imagesLib": typeof files_imagesLib;
  "files/plaiceholder": typeof files_plaiceholder;
  generations: typeof generations;
  http: typeof http;
  imageModelProviders: typeof imageModelProviders;
  imageModels: typeof imageModels;
  migrate: typeof migrate;
  "providers/openai": typeof providers_openai;
  "providers/sinkin": typeof providers_sinkin;
  types: typeof types;
  users: typeof users;
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
