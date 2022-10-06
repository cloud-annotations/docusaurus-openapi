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
  box-sizing: border-box;
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

  color: var(--openapi-api-method-get-color);
}

.post > .menu__link::after {
  content: "post";

  color: var(--openapi-api-method-post-color);
}

.delete > .menu__link::after {
  content: "delete";

  color: var(--openapi-api-method-delete-color);
}

.put > .menu__link::after {
  content: "put";

  color: var(--openapi-api-method-put-color);
}

.patch > .menu__link::after {
  content: "patch";

  color: var(--openapi-api-method-patch-color);
}

.head > .menu__link::after {
  content: "head";

  color: var(--openapi-api-method-head-color);
}
```
