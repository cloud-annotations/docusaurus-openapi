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

  background: #0e9b71;
  text-shadow: 1px 1px 0 #0d8d67, 0 1px 0 #0d8d67, 1px 0 0 #0d8d67;
}

.post > .menu__link::after {
  content: "post";

  background: #0272d9;
  text-shadow: 1px 1px 0 #026aca, 0 1px 0 #026aca, 1px 0 0 #026aca;
}

.delete > .menu__link::after {
  content: "delete";

  background: #c71b29;
  text-shadow: 1px 1px 0 #b91926, 0 1px 0 #b91926, 1px 0 0 #b91926;
}

.put > .menu__link::after {
  content: "put";

  background: #674ead;
  text-shadow: 1px 1px 0 #604aa2, 0 1px 0 #604aa2, 1px 0 0 #604aa2;
}

.patch > .menu__link::after {
  content: "patch";

  background: #df7d03;
  text-shadow: 1px 1px 0 #d07503, 0 1px 0 #d07503, 1px 0 0 #d07503;
}

.head > .menu__link::after {
  content: "head";

  background: #384248;
  text-shadow: 1px 1px 0 #313a3f, 0 1px 0 #313a3f, 1px 0 0 #313a3f;
}
```
