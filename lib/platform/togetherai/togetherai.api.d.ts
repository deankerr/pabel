/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */


export interface paths {
  "/inference": {
    /** Inference */
    post: operations["inference"];
  };
  "/instances": {
    /** List Running Instances */
    get: operations["instances"];
  };
  "/instances/stop": {
    /** Stop Fine-tuned Instance */
    post: operations["instances-stop"];
  };
  "/instances/start": {
    /** Start Fine-tuned Instance */
    post: operations["instances-start"];
  };
  "/models/info?options=": {
    /** Model Options */
    get: operations["model-options"];
  };
}

export type webhooks = Record<string, never>;

export interface components {
  schemas: never;
  responses: never;
  parameters: never;
  requestBodies: never;
  headers: never;
  pathItems: never;
}

export type $defs = Record<string, never>;

export type external = Record<string, never>;

export interface operations {

  /** Inference */
  inference: {
    requestBody?: {
      content: {
        "application/json": {
          /**
           * @description Required. The name of the model to query.
           * @default togethercomputer/RedPajama-INCITE-7B-Instruct
           */
          model?: string;
          /**
           * @description Required. A string providing context for the model to complete.
           * @default The capital of France is
           */
          prompt?: string;
          /**
           * Format: int32
           * @description Required. The maximum number of tokens to generate.
           * @default 128
           */
          max_tokens?: number;
          /**
           * @description Optional. A string sequence that will truncate (stop) inference text output. For example, "\n\n" will stop generation as soon as the model generates two newlines.
           * @default .
           */
          stop?: string;
          /**
           * Format: float
           * @description Optional. A decimal number that determines the degree of randomness in the response. A value of 1 will always yield the same output. A temperature less than 1 favors more correctness and is appropriate for question answering or summarization. A value greater than 1 introduces more randomness in the output.
           * @default 0.7
           */
          temperature?: number;
          /**
           * Format: float
           * @description Optional. The `top_p` (nucleus) parameter is used to dynamically adjust the number of choices for each predicted token based on the cumulative probabilities. It specifies a probability threshold, below which all less likely tokens are filtered out. This technique helps to maintain diversity and generate more fluent and natural-sounding text.
           * @default 0.7
           */
          top_p?: number;
          /**
           * Format: int32
           * @description Optional. The `top_k` parameter is used to limit the number of choices for the next predicted word or token. It specifies the maximum number of tokens to consider at each step, based on their probability of occurrence. This technique helps to speed up the generation process and can improve the quality of the generated text by focusing on the most likely options.
           * @default 50
           */
          top_k?: number;
          /**
           * Format: float
           * @description Optional. A number that controls the diversity of generated text by reducing the likelihood of repeated sequences. Higher values decrease repetition.
           * @default 1
           */
          repetition_penalty?: number;
          /**
           * Format: int32
           * @description Optional. An integer that specifies how many top token log probabilities are included in the response for each token generation step.
           */
          logprobs?: number;
          /** @description Optional. If true, stream tokens as Server-Sent Events as the model generates them instead of waiting for the full model response. If false, return a single JSON object containing the results. */
          stream_tokens?: boolean;
        };
      };
    };
    responses: {
      /** @description 200 */
      200: {
        content: {
          "application/json": {
            /** @example finished */
            status?: string;
            prompt?: string[];
            /** @example togethercomputer/RedPajama-INCITE-Instruct-7B-v0.1 */
            model?: string;
            /** @example */
            model_owner?: string;
            tags?: Record<string, never>;
            /**
             * @default 0
             * @example 1
             */
            num_returns?: number;
            args?: {
              /** @example togethercomputer/RedPajama-INCITE-Instruct-7B-v0.1 */
              model?: string;
              /** @example The capital of France is */
              prompt?: string;
              /**
               * @default 0
               * @example 0.8
               */
              temperature?: number;
              /**
               * @default 0
               * @example 0.7
               */
              top_p?: number;
              /**
               * @default 0
               * @example 50
               */
              top_k?: number;
              /**
               * @default 0
               * @example 1
               */
              max_tokens?: number;
            };
            subjobs?: unknown[];
            output?: {
              choices?: {
                  /** @example length */
                  finish_reason?: string;
                  /**
                   * @default 0
                   * @example 0
                   */
                  index?: number;
                  /** @example  Paris */
                  text?: string;
                }[];
              /**
               * @default 0
               * @example 0.06382315792143345
               */
              raw_compute_time?: number;
              /** @example language-model-inference */
              result_type?: string;
            };
          };
        };
      };
      /** @description 400 */
      400: {
        content: {
          "text/plain": unknown;
        };
      };
      /** @description 401 */
      401: {
        content: {
          "text/plain": unknown;
        };
      };
      /** @description 403 */
      403: {
        content: {
          "text/plain": unknown;
        };
      };
      /** @description 500 */
      500: {
        content: {
          "text/plain": unknown;
        };
      };
    };
  };
  /** List Running Instances */
  instances: {
    requestBody?: {
      content: {
        "application/json": unknown;
      };
    };
    responses: {
      /** @description 200 */
      200: {
        content: {
          "application/json": {
            /** @example finished */
            status?: string;
            prompt?: string[];
            /** @example togethercomputer/RedPajama-INCITE-Instruct-7B-v0.1 */
            model?: string;
            /** @example */
            model_owner?: string;
            tags?: Record<string, never>;
            /**
             * @default 0
             * @example 1
             */
            num_returns?: number;
            args?: {
              /** @example togethercomputer/RedPajama-INCITE-Instruct-7B-v0.1 */
              model?: string;
              /** @example The capital of France is */
              prompt?: string;
              /**
               * @default 0
               * @example 0.8
               */
              temperature?: number;
              /**
               * @default 0
               * @example 0.7
               */
              top_p?: number;
              /**
               * @default 0
               * @example 50
               */
              top_k?: number;
              /**
               * @default 0
               * @example 1
               */
              max_tokens?: number;
            };
            subjobs?: unknown[];
            output?: {
              choices?: {
                  /** @example length */
                  finish_reason?: string;
                  /**
                   * @default 0
                   * @example 0
                   */
                  index?: number;
                  /** @example  Paris */
                  text?: string;
                }[];
              /**
               * @default 0
               * @example 0.06382315792143345
               */
              raw_compute_time?: number;
              /** @example language-model-inference */
              result_type?: string;
            };
          };
        };
      };
      /** @description 400 */
      400: {
        content: {
          "text/plain": unknown;
        };
      };
      /** @description 401 */
      401: {
        content: {
          "text/plain": unknown;
        };
      };
      /** @description 403 */
      403: {
        content: {
          "text/plain": unknown;
        };
      };
      /** @description 500 */
      500: {
        content: {
          "text/plain": unknown;
        };
      };
    };
  };
  /** Stop Fine-tuned Instance */
  "instances-stop": {
    parameters: {
      query?: {
        /** @description Required. The name of the fine-tuned model to stop. */
        model?: string;
      };
    };
    requestBody?: {
      content: {
        "application/json": unknown;
      };
    };
    responses: {
      /** @description 200 */
      200: {
        content: {
          "application/json": {
            /** @example finished */
            status?: string;
            prompt?: string[];
            /** @example togethercomputer/RedPajama-INCITE-Instruct-7B-v0.1 */
            model?: string;
            /** @example */
            model_owner?: string;
            tags?: Record<string, never>;
            /**
             * @default 0
             * @example 1
             */
            num_returns?: number;
            args?: {
              /** @example togethercomputer/RedPajama-INCITE-Instruct-7B-v0.1 */
              model?: string;
              /** @example The capital of France is */
              prompt?: string;
              /**
               * @default 0
               * @example 0.8
               */
              temperature?: number;
              /**
               * @default 0
               * @example 0.7
               */
              top_p?: number;
              /**
               * @default 0
               * @example 50
               */
              top_k?: number;
              /**
               * @default 0
               * @example 1
               */
              max_tokens?: number;
            };
            subjobs?: unknown[];
            output?: {
              choices?: {
                  /** @example length */
                  finish_reason?: string;
                  /**
                   * @default 0
                   * @example 0
                   */
                  index?: number;
                  /** @example  Paris */
                  text?: string;
                }[];
              /**
               * @default 0
               * @example 0.06382315792143345
               */
              raw_compute_time?: number;
              /** @example language-model-inference */
              result_type?: string;
            };
          };
        };
      };
      /** @description 400 */
      400: {
        content: {
          "text/plain": unknown;
        };
      };
      /** @description 401 */
      401: {
        content: {
          "text/plain": unknown;
        };
      };
      /** @description 403 */
      403: {
        content: {
          "text/plain": unknown;
        };
      };
      /** @description 500 */
      500: {
        content: {
          "text/plain": unknown;
        };
      };
    };
  };
  /** Start Fine-tuned Instance */
  "instances-start": {
    parameters: {
      query?: {
        /** @description Required. The name of the fine-tuned model to start. */
        model?: string;
      };
    };
    requestBody?: {
      content: {
        "application/json": unknown;
      };
    };
    responses: {
      /** @description 200 */
      200: {
        content: {
          "application/json": {
            /** @example finished */
            status?: string;
            prompt?: string[];
            /** @example togethercomputer/RedPajama-INCITE-Instruct-7B-v0.1 */
            model?: string;
            /** @example */
            model_owner?: string;
            tags?: Record<string, never>;
            /**
             * @default 0
             * @example 1
             */
            num_returns?: number;
            args?: {
              /** @example togethercomputer/RedPajama-INCITE-Instruct-7B-v0.1 */
              model?: string;
              /** @example The capital of France is */
              prompt?: string;
              /**
               * @default 0
               * @example 0.8
               */
              temperature?: number;
              /**
               * @default 0
               * @example 0.7
               */
              top_p?: number;
              /**
               * @default 0
               * @example 50
               */
              top_k?: number;
              /**
               * @default 0
               * @example 1
               */
              max_tokens?: number;
            };
            subjobs?: unknown[];
            output?: {
              choices?: {
                  /** @example length */
                  finish_reason?: string;
                  /**
                   * @default 0
                   * @example 0
                   */
                  index?: number;
                  /** @example  Paris */
                  text?: string;
                }[];
              /**
               * @default 0
               * @example 0.06382315792143345
               */
              raw_compute_time?: number;
              /** @example language-model-inference */
              result_type?: string;
            };
          };
        };
      };
      /** @description 400 */
      400: {
        content: {
          "text/plain": unknown;
        };
      };
      /** @description 401 */
      401: {
        content: {
          "text/plain": unknown;
        };
      };
      /** @description 403 */
      403: {
        content: {
          "text/plain": unknown;
        };
      };
      /** @description 500 */
      500: {
        content: {
          "text/plain": unknown;
        };
      };
    };
  };
  /** Model Options */
  "model-options": {
    responses: {
      /** @description 200 */
      200: {
        content: {
          "application/json": unknown;
        };
      };
      /** @description 400 */
      400: {
        content: {
          "application/json": Record<string, never>;
        };
      };
    };
  };
}
