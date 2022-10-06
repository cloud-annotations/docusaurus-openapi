---
title: Styling
---

## Demo Styling

The demo site includes custom styling for color coded request methods in the sidebar. To have the same experience in your own site, add the following custom styles to your site:

```css
/* API Menu Items */
.api-method > .menu__link {
  align-items: center;
  justify-content: space-between;
}

.api-method > .menu__link::after {
  border-radius: 8px;
  box-shadow: inset 0 1px 1px 0 rgba(255, 255, 255, 0.2), inset 0 -1px 2px 0
      rgba(0, 0, 0, 0.2), 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
  color: #fff;
  display: inline-flex;
  font-size: 8px;
  font-weight: 600;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu,
    Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  height: 16px;
  justify-content: center;
  line-height: 16px;
  width: 40px;
  min-width: 40px;
  padding: 0 8px;
  text-align: center;
  text-transform: uppercase;
  white-space: nowrap;
  margin-left: 4px;
}

.get > .menu__link::after {
  content: "get";

  background: var(--openapi-api-method-get-background);
  color: var(--openapi-api-method-get-color, #fff);
  text-shadow: var(--openapi-api-method-get-shadow);
}

.post > .menu__link::after {
  content: "post";

  background: var(--openapi-api-method-post-background);
  color: var(--openapi-api-method-post-color, #fff);
  text-shadow: var(--openapi-api-method-post-shadow);
}

.delete > .menu__link::after {
  content: "delete";

  background: var(--openapi-api-method-delete-background);
  color: var(--openapi-api-method-delete-color, #fff);
  text-shadow: var(--openapi-api-method-delete-shadow);
}

.put > .menu__link::after {
  content: "put";

  background: var(--openapi-api-method-put-background);
  color: var(--openapi-api-method-put-color, #fff);
  text-shadow: var(--openapi-api-method-put-shadow);
}

.patch > .menu__link::after {
  content: "patch";

  background: var(--openapi-api-method-patch-background);
  color: var(--openapi-api-method-patch-color, #fff);
  text-shadow: var(--openapi-api-method-patch-shadow);
}

.head > .menu__link::after {
  content: "head";

  background: var(--openapi-api-method-head-background);
  color: var(--openapi-api-method-head-color, #fff);
  text-shadow: var(--openapi-api-method-head-shadow);
}
```
