# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project
npx sv create my-app
```

To recreate this project with the same configuration:

```sh
# recreate this project
npx sv@1.1.1 create --template minimal --types ts --install npm svelte-urlaub-test
```

## Adding features

Add features to your project with `sv add`:

```sh
npx sv add
```

For example, to add Tailwind CSS:

```sh
npx sv add tailwindcss
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

## Deploying the chat backend

Firebase Hosting serves the static SvelteKit build. The `/api/chat` endpoint runs as a
Firebase HTTPS Function and requires the `GEMINI_API_KEY` secret:

```sh
firebase functions:secrets:set GEMINI_API_KEY
npm run build
firebase deploy --only functions,hosting
```

The Firebase project must have billing enabled for Cloud Functions. The function uses
the default runtime service account to read the Firestore knowledge collections.
