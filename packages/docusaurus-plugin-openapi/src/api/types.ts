/* ============================================================================
 * Copyright (c) Cloud Annotations
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import type { JSONSchema4, JSONSchema6, JSONSchema7 } from "json-schema";

interface Map<T> {
  [key: string]: T;
}

export interface OpenApiObject {
  openapi: string;
  info: InfoObject;
  servers?: ServerObject[];
  paths: PathsObject;
  components?: ComponentsObject;
  security?: SecurityRequirementObject[];
  tags?: TagObject[];
  externalDocs?: ExternalDocumentationObject;
}

export interface OpenApiObjectWithRef {
  openapi: string;
  info: InfoObject;
  servers?: ServerObject[];
  paths: PathsObjectWithRef;
  components?: ComponentsObjectWithRef;
  security?: SecurityRequirementObject[];
  tags?: TagObject[];
  externalDocs?: ExternalDocumentationObject;
}

interface InfoObject {
  title: string;
  description?: string;
  termsOfService?: string;
  contact?: ContactObject;
  license?: LicenseObject;
  version: string;
}

interface ContactObject {
  name?: string;
  url?: string;
  email?: string;
}

interface LicenseObject {
  name: string;
  url?: string;
}

interface ServerObject {
  url: string;
  description?: string;
  variables?: Map<ServerVariable>;
}

interface ServerVariable {
  enum?: string[];
  default: string;
  description?: string;
}

interface ComponentsObject {
  schemas?: Map<SchemaObject>;
  responses?: Map<ResponseObject>;
  parameters?: Map<ParameterObject>;
  examples?: Map<ExampleObject>;
  requestBodies?: Map<RequestBodyObject>;
  headers?: Map<HeaderObject>;
  securitySchemes?: Map<SecuritySchemeObject>;
  links?: Map<LinkObject>;
  callbacks?: Map<CallbackObject>;
}

interface ComponentsObjectWithRef {
  schemas?: Map<SchemaObjectWithRef | ReferenceObject>;
  responses?: Map<ResponseObjectWithRef | ReferenceObject>;
  parameters?: Map<ParameterObjectWithRef | ReferenceObject>;
  examples?: Map<ExampleObject | ReferenceObject>;
  requestBodies?: Map<RequestBodyObjectWithRef | ReferenceObject>;
  headers?: Map<HeaderObjectWithRef | ReferenceObject>;
  securitySchemes?: Map<SecuritySchemeObject | ReferenceObject>;
  links?: Map<LinkObject | ReferenceObject>;
  callbacks?: Map<CallbackObjectWithRef | ReferenceObject>;
}

type PathsObject = Map<PathItemObject>;

type PathsObjectWithRef = Map<PathItemObjectWithRef>;

interface PathItemObject {
  $ref?: string;
  summary?: string;
  description?: string;
  get?: OperationObject;
  put?: OperationObject;
  post?: OperationObject;
  delete?: OperationObject;
  options?: OperationObject;
  head?: OperationObject;
  patch?: OperationObject;
  trace?: OperationObject;
  servers?: ServerObject[];
  parameters?: ParameterObject[];
}

interface PathItemObjectWithRef {
  $ref?: string;
  summary?: string;
  description?: string;
  get?: OperationObjectWithRef;
  put?: OperationObjectWithRef;
  post?: OperationObjectWithRef;
  delete?: OperationObjectWithRef;
  options?: OperationObjectWithRef;
  head?: OperationObjectWithRef;
  patch?: OperationObjectWithRef;
  trace?: OperationObjectWithRef;
  servers?: ServerObject[];
  parameters?: (ParameterObjectWithRef | ReferenceObject)[];
}

interface OperationObject {
  tags?: string[];
  summary?: string;
  description?: string;
  externalDocs?: ExternalDocumentationObject;
  operationId?: string;
  parameters?: ParameterObject[];
  requestBody?: RequestBodyObject;
  responses: ResponsesObject;
  callbacks?: Map<CallbackObject>;
  deprecated?: boolean;
  security?: SecurityRequirementObject[];
  servers?: ServerObject[];

  // extensions
  "x-deprecated-description"?: string;
}

interface OperationObjectWithRef {
  tags?: string[];
  summary?: string;
  description?: string;
  externalDocs?: ExternalDocumentationObject;
  operationId?: string;
  parameters?: (ParameterObjectWithRef | ReferenceObject)[];
  requestBody?: RequestBodyObjectWithRef | ReferenceObject;
  responses: ResponsesObjectWithRef;
  callbacks?: Map<CallbackObjectWithRef | ReferenceObject>;
  deprecated?: boolean;
  security?: SecurityRequirementObject[];
  servers?: ServerObject[];

  // extensions
  "x-deprecated-description"?: string;
}

interface ExternalDocumentationObject {
  description?: string;
  url: string;
}

interface ParameterObject {
  name: string;
  in: string;
  description?: string;
  required?: boolean;
  deprecated?: boolean;
  allowEmptyValue?: boolean;
  //
  style?: string;
  explode?: string;
  allowReserved?: boolean;
  schema?: SchemaObject;
  example?: any;
  examples?: Map<ExampleObject>;
  //
  content?: Map<MediaTypeObject>;
  // ignoring stylings: matrix, label, form, simple, spaceDelimited,
  // pipeDelimited and deepObject
}

interface ParameterObjectWithRef {
  name: string;
  in: string;
  description?: string;
  required?: boolean;
  deprecated?: boolean;
  allowEmptyValue?: boolean;
  //
  style?: string;
  explode?: string;
  allowReserved?: boolean;
  schema?: SchemaObjectWithRef | ReferenceObject;
  example?: any;
  examples?: Map<ExampleObject | ReferenceObject>;
  //
  content?: Map<MediaTypeObjectWithRef>;
  // ignoring stylings: matrix, label, form, simple, spaceDelimited,
  // pipeDelimited and deepObject
}

interface RequestBodyObject {
  description?: string;
  content: Map<MediaTypeObject>;
  required?: boolean;
}

interface RequestBodyObjectWithRef {
  description?: string;
  content: Map<MediaTypeObjectWithRef>;
  required?: boolean;
}

interface MediaTypeObject {
  schema?: SchemaObject;
  example?: any;
  examples?: Map<ExampleObject>;
  encoding?: Map<EncodingObject>;
}

interface MediaTypeObjectWithRef {
  schema?: SchemaObjectWithRef | ReferenceObject;
  example?: any;
  examples?: Map<ExampleObject | ReferenceObject>;
  encoding?: Map<EncodingObjectWithRef>;
}

interface EncodingObject {
  contentType?: string;
  headers?: Map<HeaderObject>;
  style?: string;
  explode?: boolean;
  allowReserved?: boolean;
}

interface EncodingObjectWithRef {
  contentType?: string;
  headers?: Map<HeaderObjectWithRef | ReferenceObject>;
  style?: string;
  explode?: boolean;
  allowReserved?: boolean;
}

type ResponsesObject = Map<ResponseObject>;

type ResponsesObjectWithRef = Map<ResponseObjectWithRef | ReferenceObject>;

interface ResponseObject {
  description: string;
  headers?: Map<HeaderObject>;
  content?: Map<MediaTypeObject>;
  links?: Map<LinkObject>;
}

interface ResponseObjectWithRef {
  description: string;
  headers?: Map<HeaderObjectWithRef | ReferenceObject>;
  content?: Map<MediaTypeObjectWithRef>;
  links?: Map<LinkObject | ReferenceObject>;
}

type CallbackObject = Map<PathItemObject>;

type CallbackObjectWithRef = Map<PathItemObjectWithRef>;

interface ExampleObject {
  summary?: string;
  description?: string;
  value?: any;
  externalValue?: string;
}

interface LinkObject {
  operationRef?: string;
  operationId?: string;
  parameters?: Map<any>;
  requestBody?: any;
  description?: string;
  server?: ServerObject;
}

type HeaderObject = Omit<ParameterObject, "name" | "in">;

type HeaderObjectWithRef = Omit<ParameterObjectWithRef, "name" | "in">;

interface TagObject {
  name: string;
  description?: string;
  externalDocs?: ExternalDocumentationObject;
}

interface ReferenceObject {
  $ref: string;
}

type JSONSchema = JSONSchema4 | JSONSchema6 | JSONSchema7;
type SchemaObject = Omit<
  JSONSchema,
  | "type"
  | "allOf"
  | "oneOf"
  | "anyOf"
  | "not"
  | "items"
  | "properties"
  | "additionalProperties"
> & {
  // OpenAPI specific overrides
  type?: "string" | "number" | "integer" | "boolean" | "object" | "array";
  allOf?: SchemaObject;
  oneOf?: SchemaObject;
  anyOf?: SchemaObject;
  not?: SchemaObject;
  items?: SchemaObject;
  properties?: SchemaObject;
  additionalProperties?: boolean | SchemaObject;

  // OpenAPI additions
  nullable?: boolean;
  discriminator?: DiscriminatorObject;
  readOnly?: boolean;
  writeOnly?: boolean;
  xml?: XMLObject;
  externalDocs?: ExternalDocumentationObject;
  example?: any;
  deprecated?: boolean;
};

type SchemaObjectWithRef = Omit<
  JSONSchema,
  | "type"
  | "allOf"
  | "oneOf"
  | "anyOf"
  | "not"
  | "items"
  | "properties"
  | "additionalProperties"
> & {
  // OpenAPI specific overrides
  type?: "string" | "number" | "integer" | "boolean" | "object" | "array";
  allOf?: SchemaObject | ReferenceObject;
  oneOf?: SchemaObject | ReferenceObject;
  anyOf?: SchemaObject | ReferenceObject;
  not?: SchemaObject | ReferenceObject;
  items?: SchemaObject | ReferenceObject;
  properties?: SchemaObject | ReferenceObject;
  additionalProperties?: boolean | SchemaObject | ReferenceObject;

  // OpenAPI additions
  nullable?: boolean;
  discriminator?: DiscriminatorObject;
  readOnly?: boolean;
  writeOnly?: boolean;
  xml?: XMLObject;
  externalDocs?: ExternalDocumentationObject;
  example?: any;
  deprecated?: boolean;
};

interface DiscriminatorObject {
  propertyName: string;
  mapping?: Map<string>;
}

interface XMLObject {
  name?: string;
  namespace?: string;
  prefix?: string;
  attribute?: boolean;
  wrapped?: boolean;
}

type SecuritySchemeObject =
  | ApiKeySecuritySchemeObject
  | HttpSecuritySchemeObject
  | Oauth2SecuritySchemeObject
  | OpenIdConnectSecuritySchemeObject;

interface ApiKeySecuritySchemeObject {
  type: "apiKey";
  description?: string;
  name: string;
  in: "query" | "header" | "cookie";
}

interface HttpSecuritySchemeObject {
  type: "http";
  description?: string;
  scheme: string;
  bearerFormat?: string;
}

interface Oauth2SecuritySchemeObject {
  type: "oauth2";
  description?: string;
  flows: OAuthFlowsObject;
}

interface OpenIdConnectSecuritySchemeObject {
  type: "openIdConnect";
  description?: string;
  openIdConnectUrl: string;
}

interface OAuthFlowsObject {
  implicit?: OAuthFlowObject;
  password?: OAuthFlowObject;
  clientCredentials?: OAuthFlowObject;
  authorizationCode?: OAuthFlowObject;
}

interface OAuthFlowObject {
  authorizationUrl?: string; // required for some
  tokenUrl?: string; // required for some
  refreshUrl?: string;
  scopes: Map<string>;
}

type SecurityRequirementObject = Map<string[]>;
