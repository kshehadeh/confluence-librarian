# Confluence Librarian

An Atlassian Forge application that provides some additional features for Confluence for managing content.

## Requirements

See [Set up Forge](https://developer.atlassian.com/platform/forge/set-up-forge/) for instructions to get set up.

## Quick start

- Modify your app frontend by editing the `src/frontend/index.tsx` file.

- Modify your app backend by editing the `src/resolvers/index.ts` file to define resolver functions. See [Forge resolvers](https://developer.atlassian.com/platform/forge/runtime-reference/custom-ui-resolver/) for documentation on resolver functions.

- Build and deploy your app by running:

```bash
forge deploy
```

- Install your app in an Atlassian site by running:

```bash
forge install
```

- Develop your app by running `forge tunnel` to proxy invocations locally:

```bash
forge tunnel
```

### Notes

- Use the `forge deploy` command when you want to persist code changes.
- Use the `forge install` command when you want to install the app on a new site.
- Once the app is installed on a site, the site picks up the new app changes you deploy without needing to rerun the install command.
