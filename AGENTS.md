# Code style

- Use semicolons in TypeScript and JavaScript (Prettier semi: true).
- Separate logical steps with blank lines: declarations from loops/conditions, guard clauses from subsequent work, calculations from conditions, and return statements from preceding work.
- Keep related consecutive declarations together. Do not insert blank lines between every JSX element.
- Preserve component decomposition and colocated SCSS Modules.
- Run npm run format, npm run lint and npm run build after source changes.

- Prefer named arrow functions for components, hooks, helpers and callbacks. Use function declarations only when their semantics (such as hoisting or dynamic this) are needed.
- Name caught exceptions error. Name error text state errorMessage and its setter setErrorMessage to avoid shadowing.
- Name request loading flags isLoading and their setters setIsLoading, including component props. Preserve the standard aria-busy attribute.
