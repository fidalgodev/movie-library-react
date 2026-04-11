# Movie Library Modernization — Design

**Date:** 2026-04-11
**Status:** Approved
**Repo:** `fidalgodev/movie-library-react` (main branch)
**Deploys to:** Cloudflare Pages → `movies.fidalgo.dev`

## 1. Context

The site was built in 2019 on Create React App `2.1.8`, React `16.8`, `node-sass 4.11`, React Router v4, and classic Redux (thunk middleware, `connect()` HOCs). It previously ran on Netlify, where bot traffic (~40k requests/day, 91% direct-traffic `/wp-login.php`-style scans) burned through the free tier's bandwidth cap (32 GB in 7 days, projected ~137 GB/month against a 100 GB limit).

The bandwidth problem is already solved: we migrated hosting to Cloudflare Pages (unlimited bandwidth and unlimited requests on the free tier). But that migration exposed a separate blocker: the old toolchain no longer builds on any modern Node. Specifically:

- `node-sass 4.11` has no prebuilt binary for Node 14+
- its source compile fails against Node 14+ V8 headers (removed single-arg `v8::String::Utf8Value` constructor)
- modern macOS cannot even install Node 14 locally (OpenSSL incompatibilities)

Rather than chase patches through an EOL dependency tree, we modernize the entire build + state + routing layer in one focused rewrite. At 3,533 lines of source with no tests and no class components, the app is small enough that a structural refactor is lower risk than continued patch cascades.

## 2. Goals

1. `npm run build` succeeds on current Node LTS.
2. Production build is deployable to Cloudflare Pages with zero new runtime dependencies unmet.
3. All existing features are preserved: homepage→`/discover/Popular` redirect, genre browsing, search, movie detail with cast, person detail with filmography, `/404`, and `/error`.
4. Thunks do not import or call routing APIs. Error-driven navigation flows through store state.
5. Classic `connect()` HOC containers become hook-based functional components.
6. Reducers become Redux Toolkit slices; thunks become `createAsyncThunk` instances.
7. All hard-coded Node 14 pins, node-sass requirements, and CRA-era cruft are deleted.

## 3. Non-Goals

- No TypeScript migration. Stay in JavaScript with `.jsx` files.
- No new testing infrastructure (Vitest, Testing Library, Cypress).
- No ESLint / Prettier / Husky / lint-staged / commitlint / CI beyond Cloudflare Pages.
- No React Router v7 data router / loaders. Redux remains the source of truth for data; routing stays "dumb".
- No feature-based folder reorganization. `containers/` and `components/` stay where they are to minimize import-chain churn.
- No new analytics. The existing dead Universal Analytics integration is deleted with no replacement.
- No Redux Toolkit Query or TanStack Query. `createAsyncThunk` against the existing axios wrapper is sufficient.

## 4. Target Stack

| Concern | Current | Target |
|---|---|---|
| Node | 14.21.3 (EOL April 2023) | **22 LTS** via `.nvmrc` |
| Build tool | `react-scripts 2.1.8` (CRA, deprecated) | **Vite** (latest) + `@vitejs/plugin-react` |
| React | 16.8.4 | **19** — only forced code change is `createRoot` |
| React Router | 4.3.1 | **v7 declarative** (same API as v6, no data router) |
| Redux | `redux 4.0.1` + `redux-thunk` + `connect` HOC | **`@reduxjs/toolkit`** (`configureStore`, `createSlice`, `createAsyncThunk`) |
| react-redux | 6.0.1 | **9.x** — hook-based (`useSelector`, `useDispatch`) |
| Sass | `node-sass 4.11` | **dart-sass** via `sass` (devDep). Used only for one vendor `@import` in `react-modal-video` — no project SCSS exists. |
| styled-components | 4.x | **6.x** |
| Head management | `react-helmet` (abandoned, React 18+ incompatible) | **`react-helmet-async`** |
| HTTP client | `axios 0.18.0` (known CVE) | **`axios` latest 1.x** |
| Analytics | `react-ga` (Universal Analytics, sunset July 2023 — dead code) | **removed entirely** |
| Lazy loading | `react-lazyload` | native `<img loading="lazy">` |
| Query parsing | `query-string` | native `URLSearchParams` |
| Misc | `add` (garbage package), `history` (singleton file) | **removed** |

## 5. Architecture — Routing and Error-Driven Navigation

### The problem being solved

Today, `src/actions/index.js` contains **9 `history.push()` calls** inside Redux thunks, plus `src/components/SearchBar.js`, `src/containers/ShowError.js`, `src/containers/Movie.js`, and `src/containers/Person.js` all import a `history` singleton from `src/history.js` to call navigation directly from event handlers or lifecycle effects.

React Router v6+ removed the ability to navigate from outside a React component. `useNavigate()` is a hook; there is no module-level navigation API. Every thunk, every non-component module, has to be rewired.

### Solution: navigation as a reaction to store state

Three pieces cooperate:

**(1) Standard `<BrowserRouter>`**, no custom history object. `src/history.js` is deleted.

```jsx
// src/main.jsx
createRoot(document.querySelector('#root')).render(
  <Provider store={store}>
    <HelmetProvider>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </HelmetProvider>
  </Provider>
);
```

**(2) A `<RouteGuard>` component** mounted inside `<BrowserRouter>` at the top of `<App>`. It watches the errors slice and navigates on change. Renders nothing.

```jsx
// src/RouteGuard.jsx
const RouteGuard = () => {
  const navigate = useNavigate();
  const error = useSelector(state => state.errors);
  useEffect(() => {
    if (error) navigate('/error');
  }, [error, navigate]);
  return null;
};
```

**(3) `errorsSlice` catches every rejected thunk** via a matcher on the action type, so individual thunks never dispatch error actions themselves:

```js
// src/slices/errorsSlice.js
const errorsSlice = createSlice({
  name: 'errors',
  initialState: null,
  reducers: {
    clearError: () => null,
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      (action) => action.type.endsWith('/rejected'),
      (_state, action) => action.error
    );
  },
});
```

### End-to-end flow on a failed fetch

1. User navigates to `/movie/12345`.
2. `<Movie>` dispatches `fetchMovie(12345)`.
3. TMDB responds 404; the thunk throws.
4. Redux Toolkit auto-dispatches `fetchMovie/rejected`.
5. The errorsSlice matcher catches the `/rejected` suffix and stores `action.error`.
6. `<RouteGuard>` sees `state.errors` change, calls `navigate('/error')`.
7. `<ShowError>` reads the error from the store and renders it.
8. When the user clicks "back home", `<ShowError>` dispatches `clearError()`.
9. `state.errors` resets to `null`. RouteGuard's effect re-runs and no-ops.

### Route table translation (v4 → v7)

```jsx
// Before (v4)
<Switch>
  <Route path="/" exact render={() => <Redirect to="/discover/Popular" />} />
  <Route path="/genres/:name" exact component={Genre} />
  <Route path="/discover/:name" exact component={Discover} />
  <Route path="/search/:query" exact component={Search} />
  <Route path="/movie/:id" exact component={Movie} />
  <Route path="/person/:id" exact component={Person} />
  <Route path="/error" component={ShowError} />
  <Route component={NotFound} />
</Switch>

// After (v7)
<Routes>
  <Route path="/" element={<Navigate replace to="/discover/Popular" />} />
  <Route path="/genres/:name" element={<Genre />} />
  <Route path="/discover/:name" element={<Discover />} />
  <Route path="/search/:query" element={<Search />} />
  <Route path="/movie/:id" element={<Movie />} />
  <Route path="/person/:id" element={<Person />} />
  <Route path="/error" element={<ShowError />} />
  <Route path="*" element={<NotFound title="Upps!" subtitle="This doesn't exist..." />} />
</Routes>
```

Changes: `<Switch>`→`<Routes>`, `component`→`element`, `<Redirect>`→`<Navigate replace>`, wildcard catch-all needs explicit `path="*"`, `exact` is the default behavior in v7 and is no longer a prop.

**Every `process.env.PUBLIC_URL` is deleted.** The site is hosted at the domain root; `PUBLIC_URL` was always an empty string.

### The `history.goBack` / `history.action === 'PUSH'` pattern

`Movie.js` and `Person.js` both render a back button only if `history.action === 'PUSH'`, calling `history.goBack()` on click. In v7:

```jsx
const navigate = useNavigate();
const canGoBack = window.history.state?.idx > 0;
// ...
{canGoBack && <div onClick={() => navigate(-1)}>Go Back</div>}
```

`navigate(-1)` is the v7 equivalent of `history.goBack()`. `window.history.state?.idx` is React Router's internal entry index — nonzero means there's a prior entry in the SPA's history stack.

## 6. Architecture — Redux Toolkit Slice Breakdown

Seven slices replace seven reducers. `src/actions/` and `src/reducers/` are deleted entirely. The switch-statement reducers and the separate action-type constants file go away; slices generate their own action types internally.

### Slices

**`configSlice`** (renamed from `configReducer` / `geral`)

```js
initialState: {
  base: null,     // TMDB image config response
  genres: [],
  loading: true,
}
```
Thunks: `bootstrap` — parallel fetch of `/configuration` + `/genre/movie/list`. `pending` → `loading: true`, `fulfilled` → populate both + `loading: false`, `rejected` → `loading: false` (error captured by errorsSlice matcher).

**Dropped from this slice:**
- `staticCategories: ['Popular', 'Top Rated', 'Upcoming']` → moved to `src/constants.js` as `STATIC_CATEGORIES` (it's a constant, not state).
- `selected` / `SELECTED_MENU` / `REMOVE_SELECTED_MENU` → deleted. "Currently selected menu item" is derivable from `useLocation()`; Sidebar highlights the active item by comparing `location.pathname` to its own `to`.
- The `/404` redirect from the old `setSelectedMenu` thunk → moved to the consuming component. `Discover` and `Genre` use a selector `selectIsValidMenuName(name)` and call `navigate('/404', { replace: true })` on mount if invalid.

**`moviesSlice`** (the plural list page, used by discover / genre / search)

```js
initialState: {
  results: [],
  total_pages: 0,
  total_results: 0,
  page: 1,
  loading: true,
}
```
Thunks: `fetchMoviesDiscover({ name, page })`, `fetchMoviesGenre({ name, page, sort })`, `fetchMoviesSearch({ query, page })`. All three share reducer logic via `isAnyOf` matchers in `extraReducers`.

**`movieSlice`** (single movie detail)

```js
initialState: { data: null, cast: [], loading: true }
```
Thunks (split): `fetchMovie(id)` loads the movie; `fetchCredits(id)` loads the cast. The `<Movie>` component dispatches both in a `useEffect`.

**`personSlice`**

```js
initialState: { data: null, loading: true }
```
Thunks: `fetchPerson(id)`.

**`recommendationsSlice`** (renamed from `recommended` → matches slice name)

```js
initialState: { results: [], loading: true }
```
Thunks: `fetchRecommendations({ id, page })`.

**`moviesForPersonSlice`** (renamed from `moviesPerson`)

```js
initialState: { results: [], loading: true }
```
Thunks: `fetchMoviesForPerson({ id, page, sort })`.

**`errorsSlice`**

```js
initialState: null  // serialized Error | null
```
See Section 5 for the full definition. The `addMatcher` on `/rejected` makes this slice the universal error sink.

### State shape renames cascade

| Old | New | Affected call sites |
|---|---|---|
| `state.geral` | `state.config` | ~8 container files |
| `state.recommended` | `state.recommendations` | `Movie.jsx` only |
| `state.moviesPerson` | `state.moviesForPerson` | `Person.jsx` only |

All affected files are being rewritten for the `connect()` → hooks migration anyway, so these renames are free.

### Store setup

```js
// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import config from './slices/configSlice';
import movies from './slices/moviesSlice';
import movie from './slices/movieSlice';
import person from './slices/personSlice';
import recommendations from './slices/recommendationsSlice';
import moviesForPerson from './slices/moviesForPersonSlice';
import errors from './slices/errorsSlice';

export const store = configureStore({
  reducer: { config, movies, movie, person, recommendations, moviesForPerson, errors },
});
```

`redux-thunk` is included implicitly via `configureStore`'s default middleware. The old `applyMiddleware` / `compose` / `window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__` boilerplate is deleted.

## 7. File Layout

Philosophy: rename in place. Minimize folder movement to keep the import-chain churn low.

### Tree diff

```
movie-library-react/
├── .nvmrc                  14.21.3 → 22
├── .env.local              NEW, gitignored, holds VITE_TMDB_KEY locally
├── index.html              NEW — moved from public/, rewritten for Vite
├── vite.config.js          NEW
├── package.json            REWRITTEN (see Section 8)
├── package-lock.json       REGENERATED
├── public/
│   ├── index.html          DELETED (moved to root)
│   ├── favicon.ico         kept
│   ├── preview.jpg         kept
│   ├── manifest.json       kept
│   └── _redirects          NEW — "/*  /index.html  200" for SPA routing
└── src/
    ├── main.jsx            RENAMED from index.js, rewritten
    ├── App.jsx             RENAMED from containers/App.js, rewritten
    ├── RouteGuard.jsx      NEW
    ├── constants.js        NEW — STATIC_CATEGORIES and similar pure constants
    ├── store.js            RENAMED from store/index.js, rewritten
    ├── history.js          DELETED
    │
    ├── actions/            DELETED (entire folder)
    ├── reducers/           DELETED (entire folder)
    ├── store/              DELETED (flattened to src/store.js)
    │
    ├── slices/             NEW — 7 slice files + index.js
    │   ├── index.js
    │   ├── configSlice.js
    │   ├── moviesSlice.js
    │   ├── movieSlice.js
    │   ├── personSlice.js
    │   ├── recommendationsSlice.js
    │   ├── moviesForPersonSlice.js
    │   └── errorsSlice.js
    │
    ├── api/
    │   └── tmdb.js         UPDATED (import.meta.env + axios 1.x)
    │
    ├── containers/         kept — all .js → .jsx + rewritten connect → hooks
    │   ├── Discover.jsx
    │   ├── Genre.jsx
    │   ├── Search.jsx
    │   ├── Movie.jsx
    │   ├── Person.jsx
    │   ├── ShowError.jsx
    │   ├── Sidebar.jsx
    │   └── MenuMobile.jsx
    │
    ├── components/         kept — all .js → .jsx, drop PUBLIC_URL refs
    │   └── (15 files)
    │
    ├── utils/
    │   ├── theme.js        kept (verify styled-components 6 compat)
    │   └── globals.js      kept (verify styled-components 6 compat)
    │
    └── svg/                kept as-is
```

### `.jsx` vs `.js` convention

- **`.jsx`** — anything returning JSX. All of `src/components/`, all of `src/containers/`, `main.jsx`, `App.jsx`, `RouteGuard.jsx`.
- **`.js`** — pure logic. All slices, `store.js`, `constants.js`, `api/tmdb.js`, `utils/theme.js`, `utils/globals.js`.

### New `index.html` (root of repo)

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" href="/favicon.ico" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

`<title>`, `<meta name="description">`, and `<link rel="canonical">` live in `react-helmet-async` inside `main.jsx`, same as they do in the current code.

### `public/_redirects`

```
/*  /index.html  200
```

Vite copies `public/*` into `dist/` at build time. Cloudflare Pages honors `_redirects`, so any unmatched path falls through to `index.html` and the client-side router takes over.

## 8. Build Tooling, Dependencies, and Cloudflare Pages Settings

### `vite.config.js`

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: { outDir: 'dist' },
  server: { port: 3000 },
});
```

No special config needed for SCSS; Vite auto-detects `sass` in devDependencies and handles `.scss` imports out of the box.

### `package.json` shape

```jsonc
{
  "name": "movie-library-react",
  "private": true,
  "type": "module",
  "version": "2.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@fortawesome/fontawesome-svg-core": "latest",
    "@fortawesome/free-brands-svg-icons": "latest",
    "@fortawesome/free-regular-svg-icons": "latest",
    "@fortawesome/free-solid-svg-icons": "latest",
    "@fortawesome/react-fontawesome": "latest",
    "@reduxjs/toolkit": "latest",
    "axios": "latest",
    "react": "latest",
    "react-burger-menu": "latest",
    "react-dom": "latest",
    "react-helmet-async": "latest",
    "react-modal-video": "latest",
    "react-rating": "latest",
    "react-redux": "latest",
    "react-router-dom": "latest",
    "react-scroll": "latest",
    "react-select": "latest",
    "react-slick": "latest",
    "react-sticky-box": "latest",
    "slick-carousel": "latest",
    "styled-components": "latest"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "latest",
    "sass": "latest",
    "vite": "latest"
  }
}
```

`"latest"` is a placeholder; the actual file pins resolved versions (via `npm view <pkg> version` at write time or via `npm install <pkg>@latest --package-lock-only`).

### Dropped dependencies

| Dropped | Why |
|---|---|
| `react-scripts` | Replaced by Vite |
| `node-sass` | Replaced by `sass` (dart-sass) — only used for one vendor SCSS import |
| `react-helmet` | Abandoned, incompatible with React 18+ concurrent mode |
| `react-ga` | Tracks a sunset Universal Analytics property — dead code since July 2023 |
| `react-lazyload` | Replaced by native `loading="lazy"` attribute |
| `query-string` | Replaced by native `URLSearchParams` |
| `redux`, `redux-thunk` | Rolled into `@reduxjs/toolkit` |
| `add` | Accidentally-installed garbage package, zero real usage |
| `history` | Custom history singleton deleted along with `src/history.js` |

### Environment variables

- **Code**: `process.env.REACT_APP_API` → `import.meta.env.VITE_TMDB_KEY`. Rename also clarifies what the variable is (CRA's `_API` suffix was uninformative).
- **Local dev**: `.env.local` holds `VITE_TMDB_KEY=<real key>`. Gitignored by CRA's existing `.gitignore` rules (confirmed).
- **Cloudflare Pages**: `VITE_TMDB_KEY` must be added to the Production environment variable list before the first successful deploy.

### Cloudflare Pages dashboard changes required (manual, user does these)

These must happen **before** the `modernize` branch is merged to `main`, otherwise the deploy fails:

1. **Build output directory** `build` → `dist`
   Pages dashboard → `movie-library-react` → Settings → Builds & deployments → Build configurations.
2. **Add env var** `VITE_TMDB_KEY` with the TMDB v3 API key value. Environment: Production. (Preview too, if preview deploys are ever wanted.)

Framework preset stays **None**. Build command stays `npm run build`. Node version is handled by `.nvmrc`.

### Local dev workflow (after migration)

```bash
npm install
# .env.local already exists (set up pre-migration)
npm run dev       # HMR on http://localhost:3000
npm run build     # produces dist/
npm run preview   # serves dist/ on http://localhost:4173 for prod-mode smoke test
```

## 9. Migration Sequencing

Constraint: **intermediate commits will not build**. Once `src/actions/` and `src/reducers/` are deleted, the app is broken until `src/slices/` is populated and every container stops importing from old paths. We commit logically for diff review, but only verify builds at the end of the branch.

### Branch strategy

- Work on a `modernize` branch forked from `main`.
- **No intermediate pushes.** Pushing `modernize` mid-migration fires Cloudflare Pages preview builds that will fail noisily. Keep the branch local until `npm run build` succeeds.
- When green → fast-forward merge `modernize` → `main`, push `main`, watch the production deploy.

### Steps (one commit each, roughly)

1. **Scaffold Vite tooling.** New `package.json`, `vite.config.js`, root `index.html`, `.nvmrc` = 22, `public/_redirects`, delete `package-lock.json` (will be regenerated), delete `public/index.html`. `.gitignore` append `dist/`. Don't run `npm install` yet.

2. **Delete dead code.** `rm -rf src/actions src/reducers src/store` and `rm src/history.js`. Single commit of ~300 lines of deletions.

3. **Create the new state layer.** `src/store.js`, `src/constants.js`, `src/slices/index.js`, seven slice files. State exists but nothing imports it yet.

4. **Create the app shell.** New `src/main.jsx` (was `src/index.js`), new `src/App.jsx` (was `src/containers/App.js`, rewritten for v7), new `src/RouteGuard.jsx`. Delete the old files.

5. **Rewrite containers.** Eight containers in one commit: `Discover`, `Genre`, `Search`, `Movie`, `Person`, `ShowError`, `Sidebar`, `MenuMobile`. All `.js` → `.jsx`. All `connect()` → hooks. All `PUBLIC_URL` references deleted. `history.goBack` → `navigate(-1)` in `Movie` / `Person`. `useLocation`-based active-item highlighting in `Sidebar` / `MenuMobile`.

6. **Rename + update components.** 15 files: `git mv` `.js` → `.jsx`, strip `PUBLIC_URL` references where present, swap `history.push` → `useNavigate` in `SearchBar`.

7. **Update leaves.** `src/api/tmdb.js` (axios bump + `import.meta.env.VITE_TMDB_KEY`). Sanity-check `src/utils/theme.js` and `src/utils/globals.js` against styled-components 6.

8. **First install and build loop.** `npm install`, then `npm run build`. Fix errors iteratively — typos, missing imports, any `PUBLIC_URL` stragglers, any styled-components or FontAwesome API break. Commit each fix.

9. **Local smoke test.** `npm run dev`, then click through:
   - `/` → redirects to `/discover/Popular`, list loads
   - Click a movie → `/movie/:id` loads with cast
   - Click a cast member → `/person/:id` loads with filmography
   - Back button on `/movie/:id` works (when coming from list)
   - Sidebar highlights the current section
   - Search bar submits → `/search/:query` loads
   - Manually hit `/genres/not-a-real-genre` → `/404`
   - Break the TMDB key in `.env.local` → any navigation → `/error` renders

10. **User performs Cloudflare Pages dashboard changes** from Section 8: build output dir `build` → `dist`, add `VITE_TMDB_KEY` env var.

11. **Merge and deploy.** `git checkout main`, `git merge modernize --ff-only` (or `--no-ff` if a merge commit is preferred for history), `git push origin main`. Watch Cloudflare Pages build log.

12. **Post-deploy verification.** Smoke test the production site at `https://movies.fidalgo.dev`, same checklist as step 9.

### File touch estimate

- **Created**: ~16 new files — `main.jsx`, `App.jsx`, `RouteGuard.jsx`, `store.js`, `constants.js`, 8 slice files (7 slices + `slices/index.js`), `vite.config.js`, root `index.html`, `public/_redirects`.
- **Deleted**: ~15 files — `src/index.js`, `src/containers/App.js`, `src/history.js`, 7 reducer files + `reducers/index.js`, `actions/index.js`, `actions/types.js`, `store/index.js`, `public/index.html`. Plus `package-lock.json` (regenerated in step 8).
- **Renamed** (`git mv` `.js` → `.jsx`): 23 files — 8 containers + 15 components.
- **Content edits on existing files**: ~26 — the 23 renamed files, plus `tmdb.js`, plus a sanity check on `theme.js` / `globals.js`, plus `.gitignore` (append `dist/`), plus `.nvmrc`.

Total touched: ~80 files. Most of the 3,533 source lines survive as mechanical renames + hook conversions; ~1,000 lines are genuinely rewritten (containers, slices, app shell).

## 10. Rollback Plan

If the production deploy fails or the production site is broken after merge:

- **Preferred**: Cloudflare Pages dashboard → Deployments tab → click a prior successful deployment → **Rollback**. Reverts the live site without touching git. Fastest emergency undo.
- **Secondary**: `git revert <merge commit>` on `main` + push. Reverts the code and triggers a new Cloudflare build from the pre-migration commit. Slower but puts git and production back in sync.
- **Fix-forward**: only if the failure is a trivial oversight caught quickly. Don't attempt this if the site is unreachable; roll back first, diagnose on a side branch, re-merge when green.

## 11. Pre-flight Checklist

Items that must be handled before (or during) the implementation:

1. ✅ **`.env.local` created at repo root** with a valid `VITE_TMDB_KEY`. Gitignored (verified via `git check-ignore`).
2. **Two Cloudflare Pages dashboard changes** (Section 8) must be performed by the user between local smoke test (step 9) and main merge (step 11):
   - Build output directory `build` → `dist`
   - Add `VITE_TMDB_KEY` environment variable to Production
3. **No intermediate pushes** to the `modernize` branch until the local build succeeds. Push only when green, merge to `main` immediately after.

## 12. Deferred / Explicit Non-Decisions

- **`robots.txt`**: not added. Not load-bearing on Cloudflare Pages (bandwidth/requests are unlimited); can be added later as a 2-line PR if SEO deindexing is desired.
- **Google Analytics replacement**: none. The old UA code is deleted, no new tracking is installed. If analytics are wanted later, Cloudflare Web Analytics is a zero-code option (enable in the Pages dashboard).
- **Fine-grained errorsSlice scoping**: the matcher catches *every* `/rejected` action. If specific thunks ever need to opt out, we can tag them with `rejectWithValue({ silent: true })` and add a predicate to the matcher. Not needed today; deferred.
- **Redux Toolkit Query / RTK Query**: the `createAsyncThunk` approach is sufficient for this app. Migration to RTK Query would flatten the slices further but is explicitly out of scope.
