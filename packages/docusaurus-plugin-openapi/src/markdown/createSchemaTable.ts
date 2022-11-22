/* ============================================================================
 * Copyright (c) Cloud Annotations
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import { escape } from "lodash";

import { MediaTypeObject, SchemaObject } from "../openapi/types";
import { createDescription } from "./createDescription";
import { createFullWidthTable } from "./createFullWidthTable";
import { getQualifierMessage, getSchemaName } from "./schema";
import { create, guard } from "./utils";

function resolveAllOf(allOf: SchemaObject[]) {
  // TODO: naive implementation (only supports objects, no directly nested allOf)
  const properties = allOf.reduce((acc, cur) => {
    if (cur.properties !== undefined) {
      const next = { ...acc, ...cur.properties };
      return next;
    }
    return acc;
  }, {});

  const required = allOf.reduce((acc, cur) => {
    if (Array.isArray(cur.required)) {
      const next = [...acc, ...cur.required];
      return next;
    }
    return acc;
  }, [] as string[]);

  return { properties, required };
}

interface RowOptions {
  showRequiredLabel?: boolean;
}

const defaultRowOptions: RowOptions = { showRequiredLabel: true };

interface RowProps {
  name: string;
  schema: SchemaObject;
  required: boolean;
  options?: RowOptions;
}

function createRow({
  name,
  schema,
  required,
  options = defaultRowOptions,
}: RowProps) {
  return create("tr", {
    children: create("td", {
      children: [
        create("code", { children: escape(name) }),
        create("span", {
          style: { opacity: "0.6" },
          children: ` ${getSchemaName(schema, true)}`,
        }),
        guard(required && options.showRequiredLabel, () => [
          create("span", {
            style: { opacity: "0.6" },
            children: " — ",
          }),
          create("strong", {
            style: {
              fontSize: "var(--ifm-code-font-size)",
              color: "var(--openapi-required)",
            },
            children: " REQUIRED",
          }),
        ]),
        guard(getQualifierMessage(schema), (message) =>
          create("div", {
            style: { marginTop: "var(--ifm-table-cell-padding)" },
            children: createDescription(message),
          })
        ),
        guard(schema.description, (description) =>
          create("div", {
            style: { marginTop: "var(--ifm-table-cell-padding)" },
            children: createDescription(description),
          })
        ),
        createRows({ schema: schema, options }),
      ],
    }),
  });
}

interface RowsProps {
  schema: SchemaObject;
  options?: RowOptions;
}

function createRows({
  schema,
  options = defaultRowOptions,
}: RowsProps): string | undefined {
  // object
  if (schema.properties !== undefined) {
    return createFullWidthTable({
      style: {
        marginTop: "var(--ifm-table-cell-padding)",
        marginBottom: "0px",
      },
      children: create("tbody", {
        children: Object.entries(schema.properties).map(([key, val]) =>
          createRow({
            name: key,
            schema: val,
            required: Array.isArray(schema.required)
              ? schema.required.includes(key)
              : false,
            options,
          })
        ),
      }),
    });
  }

  // TODO: This can be a bit complicated types can be missmatched and there can be nested allOfs which need to be resolved before merging properties
  if (schema.allOf !== undefined) {
    const { properties, required } = resolveAllOf(schema.allOf);
    return createFullWidthTable({
      style: {
        marginTop: "var(--ifm-table-cell-padding)",
        marginBottom: "0px",
      },
      children: create("tbody", {
        children: Object.entries(properties).map(([key, val]) =>
          createRow({
            name: key,
            schema: val,
            required: Array.isArray(required) ? required.includes(key) : false,
            options,
          })
        ),
      }),
    });
  }

  // array
  if (schema.items !== undefined) {
    return createRows({ schema: schema.items, options });
  }

  // primitive
  return undefined;
}

interface RowsRootProps {
  schema: SchemaObject;
  options?: RowOptions;
}

function createRowsRoot({
  schema,
  options = defaultRowOptions,
}: RowsRootProps) {
  // object
  if (schema.properties !== undefined) {
    return Object.entries(schema.properties).map(([key, val]) =>
      createRow({
        name: key,
        schema: val,
        required: Array.isArray(schema.required)
          ? schema.required.includes(key)
          : false,
        options,
      })
    );
  }

  // TODO: This can be a bit complicated types can be missmatched and there can be nested allOfs which need to be resolved before merging properties
  if (schema.allOf !== undefined) {
    const { properties, required } = resolveAllOf(schema.allOf);
    return Object.entries(properties).map(([key, val]) =>
      createRow({
        name: key,
        schema: val,
        required: Array.isArray(required) ? required.includes(key) : false,
        options,
      })
    );
  }

  // array
  if (schema.items !== undefined) {
    return create("tr", {
      children: create("td", {
        children: [
          create("span", {
            style: { opacity: "0.6" },
            children: ` ${getSchemaName(schema, true)}`,
          }),
          createRows({ schema: schema.items, options }),
        ],
      }),
    });
  }

  // primitive
  return create("tr", {
    children: create("td", {
      children: [
        create("span", {
          style: { opacity: "0.6" },
          children: ` ${schema.type}`,
        }),
        guard(getQualifierMessage(schema), (message) =>
          create("div", {
            style: { marginTop: "var(--ifm-table-cell-padding)" },
            children: createDescription(message),
          })
        ),
        guard(schema.description, (description) =>
          create("div", {
            style: { marginTop: "var(--ifm-table-cell-padding)" },
            children: createDescription(description),
          })
        ),
      ],
    }),
  });
}

interface Props {
  style?: any;
  title: string;
  body: {
    content?: {
      [key: string]: MediaTypeObject;
    };
    description?: string;
    required?: boolean;
  };
  options?: RowOptions;
}

export function createSchemaTable({
  title,
  body,
  options = defaultRowOptions,
  ...rest
}: Props) {
  if (body === undefined || body.content === undefined) {
    return undefined;
  }

  // TODO:
  // NOTE: We just pick a random content-type.
  // How common is it to have multiple?
  const randomFirstKey = Object.keys(body.content)[0];

  const firstBody = body.content[randomFirstKey].schema;

  if (firstBody === undefined) {
    return undefined;
  }

  // we don't show the table if there is no properties to show
  if (firstBody.properties !== undefined) {
    if (Object.keys(firstBody.properties).length === 0) {
      return undefined;
    }
  }

  return createFullWidthTable({
    ...rest,
    children: [
      create("thead", {
        children: create("tr", {
          children: create("th", {
            style: { textAlign: "left" },
            children: [
              `${title} `,
              guard(body.required && options.showRequiredLabel, () => [
                create("span", {
                  style: { opacity: "0.6" },
                  children: " — ",
                }),
                create("strong", {
                  style: {
                    fontSize: "var(--ifm-code-font-size)",
                    color: "var(--openapi-required)",
                  },
                  children: " REQUIRED",
                }),
              ]),
              create("div", {
                children: createDescription(body.description),
              }),
            ],
          }),
        }),
      }),
      create("tbody", {
        children: createRowsRoot({ schema: firstBody, options }),
      }),
    ],
  });
}
