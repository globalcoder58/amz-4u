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

## Deploying the frontend to AWS Amplify

The SvelteKit app is exported as a static site to `build/`. Connect the repository to
Amplify Hosting and use the root directory as the app root. The checked-in
`amplify.yml` installs dependencies, runs the Svelte and TypeScript checks, and builds
the site.

The chat backend remains on Firebase. In the Amplify Hosting console, add a **200
rewrite** from `/api/chat` to `https://amz-4u.web.app/api/chat` so chat requests are
proxied to the Firebase Hosting endpoint. Keep this rule above any catch-all SPA
rewrite. Do not add the Gemini key to Amplify; it belongs in Firebase Secret Manager.
The chat endpoint is listed in `static/llms.txt`; update the rewrite target if the
Firebase project or endpoint changes.

For local development, the SvelteKit route proxies chat requests to the Firebase
endpoint above.

## Deploying the chat backend

The Firebase HTTPS Function continues to require the `GEMINI_API_KEY` secret. Manage
the function from its Firebase backend source workspace; this frontend deployment
does not deploy the function.

```sh
firebase functions:secrets:set GEMINI_API_KEY
```

The Firebase project must have billing enabled for Cloud Functions. The function uses
the default runtime service account to read the Firestore knowledge collections.
