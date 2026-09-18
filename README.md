# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.

<img width="1846" height="884" alt="image" src="https://github.com/user-attachments/assets/b200fecb-698b-4135-99ed-1f019fb9e9f3" />

<img width="1846" height="884" alt="image" src="https://github.com/user-attachments/assets/b92fd157-7293-45e4-8d48-ce43ba6553be" />
<img width="1846" height="884" alt="image" src="https://github.com/user-attachments/assets/0f33e8a5-a823-494f-8503-4838fea9578b" />
<img width="1846" height="884" alt="image" src="https://github.com/user-attachments/assets/843e7d7b-2174-47d6-9153-481d406e8e30" />
<img width="1846" height="884" alt="image" src="https://github.com/user-attachments/assets/eceda104-ac73-4fa3-9d93-0b382154e144" />
<img width="1846" height="884" alt="image" src="https://github.com/user-attachments/assets/3982c249-deea-47ff-bd4e-3a6ce68f26ac" />
<img width="1846" height="884" alt="image" src="https://github.com/user-attachments/assets/786f56af-d62a-48b1-b039-c30f50e8dbb3" />
<img width="1846" height="884" alt="image" src="https://github.com/user-attachments/assets/160bac38-20b3-4db0-8c54-e1e327c5156b" />






