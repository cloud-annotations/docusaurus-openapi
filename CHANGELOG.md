## 0.7.0 (Dec 13, 2023)

High-level enhancements

- Docusaurus v3 support ([#266](https://github.com/cloud-annotations/docusaurus-openapi/pull/266))
- Allow pressing enter to perform the 'Execute' action ([#255](https://github.com/cloud-annotations/docusaurus-openapi/pull/255))
- Render examples in a `<code>` block ([#256](https://github.com/cloud-annotations/docusaurus-openapi/pull/256))

Other enhancements and bug fixes

- Wrap code examples tabs in narrow browser windows ([#250](https://github.com/cloud-annotations/docusaurus-openapi/pull/250))
- Add border to form inputs when using light theme ([#252](https://github.com/cloud-annotations/docusaurus-openapi/pull/252))
- Fix: Page crash on half surrogate pair ([#261](https://github.com/cloud-annotations/docusaurus-openapi/pull/261))

## 0.6.4 (Mar 15, 2023)

High-level enhancements

- Fixes and enhancements for array query param handling ([#241](https://github.com/cloud-annotations/docusaurus-openapi/pull/241))
  - Respect the `maxItems` property for array query params
  - Add compatibility for `style` and `explode` properties when rendering array query params
  - Fix infinite render loop on pages using array query params

Other enhancements and bug fixes

- Convert some relative imports in theme package ([#237](https://github.com/cloud-annotations/docusaurus-openapi/pull/237))
- Ensure path-level parameters are passed to the theme ([#235](https://github.com/cloud-annotations/docusaurus-openapi/pull/235))
- Hide required labels on response schemas ([#230](https://github.com/cloud-annotations/docusaurus-openapi/pull/230))
- Fix invalid ignore pattern for underscore files ([#233](https://github.com/cloud-annotations/docusaurus-openapi/pull/233))
- Add existing site install instructions ([#229](https://github.com/cloud-annotations/docusaurus-openapi/pull/229))
- Docs: update template version ([#225](https://github.com/cloud-annotations/docusaurus-openapi/pull/225))

## 0.6.3 (Nov 7, 2022)

High-level enhancements

- Compatibility with Docusaurus 2.2.0 ([#223](https://github.com/cloud-annotations/docusaurus-openapi/pull/223))
- Support for loading custom Markdown Files: ([#193](https://github.com/cloud-annotations/docusaurus-openapi/pull/193))

Other enhancements and bug fixes

- Enable multiselect in form-urlencoded body ([#220](https://github.com/cloud-annotations/docusaurus-openapi/pull/220))
- Encode values in query and path parameters ([#219](https://github.com/cloud-annotations/docusaurus-openapi/pull/219))

## 0.6.2 (Aug 11, 2022)

High-level enhancements

- Authorize with api keys in header

Other enhancements and bug fixes

- feat(auth): authorize with api keys in header ([#208](https://github.com/cloud-annotations/docusaurus-openapi/pull/208))
- add example key serverVariablesPersistance in demo ([#204](https://github.com/cloud-annotations/docusaurus-openapi/pull/204))

## 0.6.1 (Aug 3, 2022)

Other enhancements and bug fixes

- Persist server variables configuration ([#202](https://github.com/cloud-annotations/docusaurus-openapi/pull/202))
- fix(theme): new location for theme icons ([#203](https://github.com/cloud-annotations/docusaurus-openapi/pull/203))
- Fix: loading failed for local openapi json file on Windows ([#197](https://github.com/cloud-annotations/docusaurus-openapi/pull/197))
- ensure description from schema is not ignored ([#194](https://github.com/cloud-annotations/docusaurus-openapi/pull/194))
- Fix illegal color value bug ([#196](https://github.com/cloud-annotations/docusaurus-openapi/pull/196))
- chore: update template version ([#195](https://github.com/cloud-annotations/docusaurus-openapi/pull/195))
- Escape html in parameter names ([#189](https://github.com/cloud-annotations/docusaurus-openapi/pull/189))
- Category squashing ([#188](https://github.com/cloud-annotations/docusaurus-openapi/pull/188))

## 0.6.0 (Jun 23, 2022)

High-level enhancements

- Compatibility with Docusaurus 2.0.0-beta.21

Other enhancements and bug fixes

- Compatibility with Docusaurus 2.0.0-beta.21 ([#185](https://github.com/cloud-annotations/docusaurus-openapi/pull/185))
- Resolve `allOf` references ([#184](https://github.com/cloud-annotations/docusaurus-openapi/pull/184))
- Fetch openapi from a URL ([#173](https://github.com/cloud-annotations/docusaurus-openapi/pull/173))
- Fix Cypress test ([#157](https://github.com/cloud-annotations/docusaurus-openapi/pull/157))
- Add display name extension for tags ([#154](https://github.com/cloud-annotations/docusaurus-openapi/pull/154))

## 0.5.0 (Jan 9, 2022)

High-level enhancements

- All theme components are now TypeScript 🎉

Other enhancements and bug fixes

- Fix small theme regression ([#151](https://github.com/cloud-annotations/docusaurus-openapi/pull/151))
- Clear request body when empty ([#147](https://github.com/cloud-annotations/docusaurus-openapi/pull/147))
- Fix code editor background color bug ([#146](https://github.com/cloud-annotations/docusaurus-openapi/pull/146))
- Update theme components to TypeScript ([#130](https://github.com/cloud-annotations/docusaurus-openapi/pull/130))

## 0.4.2 (Dec 30, 2021)

Enhancements and bug fixes

- Update package metadata ([#131](https://github.com/cloud-annotations/docusaurus-openapi/pull/131))
- Fix mobile css bug ([#129](https://github.com/cloud-annotations/docusaurus-openapi/pull/129))

## 0.4.1 (Dec 28, 2021)

Enhancements and bug fixes

- Add `create` command ([#126](https://github.com/cloud-annotations/docusaurus-plugin-openapi/pull/126))
- Update demo ([#124](https://github.com/cloud-annotations/docusaurus-plugin-openapi/pull/124))
- Update README.md ([#123](https://github.com/cloud-annotations/docusaurus-plugin-openapi/pull/123))
- Add README badges ([#122](https://github.com/cloud-annotations/docusaurus-plugin-openapi/pull/122))

## 0.4.0 (Dec 23, 2021)

High-level enhancements

- Docusaurus beta.14 support

  ```js
  // Be sure to update @docusaurus/core:
  "dependencies": {
    "@docusaurus/core": "2.0.0-beta.14",
    // ...
  }
  ```

- With the release of Docusaurus beta.14 (Thanks @slorber!), we can now support configuration of `webpack-dev-server`'s proxy via our `docusaurus-plugin-proxy` plugin.

  This can be useful when you have a separate API backend development server and you want to send API requests on the same domain.

  With the following, a request to `/api/users` will now proxy the request to `http://localhost:3001/api/users`:

  ```js
  // docusaurus.config.js

  const config = {
    plugins: [["docusaurus-plugin-proxy", { "/api": "http://localhost:3001" }]],
    // ...
  };
  ```

  To proxy `/api/users` to `http://localhost:3001/users`, the path can be rewritten:

  ```js
  // docusaurus.config.js

  const config = {
    plugins: [
      [
        "docusaurus-plugin-proxy",
        {
          "/api": {
            target: "http://localhost:3001",
            pathRewrite: { "^/api": "" },
          },
        },
      ],
    ],
    // ...
  };
  ```

  For more config options, see [devServer.proxy](https://webpack.js.org/configuration/dev-server/#devserverproxy).

- Better yarn 3 support

Other enhancements and bug fixes

- Bump to beta 14 and fix proxy plugin ([#120](https://github.com/cloud-annotations/docusaurus-plugin-openapi/pull/120))
- Fix dependency resolutions ([#119](https://github.com/cloud-annotations/docusaurus-plugin-openapi/pull/119))

## 0.3.1 (Dec 21, 2021)

High-level enhancements

- Added support for more schema qualifiers:

  ```
  - maxLength
  - minLength
  - maximum
  - minumum
  - exclusiveMaximum
  - exclusiveMinimum
  - pattern
  ```

  Example:

  ```yaml
  slug:
    type: string
    description: The human-readable, unique identifier, used to identify the document.
    minLength: 1
    maxLength: 40
    pattern: "^[a-zA-Z0-9_-]*$"
  ```

  Displays:
  <table><tbody><tr><td>

  `slug` string

  **Possible values:** 1 ≤ length ≤ 40, Value must match regular expression `^[a-zA-Z0-9_-]*$`

  The human-readable, unique identifier, used to identify the document.

  </td></tr></tbody></table>

Other enhancements and bug fixes

- Add additional schema qualifiers ([#112](https://github.com/cloud-annotations/docusaurus-plugin-openapi/pull/112))
- Sidebar generation refactor ([#111](https://github.com/cloud-annotations/docusaurus-plugin-openapi/pull/111))
- Add recursive folder structure reading & labeling support ([#107](https://github.com/cloud-annotations/docusaurus-plugin-openapi/pull/107))
- Add experimental support for loading a multiple OpenAPI definitions ([#103](https://github.com/cloud-annotations/docusaurus-plugin-openapi/pull/103))
- Add sidebar item classname for method ([#104](https://github.com/cloud-annotations/docusaurus-plugin-openapi/pull/104))
- Fix schema name bug with allOf ([#102](https://github.com/cloud-annotations/docusaurus-plugin-openapi/pull/102))

## 0.3.0 (Dec 16, 2021)

High-level enhancements

- Docusaurus beta.13 support (Thanks @Josh-Cena!)

  ```js
  // Be sure to update @docusaurus/core:
  "dependencies": {
    "@docusaurus/core": "2.0.0-beta.13",
    // ...
  }
  ```

- The OpenAPI `info` stanza will now generate an "Introduction" page

  ```yaml
  openapi: 3.0.3
  info:
    title: Swagger Petstore
    version: 1.0.0
    description: |
      This is a sample server Petstore server.
      You can find out more about Swagger at
      [http://swagger.io](http://swagger.io) or on [irc.freenode.net, #swagger](http://swagger.io/irc/).
      For this sample, you can use the api key `special-key` to test the authorization filters.
  ```

- Request bodies will now render JSON Schema with the use of `allOf` keywords

  ```yaml
  requestBody:
    content:
      description: Example request
      application/json:
        schema:
          allOf:
            - $ref: "#/components/schema/Example1"
            - $ref: "#/components/schema/Example2"
  ```

- Enum options will now be displayed in schema tables
  <table>
  <tbody>
  <tr>
  <td>

  `status` string

  Enum: `"available"`, `"pending"`, `"sold"`

  Pet status in the store

  </td>
  </tr>
  </tbody>
  </table>

Other enhancements and bug fixes

- Initial proxy code ([#97](https://github.com/cloud-annotations/docusaurus-plugin-openapi/pull/97))
- Add support for an introduction page ([#94](https://github.com/cloud-annotations/docusaurus-plugin-openapi/pull/94))
- Add `allOf` JSON schema support ([#96](https://github.com/cloud-annotations/docusaurus-plugin-openapi/pull/96))
- Display enum values in tables ([#93](https://github.com/cloud-annotations/docusaurus-plugin-openapi/pull/93))
- Initial plugin refactor ([#86](https://github.com/cloud-annotations/docusaurus-plugin-openapi/pull/86))
- Upgrade to Docusaurus beta.13 ([#88](https://github.com/cloud-annotations/docusaurus-plugin-openapi/pull/88))

## 0.2.3 (Dec 11, 2021)

Enhancements and bug fixes

- Add case-insensitive security scheme support ([#83](https://github.com/cloud-annotations/docusaurus-plugin-openapi/pull/83))
- Add CodeSandbox CI ([#77](https://github.com/cloud-annotations/docusaurus-plugin-openapi/pull/77))

## 0.2.2 (Dec 6, 2021)

Fix broken package

## 0.2.1 (Dec 5, 2021)

High-level enhancements

- The demo panel now allows you to choose the security scheme from a dropdown that is populated by the OpenAPI definition (only showing the dropdown if more than one is listed)
- Adds support for using multiple auth modes simultaneously (Eg: `(BearerAuth) OR (ApiKeyAuth AND BasicAuth)`)
- Adds an `authPersistence` option to `themeConfig.api`. Defaults to `"localStorage"`, can be set to `false` to disable or `sessionStorage` to only persist while the window is open.

Other enhancements and bug fixes

- Add better auth support ([#74](https://github.com/cloud-annotations/docusaurus-plugin-openapi/pull/74))

## 0.2.0 (Dec 4, 2021)

### 💥 Breaking Changes

The plugin option `openapiPath` has been renamed to `path` and no longer needs to be wrapped in `require.resolve`.

As recomended my the [Docusaurus documentation](https://docusaurus.io/docs/presets), the plugin `docusaurus-plugin-api` has been properly split into 3 packages:

- `docusaurus-preset-api`
- `docusaurus-plugin-api`
- `docusaurus-theme-api`

The package `docusaurus-plugin-api` will no longer work on it's own without `docusaurus-theme-api`. Instead, the preset `docusaurus-preset-api` can be used on it's own and act as a drop-in replacement for `@docusaurus/preset-classic`.

Example usage:

```diff
// docusaurus.config.js

const config = {
-  plugins: [
-    [
-      "docusaurus-plugin-openapi",
-      {
-        openapiPath: require.resolve("./examples/openapi.json"),
-      },
-    ],
-  ],

  presets: [
    [
-      "@docusaurus/preset-classic",
+      "docusaurus-preset-openapi",
      {
+        api: {
+          path: "examples/openapi.json",
+        }
        docs: {
          // doc options ...
        },
        blog: {
         // blog options ...
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
  ],
}
```

Other enhancements and bug fixes

- Fix multi plugin bug ([#69](https://github.com/cloud-annotations/docusaurus-plugin-openapi/pull/69))
- Add yaml support ([#68](https://github.com/cloud-annotations/docusaurus-plugin-openapi/pull/68))
- Generate markdown for full page ([#65](https://github.com/cloud-annotations/docusaurus-plugin-openapi/pull/65))
- Refactor plugin into separate packages ([#64](https://github.com/cloud-annotations/docusaurus-plugin-openapi/pull/64))
- Update documentation ([#63](https://github.com/cloud-annotations/docusaurus-plugin-openapi/pull/63))

## 0.1.1 (Nov 24, 2021)

Enhancements and bug fixes

- Fix missing status code description ([#61](https://github.com/cloud-annotations/docusaurus-plugin-openapi/pull/61))
- Fix narrow tables style regression ([#55](https://github.com/cloud-annotations/docusaurus-plugin-openapi/pull/55))

## 0.1.0 (Nov 4, 2021)

Enhancements and bug fixes

- Update project structure ([#52](https://github.com/cloud-annotations/docusaurus-plugin-openapi/pull/52))
- Update plugin to support Docusaurus 2.0.0 beta ([#51](https://github.com/cloud-annotations/docusaurus-plugin-openapi/pull/51))
