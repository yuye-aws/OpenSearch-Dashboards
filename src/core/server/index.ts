/*
 * SPDX-License-Identifier: Apache-2.0
 *
 * The OpenSearch Contributors require contributions made to
 * this file be licensed under the Apache-2.0 license or a
 * compatible open source license.
 *
 * Any modifications Copyright OpenSearch Contributors. See
 * GitHub history for details.
 */

/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/**
 * The OpenSearch Dashboards Core APIs for server-side plugins.
 *
 * A plugin requires a `opensearch_dashboards.json` file at it's root directory that follows
 * {@link PluginManifest | the manfiest schema} to define static plugin
 * information required to load the plugin.
 *
 * A plugin's `server/index` file must contain a named import, `plugin`, that
 * implements {@link PluginInitializer} which returns an object that implements
 * {@link Plugin}.
 *
 * The plugin integrates with the core system via lifecycle events: `setup`,
 * `start`, and `stop`. In each lifecycle method, the plugin will receive the
 * corresponding core services available (either {@link CoreSetup} or
 * {@link CoreStart}) and any interfaces returned by dependency plugins'
 * lifecycle method. Anything returned by the plugin's lifecycle method will be
 * exposed to downstream dependencies when their corresponding lifecycle methods
 * are invoked.
 *
 * @packageDocumentation
 */

import { Type } from '@osd/config-schema';
import {
  OpenSearchServiceSetup,
  ILegacyScopedClusterClient,
  configSchema as opensearchsearchConfigSchema,
  OpenSearchServiceStart,
  IScopedClusterClient,
} from './opensearch';
import { HttpServiceSetup, HttpServiceStart } from './http';
import { HttpResources } from './http_resources';

import { PluginsServiceSetup, PluginsServiceStart, PluginOpaqueId } from './plugins';
import { ContextSetup } from './context';
import { IUiSettingsClient, UiSettingsServiceSetup, UiSettingsServiceStart } from './ui_settings';
import { SavedObjectsClientContract } from './saved_objects/types';
import {
  ISavedObjectTypeRegistry,
  SavedObjectsServiceSetup,
  SavedObjectsServiceStart,
} from './saved_objects';
import {
  AsyncLocalStorageContext,
  DynamicConfigServiceSetup,
  DynamicConfigServiceStart,
  IDynamicConfigurationClient,
} from './config';
import { CapabilitiesSetup, CapabilitiesStart } from './capabilities';
import { MetricsServiceSetup, MetricsServiceStart } from './metrics';
import { StatusServiceSetup } from './status';
import { Auditor, AuditTrailSetup, AuditTrailStart } from './audit_trail';
import { AppenderConfigType, appendersSchema, LoggingServiceSetup } from './logging';
import { CoreUsageDataStart } from './core_usage_data';
import { SecurityServiceSetup } from './security/types';
import { CrossCompatibilityServiceStart } from './cross_compatibility/types';

// Because of #79265 we need to explicity import, then export these types for
// scripts/telemetry_check.js to work as expected
import {
  CoreUsageData,
  CoreConfigUsageData,
  CoreEnvironmentUsageData,
  CoreServicesUsageData,
} from './core_usage_data';
import { WorkspaceSetup, WorkspaceStart } from './workspace';

export { CoreUsageData, CoreConfigUsageData, CoreEnvironmentUsageData, CoreServicesUsageData };

export { AuditableEvent, Auditor, AuditorFactory, AuditTrailSetup } from './audit_trail';
export { bootstrap } from './bootstrap';
export { Capabilities, CapabilitiesProvider, CapabilitiesSwitcher } from './capabilities';
export {
  ConfigPath,
  ConfigService,
  ConfigDeprecation,
  ConfigDeprecationProvider,
  ConfigDeprecationLogger,
  ConfigDeprecationFactory,
  EnvironmentMode,
  PackageInfo,
  IDynamicConfigurationClient,
  DynamicConfigurationClientOptions,
  ConfigIdentifier,
  GetConfigProps,
  BulkGetConfigProps,
  IDynamicConfigStoreClient,
  IDynamicConfigStoreClientFactory,
} from './config';
export {
  IContextContainer,
  IContextProvider,
  HandlerFunction,
  HandlerContextType,
  HandlerParameters,
} from './context';
export { CoreId } from './core_context';
export { CspConfig, ICspConfig } from './csp';
export {
  LegacyClusterClient,
  ILegacyClusterClient,
  ILegacyCustomClusterClient,
  LegacyScopedClusterClient,
  ILegacyScopedClusterClient,
  OpenSearchConfig,
  LegacyOpenSearchClientConfig,
  LegacyOpenSearchError,
  LegacyOpenSearchErrorHelpers,
  OpenSearchServiceSetup,
  OpenSearchServiceStart,
  OpenSearchStatusMeta,
  NodesVersionCompatibility,
  LegacyAPICaller,
  FakeRequest,
  ScopeableRequest,
  OpenSearchClient,
  IClusterClient,
  ICustomClusterClient,
  OpenSearchClientConfig,
  IScopedClusterClient,
  SearchResponse,
  CountResponse,
  ShardsInfo,
  ShardsResponse,
  Explanation,
  GetResponse,
  DeleteDocumentResponse,
} from './opensearch';
export * from './opensearch/legacy/api_types';
export {
  AuthenticationHandler,
  AuthHeaders,
  AuthResultParams,
  AuthStatus,
  AuthToolkit,
  AuthRedirected,
  AuthRedirectedParams,
  AuthResult,
  AuthResultType,
  Authenticated,
  AuthNotHandled,
  BasePath,
  IBasePath,
  CustomHttpResponseOptions,
  GetAuthHeaders,
  GetAuthState,
  Headers,
  HttpAuth,
  HttpResponseOptions,
  HttpResponsePayload,
  HttpServerInfo,
  HttpServiceSetup,
  HttpServiceStart,
  ErrorHttpResponseOptions,
  IOpenSearchDashboardsSocket,
  IsAuthenticated,
  OpenSearchDashboardsRequest,
  OpenSearchDashboardsRequestEvents,
  OpenSearchDashboardsRequestRoute,
  OpenSearchDashboardsRequestRouteOptions,
  IOpenSearchDashboardsResponse,
  LifecycleResponseFactory,
  KnownHeaders,
  LegacyRequest,
  OnPreAuthHandler,
  OnPreAuthToolkit,
  OnPreRoutingHandler,
  OnPreRoutingToolkit,
  OnPostAuthHandler,
  OnPostAuthToolkit,
  OnPreResponseHandler,
  OnPreResponseToolkit,
  OnPreResponseRender,
  OnPreResponseExtensions,
  OnPreResponseInfo,
  RedirectResponseOptions,
  RequestHandler,
  RequestHandlerWrapper,
  RequestHandlerContextContainer,
  RequestHandlerContextProvider,
  ResponseError,
  ResponseErrorAttributes,
  ResponseHeaders,
  opensearchDashboardsResponseFactory,
  OpenSearchDashboardsResponseFactory,
  RouteConfig,
  IRouter,
  RouteRegistrar,
  RouteMethod,
  RouteConfigOptions,
  RouteConfigOptionsBody,
  RouteContentType,
  validBodyOutput,
  RouteValidatorConfig,
  RouteValidationSpec,
  RouteValidationFunction,
  RouteValidatorOptions,
  RouteValidatorFullConfig,
  RouteValidationResultFactory,
  RouteValidationError,
  SessionStorage,
  SessionStorageCookieOptions,
  SessionCookieValidationResult,
  SessionStorageFactory,
  DestructiveRouteMethod,
  SafeRouteMethod,
} from './http';

export {
  HttpResourcesRenderOptions,
  HttpResourcesResponseOptions,
  HttpResourcesServiceToolkit,
  HttpResourcesRequestHandler,
} from './http_resources';

export { IRenderOptions } from './rendering';
export {
  Logger,
  LoggerFactory,
  LogMeta,
  LogRecord,
  LogLevel,
  LoggingServiceSetup,
  LoggerContextConfigInput,
  LoggerConfigType,
  AppenderConfigType,
} from './logging';

export {
  DiscoveredPlugin,
  Plugin,
  PluginConfigDescriptor,
  PluginConfigSchema,
  PluginInitializer,
  PluginInitializerContext,
  PluginManifest,
  PluginName,
  SharedGlobalConfig,
} from './plugins';

export {
  SavedObjectsBulkCreateObject,
  SavedObjectsBulkGetObject,
  SavedObjectsBulkUpdateObject,
  SavedObjectsBulkUpdateOptions,
  SavedObjectsBulkResponse,
  SavedObjectsBulkUpdateResponse,
  SavedObjectsCheckConflictsObject,
  SavedObjectsCheckConflictsResponse,
  SavedObjectsClient,
  SavedObjectsClientProviderOptions,
  SavedObjectsClientWrapperFactory,
  SavedObjectsClientWrapperOptions,
  SavedObjectsClientFactory,
  SavedObjectsClientFactoryProvider,
  SavedObjectsCreateOptions,
  SavedObjectsErrorHelpers,
  SavedObjectsExportOptions,
  SavedObjectsExportResultDetails,
  SavedObjectsFindResult,
  SavedObjectsFindResponse,
  SavedObjectsImportConflictError,
  SavedObjectsImportAmbiguousConflictError,
  SavedObjectsImportError,
  SavedObjectsImportMissingReferencesError,
  SavedObjectsImportOptions,
  SavedObjectsImportResponse,
  SavedObjectsImportRetry,
  SavedObjectsImportSuccess,
  SavedObjectsImportUnknownError,
  SavedObjectsImportUnsupportedTypeError,
  SavedObjectMigrationContext,
  SavedObjectsMigrationLogger,
  SavedObjectsRawDoc,
  SavedObjectSanitizedDoc,
  SavedObjectUnsanitizedDoc,
  SavedObjectsRepositoryFactory,
  SavedObjectsResolveImportErrorsOptions,
  SavedObjectsSerializer,
  SavedObjectsUpdateOptions,
  SavedObjectsUpdateResponse,
  SavedObjectsAddToNamespacesOptions,
  SavedObjectsAddToNamespacesResponse,
  SavedObjectsDeleteFromNamespacesOptions,
  SavedObjectsDeleteFromNamespacesResponse,
  SavedObjectsServiceStart,
  SavedObjectsServiceSetup,
  SavedObjectStatusMeta,
  SavedObjectsDeleteOptions,
  ISavedObjectsRepository,
  SavedObjectsRepository,
  SavedObjectsDeleteByNamespaceOptions,
  SavedObjectsIncrementCounterOptions,
  SavedObjectsFieldMapping,
  SavedObjectsTypeMappingDefinition,
  SavedObjectsMappingProperties,
  SavedObjectTypeRegistry,
  ISavedObjectTypeRegistry,
  SavedObjectsNamespaceType,
  SavedObjectsType,
  SavedObjectsTypeManagementDefinition,
  SavedObjectMigrationMap,
  SavedObjectMigrationFn,
  SavedObjectsUtils,
  exportSavedObjectsToStream,
  importSavedObjectsFromStream,
  resolveSavedObjectsImportErrors,
  ACL,
  Principals,
  PrincipalType,
  Permissions,
  SavedObjectsDeleteByWorkspaceOptions,
  updateDataSourceNameInVegaSpec,
  extractVegaSpecFromSavedObject,
  extractTimelineExpression,
  updateDataSourceNameInTimeline,
} from './saved_objects';

export {
  IUiSettingsClient,
  UiSettingsParams,
  PublicUiSettingsParams,
  UiSettingsType,
  UiSettingsServiceSetup,
  UiSettingsServiceStart,
  UserProvidedValues,
  ImageValidation,
  DeprecationSettings,
  StringValidation,
  StringValidationRegex,
  StringValidationRegexString,
  CURRENT_USER_PLACEHOLDER,
  UiSettingScope,
  CURRENT_WORKSPACE_PLACEHOLDER,
} from './ui_settings';

export {
  OpsMetrics,
  OpsOsMetrics,
  OpsServerMetrics,
  OpsProcessMetrics,
  MetricsServiceSetup,
  MetricsServiceStart,
} from './metrics';

export {
  AppCategory,
  WorkspaceAttribute,
  PermissionModeId,
  WorkspaceFindOptions,
  WorkspacePermissionMode,
} from '../types';
export {
  DEFAULT_APP_CATEGORIES,
  WORKSPACE_TYPE,
  DEFAULT_NAV_GROUPS,
  WORKSPACE_PATH_PREFIX,
  WORKSPACE_USE_CASE_PREFIX,
  getUseCaseFeatureConfig,
} from '../utils';

export {
  SavedObject,
  SavedObjectAttribute,
  SavedObjectAttributes,
  SavedObjectAttributeSingle,
  SavedObjectReference,
  SavedObjectsBaseOptions,
  MutatingOperationRefreshSetting,
  SavedObjectsClientContract,
  SavedObjectsFindOptions,
  SavedObjectsMigrationVersion,
} from './types';

export { LegacyServiceSetupDeps, LegacyServiceStartDeps, LegacyConfig } from './legacy';

export {
  CoreStatus,
  ServiceStatus,
  ServiceStatusLevel,
  ServiceStatusLevels,
  StatusServiceSetup,
} from './status';

export { CoreUsageDataStart } from './core_usage_data';

/**
 * Plugin specific context passed to a route handler.
 *
 * Provides the following clients and services:
 *    - {@link SavedObjectsClient | savedObjects.client} - Saved Objects client
 *      which uses the credentials of the incoming request
 *    - {@link ISavedObjectTypeRegistry | savedObjects.typeRegistry} - Type registry containing
 *      all the registered types.
 *    - {@link IScopedClusterClient | opensearch.client} - OpenSearch
 *      data client which uses the credentials of the incoming request
 *    - {@link LegacyScopedClusterClient | opensearch.legacy.client} - The legacy OpenSearch
 *      data client which uses the credentials of the incoming request
 *    - {@link IUiSettingsClient | uiSettings.client} - uiSettings client
 *      which uses the credentials of the incoming request
 *    - {@link Auditor | uiSettings.auditor} - AuditTrail client scoped to the incoming request
 *    - {@link IDynamicConfigurationClient | dynamicConfig.client} - Dynamic configuration client
 *
 * @public
 */
export interface RequestHandlerContext {
  core: {
    savedObjects: {
      client: SavedObjectsClientContract;
      typeRegistry: ISavedObjectTypeRegistry;
    };
    opensearch: {
      client: IScopedClusterClient;
      legacy: {
        client: ILegacyScopedClusterClient;
      };
    };
    uiSettings: {
      client: IUiSettingsClient;
    };
    dynamicConfig: {
      client: IDynamicConfigurationClient;
      asyncLocalStore: AsyncLocalStorageContext | undefined;
    };
    auditor: Auditor;
  };
}

/**
 * Context passed to the plugins `setup` method.
 *
 * @typeParam TPluginsStart - the type of the consuming plugin's start dependencies. Should be the same
 *                            as the consuming {@link Plugin}'s `TPluginsStart` type. Used by `getStartServices`.
 * @typeParam TStart - the type of the consuming plugin's start contract. Should be the same as the
 *                     consuming {@link Plugin}'s `TStart` type. Used by `getStartServices`.
 * @public
 */
export interface CoreSetup<TPluginsStart extends object = object, TStart = unknown> {
  /** {@link CapabilitiesSetup} */
  capabilities: CapabilitiesSetup;
  /** {@link ContextSetup} */
  context: ContextSetup;
  /** {@link OpenSearchServiceSetup} */
  opensearch: OpenSearchServiceSetup;
  /** {@link HttpServiceSetup} */
  http: HttpServiceSetup & {
    /** {@link HttpResources} */
    resources: HttpResources;
  };
  /** {@link LoggingServiceSetup} */
  logging: LoggingServiceSetup;
  /** {@link MetricsServiceSetup} */
  metrics: MetricsServiceSetup;
  /** {@link SavedObjectsServiceSetup} */
  savedObjects: SavedObjectsServiceSetup;
  /** {@link SecurityServiceSetup} */
  security: SecurityServiceSetup;
  /** {@link StatusServiceSetup} */
  status: StatusServiceSetup;
  /** {@link UiSettingsServiceSetup} */
  uiSettings: UiSettingsServiceSetup;
  /** {@link StartServicesAccessor} */
  getStartServices: StartServicesAccessor<TPluginsStart, TStart>;
  /** {@link AuditTrailSetup} */
  auditTrail: AuditTrailSetup;
  /** {@link DynamicConfigServiceSetup} */
  dynamicConfigService: DynamicConfigServiceSetup;
  /** {@link WorkspaceSetup} */
  workspace: WorkspaceSetup;
}

/**
 * Allows plugins to get access to APIs available in start inside async handlers.
 * Promise will not resolve until Core and plugin dependencies have completed `start`.
 * This should only be used inside handlers registered during `setup` that will only be executed
 * after `start` lifecycle.
 *
 * @public
 */
export type StartServicesAccessor<
  TPluginsStart extends object = object,
  TStart = unknown
> = () => Promise<[CoreStart, TPluginsStart, TStart]>;

/**
 * Context passed to the plugins `start` method.
 *
 * @public
 */
export interface CoreStart {
  /** {@link CapabilitiesStart} */
  capabilities: CapabilitiesStart;
  /** {@link OpenSearchServiceStart} */
  opensearch: OpenSearchServiceStart;
  /** {@link HttpServiceStart} */
  http: HttpServiceStart;
  /** {@link MetricsServiceStart} */
  metrics: MetricsServiceStart;
  /** {@link SavedObjectsServiceStart} */
  savedObjects: SavedObjectsServiceStart;
  /** {@link UiSettingsServiceStart} */
  uiSettings: UiSettingsServiceStart;
  /** {@link AuditTrailSetup} */
  auditTrail: AuditTrailStart;
  /** @internal {@link CoreUsageDataStart} */
  coreUsageData: CoreUsageDataStart;
  /** {@link CrossCompatibilityServiceStart} */
  crossCompatibility: CrossCompatibilityServiceStart;
  /** {@link DynamicConfigServiceStart} */
  dynamicConfig: DynamicConfigServiceStart;
  /** {@link WorkspaceStart} */
  workspace: WorkspaceStart;
}

export {
  CapabilitiesSetup,
  CapabilitiesStart,
  ContextSetup,
  HttpResources,
  PluginsServiceSetup,
  PluginsServiceStart,
  PluginOpaqueId,
  AuditTrailStart,
  CrossCompatibilityServiceStart,
};

/**
 * Config schemas for the platform services.
 *
 * @alpha
 */
export const config = {
  opensearch: {
    schema: opensearchsearchConfigSchema,
  },
  logging: {
    appenders: appendersSchema as Type<AppenderConfigType>,
  },
};
