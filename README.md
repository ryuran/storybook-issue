# Repro: `@storybook/angular-vite` Vitest run fails to resolve `styles` set by the serve builder

Minimal Angular workspace (app in `apps/my-app`, `angular.json` at the root), built from the
`angular-vite/default-ts` sandbox of https://github.com/storybookjs/sandboxes (Storybook
`11.0.0-beta.3`). The same error was first seen with Storybook `10.6.6` in an Nx workspace.

## Steps

```sh
npm install
npx playwright install chromium

npm run test:storybook             # passes: styles come from storybookAngularVitest({ styles: ['src/styles.scss'] })
npm run test:storybook:serve-env   # fails
```

`test:storybook:serve-env` sets `STORYBOOK_ANGULAR_BUILDER_OPTIONS_JSON` the same way the
`@storybook/angular-vite:start-storybook` builder does for the `storybook` target in `angular.json`
(`styles` is workspace-root-relative). `@storybook/addon-vitest` spawns Vitest from the Storybook
testing panel with `extendEnv: true`, so the variable is inherited there too: run `npm run storybook`
and start the tests from the UI.

## Result

```
Failed to resolve import "apps/my-app/src/styles.scss" from "apps/my-app/.storybook/preview.ts". Does the file exist?
  2  |              import 'apps/my-app/src/styles.scss';
```

The file exists. `angularOptionsPlugin` resolves `styles` against `userConfig.root`, which Vitest sets to
`apps/my-app`, so `resolveBuilderStyle()` doesn't find it and returns the bare path unchanged.
`storybookAngularVitest()` also ignores its own options when the variable is already set.
