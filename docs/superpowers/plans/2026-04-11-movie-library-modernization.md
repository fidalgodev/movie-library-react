# Movie Library Modernization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate `movie-library-react` from the 2019-era CRA / React 16 / node-sass / React Router v4 / classic Redux stack onto Vite + React 19 + React Router v7 + Redux Toolkit, with feature parity and a deploying Cloudflare Pages build.

**Architecture:** Work on a `modernize` branch forked from `main`. Rewrite the state layer as Redux Toolkit slices (7 total). Navigation is driven by store state — `createAsyncThunk` rejections populate `errorsSlice` via `addMatcher`, and a top-level `<RouteGuard>` component reacts to that state by calling `useNavigate('/error')`. Thunks never import routing APIs. Routing uses React Router v7's declarative `<BrowserRouter>` + `<Routes>` API (no data router). Containers become functional components using hooks instead of `connect()`.

**Tech Stack:** Vite 5+, React 19, React Router 7, Redux Toolkit, react-redux 9, react-helmet-async, styled-components 6, sass (dart-sass, dev-only for one vendor import), axios 1.x.

**Spec:** See [`docs/superpowers/specs/2026-04-11-movie-library-modernization-design.md`](../specs/2026-04-11-movie-library-modernization-design.md) for architectural context, design decisions, and rollback plan.

---

## File Structure

Files being created (all in `src/` except where noted):

```
/                                        # repo root
├── .nvmrc                                # EDIT: 14.21.3 → 22
├── .env.local                            # EXISTS (holds VITE_TMDB_KEY)
├── index.html                            # NEW (moved from public/)
├── vite.config.js                        # NEW
├── package.json                          # REWRITTEN
├── public/
│   ├── index.html                        # DELETE
│   └── _redirects                        # NEW
└── src/
    ├── main.jsx                          # NEW (was src/index.js)
    ├── App.jsx                           # NEW (was src/containers/App.js)
    ├── RouteGuard.jsx                    # NEW
    ├── constants.js                      # NEW
    ├── store.js                          # NEW (was src/store/index.js)
    ├── slices/
    │   ├── index.js                      # NEW
    │   ├── configSlice.js                # NEW
    │   ├── moviesSlice.js                # NEW
    │   ├── movieSlice.js                 # NEW
    │   ├── personSlice.js                # NEW
    │   ├── recommendationsSlice.js       # NEW
    │   ├── moviesForPersonSlice.js       # NEW
    │   └── errorsSlice.js                # NEW
    ├── api/tmdb.js                       # REWRITE (axios + env var)
    ├── containers/                       # all .js → .jsx, connect → hooks
    │   ├── Discover.jsx
    │   ├── Genre.jsx
    │   ├── Search.jsx
    │   ├── Movie.jsx
    │   ├── Person.jsx
    │   ├── ShowError.jsx
    │   ├── Sidebar.jsx
    │   └── MenuMobile.jsx
    └── components/                       # all .js → .jsx, drop PUBLIC_URL
        └── (15 files, mostly mechanical renames)
```

Files being deleted:
- `src/history.js`
- `src/index.js`
- `src/containers/App.js`
- `src/actions/` (entire folder)
- `src/reducers/` (entire folder)
- `src/store/` (entire folder)
- `public/index.html`
- `package-lock.json` (will be regenerated)

**Current working directory for all tasks:** `/Users/fidalgo/projects/movie-library-react`

---

## Task 1: Create the `modernize` branch

**Files:**
- No code changes; git branch operation only

- [ ] **Step 1: Verify clean working tree**

```bash
git status
```
Expected: `On branch main` and `nothing to commit, working tree clean`. If anything is staged or modified, stash or commit it first.

- [ ] **Step 2: Create and switch to branch**

```bash
git checkout -b modernize
```
Expected: `Switched to a new branch 'modernize'`

- [ ] **Step 3: Confirm**

```bash
git branch --show-current
```
Expected: `modernize`

---

## Task 2: Scaffold Vite tooling

Swap the build layer (package.json + vite config + index.html + node version) without touching `src/` yet. After this task, the repo has a new build system but no code connected to it — nothing will build or run until later tasks rewrite the state and app shell.

**Files:**
- Create: `package.json` (rewritten)
- Create: `vite.config.js`
- Create: `/index.html` (moved from `public/`)
- Create: `public/_redirects`
- Modify: `.nvmrc`
- Modify: `.gitignore` (append `dist/`)
- Delete: `public/index.html`
- Delete: `package-lock.json`

- [ ] **Step 1: Rewrite `package.json`**

Replace the entire contents of `package.json` with:

```json
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
    "@fortawesome/fontawesome-svg-core": "^6.7.2",
    "@fortawesome/free-brands-svg-icons": "^6.7.2",
    "@fortawesome/free-regular-svg-icons": "^6.7.2",
    "@fortawesome/free-solid-svg-icons": "^6.7.2",
    "@fortawesome/react-fontawesome": "^0.2.2",
    "@reduxjs/toolkit": "^2.3.0",
    "axios": "^1.7.9",
    "react": "^19.0.0",
    "react-burger-menu": "^3.1.0",
    "react-dom": "^19.0.0",
    "react-helmet-async": "^2.0.5",
    "react-modal-video": "^2.0.2",
    "react-rating": "^2.0.5",
    "react-redux": "^9.2.0",
    "react-router-dom": "^7.1.3",
    "react-scroll": "^1.9.0",
    "react-select": "^5.9.0",
    "react-slick": "^0.30.3",
    "react-sticky-box": "^2.0.5",
    "slick-carousel": "^1.8.1",
    "styled-components": "^6.1.14"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.4",
    "sass": "^1.83.4",
    "vite": "^6.0.7"
  }
}
```

Note: versions above are concrete minimums known to be current as of spec-writing time. At `npm install` time in Task 28, npm will resolve to the latest matching version. If any dependency has moved on in a way that breaks, pin it further at that step.

- [ ] **Step 2: Create `vite.config.js`**

Create a new file at repo root `vite.config.js`:

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  server: {
    port: 3000,
    open: false,
  },
});
```

- [ ] **Step 3: Create new root `index.html`**

Create a new file at repo root `index.html`:

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

(Title, description, and canonical link are set at runtime by `react-helmet-async` inside `main.jsx` — same behavior as the current CRA build.)

- [ ] **Step 4: Create `public/_redirects` for Cloudflare Pages SPA routing**

Create a new file `public/_redirects` containing exactly:

```
/*  /index.html  200
```

Vite copies `public/*` into `dist/` at build time, so this ends up in the deployed root. Cloudflare Pages honors `_redirects`: any unmatched path serves `index.html` and lets the client-side router take over.

- [ ] **Step 5: Update `.nvmrc`**

Replace the contents of `.nvmrc` with:

```
22
```

(Just `22` — npm honors major-version-only pins, and Cloudflare Pages' asdf setup will install the latest 22.x LTS.)

- [ ] **Step 6: Update `.gitignore`**

Append to `.gitignore`:

```
/dist
```

Current `.gitignore` has `/build` (CRA's output dir); Vite outputs to `dist/`, so we add `/dist`. Leave `/build` in place — harmless if it stays.

- [ ] **Step 7: Delete the old `public/index.html`**

```bash
rm public/index.html
```

- [ ] **Step 8: Delete the old `package-lock.json`**

```bash
rm package-lock.json
```
It will be regenerated in Task 28 when we run `npm install`.

- [ ] **Step 9: Verify the diff**

```bash
git status
```
Expected: changes to `package.json`, `.nvmrc`, `.gitignore`; deletions of `public/index.html` and `package-lock.json`; new files `index.html`, `vite.config.js`, `public/_redirects`.

- [ ] **Step 10: Commit**

```bash
git add package.json vite.config.js index.html public/_redirects .nvmrc .gitignore
git add -u package-lock.json public/index.html
git commit -m "$(cat <<'EOF'
Scaffold Vite build tooling

Swap CRA/react-scripts for Vite + @vitejs/plugin-react. Move index.html to
repo root per Vite convention, add public/_redirects for Cloudflare Pages SPA
routing, bump Node to 22 LTS. package-lock.json will be regenerated on next
npm install.
EOF
)"
```

---

## Task 3: Delete the dead state layer

Drop `src/actions/`, `src/reducers/`, `src/store/`, and `src/history.js` in one commit. After this, nothing in `src/` that imports from those paths will resolve — we'll fix that by populating `src/slices/` and rewriting imports in subsequent tasks.

**Files:**
- Delete: `src/actions/` (folder with `index.js`, `types.js`)
- Delete: `src/reducers/` (folder with 7 reducer files + `index.js`)
- Delete: `src/store/` (folder with `index.js`)
- Delete: `src/history.js`

- [ ] **Step 1: Remove the folders and file**

```bash
rm -rf src/actions src/reducers src/store src/history.js
```

- [ ] **Step 2: Verify they're gone**

```bash
ls src/
```
Expected output should NOT contain `actions`, `reducers`, `store`, or `history.js`. Should still contain `components/`, `containers/`, `api/`, `utils/`, `svg/`, `index.js`.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "Delete classic Redux state layer

Remove src/actions/, src/reducers/, src/store/, and src/history.js in
preparation for Redux Toolkit slices. The app will not build between this
commit and task 28 (first npm run build) — intermediate broken state is
expected throughout the slice/container/component rewrites."
```

---

## Task 4: Create `src/constants.js`

Pulls the `staticCategories` value out of Redux state (where it never belonged — it's a literal constant) into a plain module export. Tasks 16 and 17 will import from this.

**Files:**
- Create: `src/constants.js`
- Create: `src/slices/` (empty directory; slice files arrive in Tasks 5-11)

- [ ] **Step 1: Create the slices directory**

```bash
mkdir -p src/slices
```

- [ ] **Step 2: Create `src/constants.js`**

```js
// src/constants.js
export const STATIC_CATEGORIES = ['Popular', 'Top Rated', 'Upcoming'];
```

- [ ] **Step 3: Commit**

```bash
git add src/constants.js
git commit -m "Add src/constants.js with STATIC_CATEGORIES

Pulled out of the configReducer initial state where it was treated as mutable
Redux state but was actually a constant."
```

Note: `src/slices/` is an empty directory at this point. Git doesn't track empty directories, so there's nothing to commit for it. Slice files arrive individually in Tasks 5-11.

---

## Task 5: Write `errorsSlice`

The universal error catcher. Uses an `addMatcher` on any action type ending in `/rejected`, so every rejected `createAsyncThunk` automatically populates state without individual thunks dispatching anything.

**Files:**
- Create: `src/slices/errorsSlice.js`

- [ ] **Step 1: Create `src/slices/errorsSlice.js` with:**

```js
import { createSlice, isRejected } from '@reduxjs/toolkit';

const errorsSlice = createSlice({
  name: 'errors',
  initialState: null,
  reducers: {
    clearError: () => null,
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      isRejected,
      (_state, action) => action.error ?? { message: 'Unknown error' }
    );
  },
});

export const { clearError } = errorsSlice.actions;
export default errorsSlice.reducer;
```

`isRejected` is RTK's built-in matcher for any `/rejected` action — cleaner than a hand-rolled string predicate. `action.error` is the serialized error Redux Toolkit automatically produces when a thunk throws.

- [ ] **Step 2: Commit**

```bash
git add src/slices/errorsSlice.js
git commit -m "Implement errorsSlice with universal rejected-thunk matcher

Catches every createAsyncThunk rejection via isRejected matcher, stores the
serialized error in state. The top-level RouteGuard component (added in task
14) reacts to this state to navigate to /error."
```

---

## Task 6: Write `configSlice`

Handles TMDB image config + genres. One thunk (`bootstrap`) runs both fetches in parallel. Drops the `selected` / `staticCategories` state from the old reducer (moved to `src/constants.js` and to `useLocation`-derived state in Sidebar respectively).

**Files:**
- Create: `src/slices/configSlice.js`

- [ ] **Step 1: Create `src/slices/configSlice.js` with:**

```js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import tmdbAPI from '../api/tmdb';

export const bootstrap = createAsyncThunk(
  'config/bootstrap',
  async () => {
    const [configRes, genresRes] = await Promise.all([
      tmdbAPI.get('/configuration'),
      tmdbAPI.get('/genre/movie/list'),
    ]);
    return {
      base: configRes.data,
      genres: genresRes.data.genres,
    };
  }
);

const configSlice = createSlice({
  name: 'config',
  initialState: {
    base: null,
    genres: [],
    loading: true,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(bootstrap.pending, (state) => {
        state.loading = true;
      })
      .addCase(bootstrap.fulfilled, (state, action) => {
        state.base = action.payload.base;
        state.genres = action.payload.genres;
        state.loading = false;
      })
      .addCase(bootstrap.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default configSlice.reducer;
```

Note: on `rejected`, we set `loading: false` and let `errorsSlice` handle the actual error payload via its matcher. No `dispatch(INSERT_ERROR)` needed.

- [ ] **Step 2: Also export a selector for menu-name validity (used by Discover/Genre in later tasks)**

Append to the same file, after `export default`:

```js
// Selector: is `name` a valid menu name (either a static category or a genre)?
export const selectIsValidMenuName = (name) => (state) => {
  if (!name) return false;
  const { genres } = state.config;
  const STATIC_CATEGORIES = ['Popular', 'Top Rated', 'Upcoming'];
  return (
    STATIC_CATEGORIES.includes(name) ||
    genres.some((g) => g.name === name)
  );
};
```

This replaces the validation logic that used to live in the `setSelectedMenu` thunk. `Discover` and `Genre` components call `useSelector(selectIsValidMenuName(routeName))` and `navigate('/404')` if false.

- [ ] **Step 3: Commit**

```bash
git add src/slices/configSlice.js
git commit -m "Implement configSlice with bootstrap thunk and menu-name validator"
```

---

## Task 7: Write `moviesSlice`

Three thunks (`fetchMoviesDiscover`, `fetchMoviesGenre`, `fetchMoviesSearch`), one shared reducer via `isAnyOf` matchers. All three produce the same result shape.

**Files:**
- Create: `src/slices/moviesSlice.js`

- [ ] **Step 1: Create `src/slices/moviesSlice.js` with:**

```js
import { createSlice, createAsyncThunk, isAnyOf } from '@reduxjs/toolkit';
import tmdbAPI from '../api/tmdb';

export const fetchMoviesDiscover = createAsyncThunk(
  'movies/fetchMoviesDiscover',
  async ({ name, page }) => {
    // `name` is a discover category like "popular", "top_rated", "upcoming"
    // TMDB endpoint uses lowercase_with_underscores; convert as needed
    const endpoint = name.toLowerCase().replace(/ /g, '_');
    const res = await tmdbAPI.get(`/movie/${endpoint}`, { params: { page } });
    return res.data;
  }
);

export const fetchMoviesGenre = createAsyncThunk(
  'movies/fetchMoviesGenre',
  async ({ name, page, sort }, { getState }) => {
    const { genres } = getState().config;
    const genreId = genres
      .filter((el) => el.name === name)
      .map((el) => el.id)
      .join('');
    const res = await tmdbAPI.get('/discover/movie', {
      params: {
        with_genres: genreId,
        page,
        sort_by: sort,
      },
    });
    return res.data;
  }
);

export const fetchMoviesSearch = createAsyncThunk(
  'movies/fetchMoviesSearch',
  async ({ query, page }) => {
    const res = await tmdbAPI.get('/search/movie', {
      params: { query, page },
    });
    return res.data;
  }
);

const moviesSlice = createSlice({
  name: 'movies',
  initialState: {
    results: [],
    total_pages: 0,
    total_results: 0,
    page: 1,
    loading: true,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(
        isAnyOf(
          fetchMoviesDiscover.pending,
          fetchMoviesGenre.pending,
          fetchMoviesSearch.pending
        ),
        (state) => {
          state.loading = true;
        }
      )
      .addMatcher(
        isAnyOf(
          fetchMoviesDiscover.fulfilled,
          fetchMoviesGenre.fulfilled,
          fetchMoviesSearch.fulfilled
        ),
        (state, action) => {
          Object.assign(state, action.payload);
          state.loading = false;
        }
      );
  },
});

export default moviesSlice.reducer;
```

Note: `fetchMoviesDiscover` converts the display name ("Top Rated") to the TMDB endpoint (`top_rated`). The old code took the discovery name as-is and appended it to `/movie/${name}` — verify the TMDB endpoint naming convention matches what the current UI expects. If the old UI was sending uppercase names to TMDB and relying on TMDB to 404 them into the error flow, adjust accordingly during smoke test (Task 29).

- [ ] **Step 2: Commit**

```bash
git add src/slices/moviesSlice.js
git commit -m "Implement moviesSlice with three list thunks and isAnyOf matchers"
```

---

## Task 8: Write `movieSlice`

Two thunks (`fetchMovie`, `fetchCredits`), since we're using the split pattern from Section 6 of the spec.

**Files:**
- Create: `src/slices/movieSlice.js`

- [ ] **Step 1: Create `src/slices/movieSlice.js` with:**

```js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import tmdbAPI from '../api/tmdb';

export const fetchMovie = createAsyncThunk(
  'movie/fetchMovie',
  async (id) => {
    const res = await tmdbAPI.get(`/movie/${id}`, {
      params: { append_to_response: 'videos' },
    });
    return res.data;
  }
);

export const fetchCredits = createAsyncThunk(
  'movie/fetchCredits',
  async (id) => {
    const res = await tmdbAPI.get(`/movie/${id}/credits`);
    return res.data.cast;
  }
);

const movieSlice = createSlice({
  name: 'movie',
  initialState: {
    data: null,
    cast: [],
    loading: true,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovie.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMovie.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchCredits.fulfilled, (state, action) => {
        state.cast = action.payload;
      });
  },
});

export default movieSlice.reducer;
```

- [ ] **Step 2: Commit**

```bash
git add src/slices/movieSlice.js
git commit -m "Implement movieSlice with split fetchMovie and fetchCredits thunks"
```

---

## Task 9: Write `personSlice`

**Files:**
- Create: `src/slices/personSlice.js`

- [ ] **Step 1: Create `src/slices/personSlice.js` with:**

```js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import tmdbAPI from '../api/tmdb';

export const fetchPerson = createAsyncThunk(
  'person/fetchPerson',
  async (id) => {
    const res = await tmdbAPI.get(`/person/${id}`);
    return res.data;
  }
);

const personSlice = createSlice({
  name: 'person',
  initialState: {
    data: null,
    loading: true,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPerson.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPerson.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      });
  },
});

export default personSlice.reducer;
```

- [ ] **Step 2: Commit**

```bash
git add src/slices/personSlice.js
git commit -m "Implement personSlice with fetchPerson thunk"
```

---

## Task 10: Write `recommendationsSlice`

**Files:**
- Create: `src/slices/recommendationsSlice.js`

- [ ] **Step 1: Create `src/slices/recommendationsSlice.js` with:**

```js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import tmdbAPI from '../api/tmdb';

export const fetchRecommendations = createAsyncThunk(
  'recommendations/fetchRecommendations',
  async ({ id, page }) => {
    const res = await tmdbAPI.get(`/movie/${id}/recommendations`, {
      params: { page },
    });
    return res.data;
  }
);

const recommendationsSlice = createSlice({
  name: 'recommendations',
  initialState: {
    results: [],
    total_pages: 0,
    page: 1,
    loading: true,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecommendations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRecommendations.fulfilled, (state, action) => {
        Object.assign(state, action.payload);
        state.loading = false;
      });
  },
});

export default recommendationsSlice.reducer;
```

- [ ] **Step 2: Commit**

```bash
git add src/slices/recommendationsSlice.js
git commit -m "Implement recommendationsSlice with fetchRecommendations thunk"
```

---

## Task 11: Write `moviesForPersonSlice`

**Files:**
- Create: `src/slices/moviesForPersonSlice.js`

- [ ] **Step 1: Create `src/slices/moviesForPersonSlice.js` with:**

```js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import tmdbAPI from '../api/tmdb';

export const fetchMoviesForPerson = createAsyncThunk(
  'moviesForPerson/fetchMoviesForPerson',
  async ({ id, page, sort }) => {
    const res = await tmdbAPI.get('/discover/movie', {
      params: {
        with_cast: id,
        page,
        sort_by: sort,
      },
    });
    return res.data;
  }
);

const moviesForPersonSlice = createSlice({
  name: 'moviesForPerson',
  initialState: {
    results: [],
    total_pages: 0,
    page: 1,
    loading: true,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMoviesForPerson.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMoviesForPerson.fulfilled, (state, action) => {
        Object.assign(state, action.payload);
        state.loading = false;
      });
  },
});

export default moviesForPersonSlice.reducer;
```

- [ ] **Step 2: Commit**

```bash
git add src/slices/moviesForPersonSlice.js
git commit -m "Implement moviesForPersonSlice with fetchMoviesForPerson thunk"
```

---

## Task 12: Create `src/slices/index.js` and `src/store.js`

Consolidate slice exports and create the configured store.

**Files:**
- Create: `src/slices/index.js`
- Create: `src/store.js`

- [ ] **Step 1: Create `src/slices/index.js`**

```js
export { default as config } from './configSlice';
export { default as movies } from './moviesSlice';
export { default as movie } from './movieSlice';
export { default as person } from './personSlice';
export { default as recommendations } from './recommendationsSlice';
export { default as moviesForPerson } from './moviesForPersonSlice';
export { default as errors } from './errorsSlice';
```

- [ ] **Step 2: Create `src/store.js`**

```js
import { configureStore } from '@reduxjs/toolkit';
import {
  config,
  movies,
  movie,
  person,
  recommendations,
  moviesForPerson,
  errors,
} from './slices';

export const store = configureStore({
  reducer: {
    config,
    movies,
    movie,
    person,
    recommendations,
    moviesForPerson,
    errors,
  },
});
```

`redux-thunk` is included implicitly via `configureStore`'s default middleware. No `applyMiddleware` / `compose` / DevTools extension wiring needed — RTK handles it.

- [ ] **Step 3: Commit**

```bash
git add src/slices/index.js src/store.js
git commit -m "Add slices barrel export and configureStore setup"
```

---

## Task 13: Create `src/RouteGuard.jsx`

The error→navigate bridge component. Renders nothing; reacts to `state.errors` changes.

**Files:**
- Create: `src/RouteGuard.jsx`

- [ ] **Step 1: Create `src/RouteGuard.jsx`**

```jsx
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const RouteGuard = () => {
  const navigate = useNavigate();
  const error = useSelector((state) => state.errors);

  useEffect(() => {
    if (error) {
      navigate('/error');
    }
  }, [error, navigate]);

  return null;
};

export default RouteGuard;
```

- [ ] **Step 2: Commit**

```bash
git add src/RouteGuard.jsx
git commit -m "Add RouteGuard component for store-driven error navigation"
```

---

## Task 14: Create `src/App.jsx`

The new top-level component that holds the route table and chrome. Replaces the old `src/containers/App.js`. Uses hooks (no `connect`), v7 routing, and mounts `<RouteGuard>`.

**Files:**
- Create: `src/App.jsx`

- [ ] **Step 1: Read the current `src/containers/App.js` to lift the styled-components, FontAwesome library setup, and the `init` bootstrap pattern.**

The styles (`MainWrapper`, `ContentWrapper`, `SearhBarWrapper`), FontAwesome library setup, and the `isMobile` `useState` + `useEffect` + `matchMedia` logic are preserved verbatim.

- [ ] **Step 2: Create `src/App.jsx`**

```jsx
import { useEffect, useState, Fragment } from 'react';
import styled from 'styled-components';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { bootstrap } from './slices/configSlice';
import RouteGuard from './RouteGuard';

import Sidebar from './containers/Sidebar';
import MenuMobile from './containers/MenuMobile';
import Discover from './containers/Discover';
import Genre from './containers/Genre';
import Search from './containers/Search';
import Movie from './containers/Movie';
import Person from './containers/Person';
import ShowError from './containers/ShowError';

import NotFound from './components/NotFound';
import SearchBar from './components/SearchBar';
import Loader from './components/Loader';

import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import {
  faArrowLeft,
  faArrowRight,
  faHome,
  faCalendar,
  faPoll,
  faHeart,
  faDotCircle,
  faStar as fasFaStar,
  faSearch,
  faChevronRight,
  faChevronLeft,
  faLink,
  faPlay,
} from '@fortawesome/free-solid-svg-icons';
import { faStar as farFaStar } from '@fortawesome/free-regular-svg-icons';

library.add(
  fab,
  faArrowLeft,
  faArrowRight,
  faHome,
  faCalendar,
  faPoll,
  faHeart,
  faDotCircle,
  fasFaStar,
  farFaStar,
  faSearch,
  faChevronRight,
  faChevronLeft,
  faLink,
  faPlay
);

const MainWrapper = styled.div`
  display: flex;
  flex-direction: ${(props) => (props.$isMobile ? 'column' : 'row')};
  position: relative;
  align-items: flex-start;
  height: 100%;
  width: 100%;
  user-select: none;
`;

const ContentWrapper = styled.div`
  width: 100%;
  height: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6rem 4rem;

  @media ${(props) => props.theme.mediaQueries.larger} {
    padding: 6rem 3rem;
  }

  @media ${(props) => props.theme.mediaQueries.large} {
    padding: 4rem 2rem;
  }
`;

const SearchBarWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  padding: 2rem;
`;

const App = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.config.loading);
  const [isMobile, setIsMobile] = useState(null);

  useEffect(() => {
    dispatch(bootstrap());
  }, [dispatch]);

  useEffect(() => {
    const changeMobile = () => {
      setIsMobile(window.matchMedia('(max-width: 80em)').matches);
    };
    changeMobile();
    window.addEventListener('resize', changeMobile);
    return () => window.removeEventListener('resize', changeMobile);
  }, []);

  if (isLoading) {
    return (
      <ContentWrapper>
        <Loader />
      </ContentWrapper>
    );
  }

  return (
    <Fragment>
      <RouteGuard />
      <MainWrapper $isMobile={isMobile}>
        {isMobile ? (
          <MenuMobile />
        ) : (
          <>
            <Sidebar />
            <SearchBarWrapper>
              <SearchBar />
            </SearchBarWrapper>
          </>
        )}
        <ContentWrapper>
          <Routes>
            <Route path="/" element={<Navigate replace to="/discover/Popular" />} />
            <Route path="/genres/:name" element={<Genre />} />
            <Route path="/discover/:name" element={<Discover />} />
            <Route path="/search/:query" element={<Search />} />
            <Route path="/movie/:id" element={<Movie />} />
            <Route path="/person/:id" element={<Person />} />
            <Route path="/error" element={<ShowError />} />
            <Route
              path="*"
              element={<NotFound title="Upps!" subtitle="This doesn't exist..." />}
            />
          </Routes>
        </ContentWrapper>
      </MainWrapper>
    </Fragment>
  );
};

export default App;
```

Two subtle changes from the old code worth noting:
- `isMobile` styled-component prop is now `$isMobile` (prefixed). In styled-components v6, non-DOM props are prefixed with `$` to signal "transient prop"; otherwise they warn about unknown DOM attributes.
- `SearhBarWrapper` typo fixed → `SearchBarWrapper`.

- [ ] **Step 3: Commit**

```bash
git add src/App.jsx
git commit -m "Add src/App.jsx with v7 routing and hook-based dispatch"
```

---

## Task 15: Create `src/main.jsx`

The new entry point. Replaces `src/index.js`. Uses React 19's `createRoot`, wraps the tree with `<BrowserRouter>` + `<HelmetProvider>` + `<ThemeProvider>`, and preserves the vendor SCSS/CSS imports for `react-modal-video` and `slick-carousel`.

**Files:**
- Create: `src/main.jsx`
- Delete: `src/index.js`
- Delete: `src/containers/App.js`

- [ ] **Step 1: Create `src/main.jsx`**

```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import { store } from './store';
import theme from './utils/theme';
import GlobalStyle from './utils/globals';
import App from './App';

import 'react-modal-video/scss/modal-video.scss';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const root = createRoot(document.querySelector('#root'));

root.render(
  <StrictMode>
    <Provider store={store}>
      <HelmetProvider>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <Helmet>
              <title>Movie Library</title>
              <meta
                name="description"
                content="A Movie Library where you can check all your favorite movies, as well as the cast of it, and so much more! Made with ❤️ by Fidalgo"
              />
              <link rel="canonical" href="https://movies.fidalgo.dev" />
            </Helmet>
            <GlobalStyle />
            <App />
          </BrowserRouter>
        </ThemeProvider>
      </HelmetProvider>
    </Provider>
  </StrictMode>
);
```

Key differences from old `src/index.js`:
- `ReactDOM.render(...)` → `createRoot(...).render(...)`
- Wrapped in `<StrictMode>` (React 18+ recommended)
- Vendor imports no longer prefixed with `../node_modules/` — Vite resolves bare specifiers
- `<BrowserRouter>` lives here (not in `App.jsx`) so `useNavigate()` works inside `<App>` itself
- `<HelmetProvider>` (from `react-helmet-async`) wraps everything — required by that package
- `<GlobalStyle />` moved out of `<Fragment>` into a top-level sibling — styled-components 6 likes this pattern
- Typo "mucnh" → "much" in description

- [ ] **Step 2: Delete the old entry files**

```bash
rm src/index.js src/containers/App.js
```

- [ ] **Step 3: Commit**

```bash
git add src/main.jsx
git add -u src/index.js src/containers/App.js
git commit -m "Replace src/index.js and containers/App.js with src/main.jsx and src/App.jsx

React 19 createRoot, BrowserRouter, HelmetProvider, moved top-level chrome
out of containers/."
```

---

## Task 16: Rewrite `containers/Sidebar` — `.js` → `.jsx` with hooks

Convert the sidebar to use `useSelector`/`useDispatch` instead of `connect()`, and derive active-menu state from `useLocation` instead of the deleted `state.geral.selected`.

**Files:**
- Create: `src/containers/Sidebar.jsx`
- Delete: `src/containers/Sidebar.js`

- [ ] **Step 1: Read current `src/containers/Sidebar.js` in full**

Understand the current styled-components, menu rendering logic, and active-state display. Preserve all JSX structure and styling.

- [ ] **Step 2: Apply the conversion template to `src/containers/Sidebar.jsx`**

Conversion rules:
- Remove `import { connect } from 'react-redux'` and `mapStateToProps`.
- Import hooks: `import { useSelector } from 'react-redux'; import { useLocation, Link } from 'react-router-dom';`
- Replace `({ genres, selected, ... }) =>` destructure on props with `useSelector((state) => state.config.genres)` for genres, and `useLocation()` for pathname.
- Compute `const isActive = (path) => location.pathname === path`. Use that for highlighting instead of `selected === name`.
- Drop all `process.env.PUBLIC_URL` references — use plain path strings.
- Drop `import { setSelectedMenu }` and any `dispatch(setSelectedMenu(...))` calls. Active state is derived; no dispatch needed.
- Import `STATIC_CATEGORIES` from `../constants` instead of `staticCategories` off Redux state.
- `export default Sidebar` (no `connect` wrapper).

Example skeleton (adapt to the actual JSX):

```jsx
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { STATIC_CATEGORIES } from '../constants';

// ... preserve all styled-components definitions ...

const Sidebar = () => {
  const genres = useSelector((state) => state.config.genres);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <SidebarWrapper>
      {/* ... logo ... */}
      {STATIC_CATEGORIES.map((category) => (
        <Link
          key={category}
          to={`/discover/${category}`}
          className={isActive(`/discover/${category}`) ? 'active' : ''}
        >
          {category}
        </Link>
      ))}
      {genres.map((genre) => (
        <Link
          key={genre.id}
          to={`/genres/${genre.name}`}
          className={isActive(`/genres/${genre.name}`) ? 'active' : ''}
        >
          {genre.name}
        </Link>
      ))}
      {/* ... rest of the sidebar chrome ... */}
    </SidebarWrapper>
  );
};

export default Sidebar;
```

- [ ] **Step 3: Delete the old file**

```bash
rm src/containers/Sidebar.js
```

- [ ] **Step 4: Commit**

```bash
git add src/containers/Sidebar.jsx
git add -u src/containers/Sidebar.js
git commit -m "Rewrite Sidebar as hook-based functional component

Drop connect(), derive active menu from useLocation instead of Redux state,
drop setSelectedMenu dispatches (state.config.selected no longer exists)."
```

---

## Task 17: Rewrite `containers/MenuMobile` — `.js` → `.jsx` with hooks

Same conversion template as Sidebar. The mobile menu is a `react-burger-menu` wrapper around the same data + active-state logic.

**Files:**
- Create: `src/containers/MenuMobile.jsx`
- Delete: `src/containers/MenuMobile.js`

- [ ] **Step 1: Read current `src/containers/MenuMobile.js`**
- [ ] **Step 2: Apply the same connect → hooks template from Task 16**

Same rules: `useSelector((state) => state.config.genres)`, `useLocation()`, derive `isActive`, drop `PUBLIC_URL`, drop `setSelectedMenu`, use `STATIC_CATEGORIES` from constants.

- [ ] **Step 3: Delete old, commit new**

```bash
rm src/containers/MenuMobile.js
git add src/containers/MenuMobile.jsx
git add -u src/containers/MenuMobile.js
git commit -m "Rewrite MenuMobile as hook-based functional component"
```

---

## Task 18: Rewrite `containers/Discover` — `.js` → `.jsx`

Discover is a list page. It reads `:name` from the URL, validates it, dispatches `fetchMoviesDiscover`, and reads the result from `state.movies`.

**Files:**
- Create: `src/containers/Discover.jsx`
- Delete: `src/containers/Discover.js`

- [ ] **Step 1: Read current `src/containers/Discover.js`**

- [ ] **Step 2: Apply the hooks + validation template**

Key conversion points:
- Replace `withRouter`-ish prop `match.params.name` with `const { name } = useParams();`
- Replace `connect(mapState, { getMoviesDiscover, ... })` with `useSelector` + `useDispatch`.
- Add menu-name validation: use `selectIsValidMenuName` from `configSlice` and `navigate('/404', { replace: true })` if invalid.
- Dispatch `fetchMoviesDiscover({ name, page })` in `useEffect` when `name` or `page` changes.
- Read `state.movies` for results, loading, pagination.
- Drop all `PUBLIC_URL` references.

Skeleton:

```jsx
import { useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { fetchMoviesDiscover } from '../slices/moviesSlice';
import { selectIsValidMenuName } from '../slices/configSlice';
import MoviesList from '../components/MoviesList';
import Pagination from '../components/Pagination';
import Loading from '../components/Loading';

const Discover = () => {
  const { name } = useParams();
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isValidName = useSelector(selectIsValidMenuName(name));
  const movies = useSelector((state) => state.movies);

  useEffect(() => {
    if (!isValidName) {
      navigate('/404', { replace: true });
      return;
    }
    dispatch(fetchMoviesDiscover({ name, page }));
  }, [isValidName, name, page, dispatch, navigate]);

  if (movies.loading) return <Loading />;

  return (
    <>
      <MoviesList movies={movies.results} />
      <Pagination
        currentPage={movies.page}
        totalPages={movies.total_pages}
      />
    </>
  );
};

export default Discover;
```

Adapt the JSX to match the current file's actual markup and `<MoviesList>`, `<Pagination>`, `<Loading>` props (the component interfaces stay the same — only the container wiring changes).

- [ ] **Step 3: Delete old, commit new**

```bash
rm src/containers/Discover.js
git add src/containers/Discover.jsx
git add -u src/containers/Discover.js
git commit -m "Rewrite Discover with hooks, useParams, validation via selectIsValidMenuName"
```

---

## Task 19: Rewrite `containers/Genre` — `.js` → `.jsx`

Nearly identical structure to Discover. Same validation via `selectIsValidMenuName`. Dispatches `fetchMoviesGenre` instead.

**Files:**
- Create: `src/containers/Genre.jsx`
- Delete: `src/containers/Genre.js`

- [ ] **Step 1: Read current `src/containers/Genre.js`**
- [ ] **Step 2: Apply the same pattern as Discover (Task 18)**, but dispatch `fetchMoviesGenre({ name, page, sort })`. The sort parameter is usually read from another search param (check the current file).
- [ ] **Step 3: Delete old, commit new**

```bash
rm src/containers/Genre.js
git add src/containers/Genre.jsx
git add -u src/containers/Genre.js
git commit -m "Rewrite Genre with hooks, useParams, menu-name validation, fetchMoviesGenre"
```

---

## Task 20: Rewrite `containers/Search` — `.js` → `.jsx`

Search page. No menu validation (any query is valid). Reads `:query` from URL, dispatches `fetchMoviesSearch`.

**Files:**
- Create: `src/containers/Search.jsx`
- Delete: `src/containers/Search.js`

- [ ] **Step 1: Read current `src/containers/Search.js`**
- [ ] **Step 2: Apply hooks template**

```jsx
import { useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMoviesSearch } from '../slices/moviesSlice';
// ... component imports

const Search = () => {
  const { query } = useParams();
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const dispatch = useDispatch();
  const movies = useSelector((state) => state.movies);

  useEffect(() => {
    dispatch(fetchMoviesSearch({ query, page }));
  }, [query, page, dispatch]);

  // ... rest of JSX, same as Discover/Genre
};

export default Search;
```

- [ ] **Step 3: Delete old, commit new**

```bash
rm src/containers/Search.js
git add src/containers/Search.jsx
git add -u src/containers/Search.js
git commit -m "Rewrite Search with hooks and fetchMoviesSearch thunk"
```

---

## Task 21: Rewrite `containers/Movie` — `.js` → `.jsx`

The single-movie detail page. Dispatches `fetchMovie` + `fetchCredits` + `fetchRecommendations`. Has the `navigate(-1)` back button logic.

**Files:**
- Create: `src/containers/Movie.jsx`
- Delete: `src/containers/Movie.js`

- [ ] **Step 1: Read current `src/containers/Movie.js` (it's ~400 lines)**
- [ ] **Step 2: Apply hooks + navigate conversion**

Key conversion points:
- `connect` → `useSelector` + `useDispatch`.
- Replace `match.params.id` with `const { id } = useParams()`.
- `const navigate = useNavigate();` for navigation (back button).
- Dispatch order on mount/id change: `dispatch(fetchMovie(id))`, `dispatch(fetchCredits(id))`, `dispatch(fetchRecommendations({ id, page: 1 }))`.
- Replace `history.action === 'PUSH'` with `const canGoBack = window.history.state?.idx > 0;`
- Replace `history.goBack` with `() => navigate(-1)`
- `useSelector((state) => state.movie)` for movie + cast, `useSelector((state) => state.recommendations)` for recommendations.
- The old code had `history.push('/404')` when movie fetch returned empty — drop that; errorsSlice handles rejections, and a successful-but-empty fetch shouldn't route to 404. If a specific ID doesn't exist, TMDB returns 404 → thunk rejects → `/error` navigation via RouteGuard.
- Drop all `PUBLIC_URL` references.

Skeleton:

```jsx
import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { fetchMovie, fetchCredits } from '../slices/movieSlice';
import { fetchRecommendations } from '../slices/recommendationsSlice';
import Cast from '../components/Cast';
import MoviesList from '../components/MoviesList';
import Loading from '../components/Loading';
// ... other imports (Rating, styled-components, etc.)

const Movie = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data, cast, loading } = useSelector((state) => state.movie);
  const recommendations = useSelector((state) => state.recommendations);

  useEffect(() => {
    dispatch(fetchMovie(id));
    dispatch(fetchCredits(id));
    dispatch(fetchRecommendations({ id, page: 1 }));
  }, [id, dispatch]);

  const canGoBack = window.history.state?.idx > 0;

  if (loading || !data) return <Loading />;

  return (
    <MovieWrapper>
      {canGoBack && (
        <BackButton onClick={() => navigate(-1)}>Go Back</BackButton>
      )}
      {/* ... rest of the markup, preserved verbatim from old file ... */}
    </MovieWrapper>
  );
};

export default Movie;
```

- [ ] **Step 3: Delete old, commit new**

```bash
rm src/containers/Movie.js
git add src/containers/Movie.jsx
git add -u src/containers/Movie.js
git commit -m "Rewrite Movie with hooks, useParams, useNavigate, split fetch thunks"
```

---

## Task 22: Rewrite `containers/Person` — `.js` → `.jsx`

Similar to Movie. Dispatches `fetchPerson` + `fetchMoviesForPerson`. Same `navigate(-1)` back button.

**Files:**
- Create: `src/containers/Person.jsx`
- Delete: `src/containers/Person.js`

- [ ] **Step 1: Read current `src/containers/Person.js`**
- [ ] **Step 2: Apply the Movie template, substituting `fetchPerson` + `fetchMoviesForPerson`**

```jsx
// Relevant imports and dispatches:
import { fetchPerson } from '../slices/personSlice';
import { fetchMoviesForPerson } from '../slices/moviesForPersonSlice';

// Inside component:
const { id } = useParams();
const navigate = useNavigate();
const dispatch = useDispatch();
const { data: personData, loading } = useSelector((state) => state.person);
const moviesForPerson = useSelector((state) => state.moviesForPerson);

useEffect(() => {
  dispatch(fetchPerson(id));
  dispatch(fetchMoviesForPerson({ id, page: 1, sort: 'popularity.desc' }));
}, [id, dispatch]);

const canGoBack = window.history.state?.idx > 0;

// ... back button: {canGoBack && <div onClick={() => navigate(-1)}>Go Back</div>}
```

- [ ] **Step 3: Delete old, commit new**

```bash
rm src/containers/Person.js
git add src/containers/Person.jsx
git add -u src/containers/Person.js
git commit -m "Rewrite Person with hooks, fetchPerson, fetchMoviesForPerson"
```

---

## Task 23: Rewrite `containers/ShowError` — `.js` → `.jsx`

The error page. Reads the error from `state.errors`, displays it, and dispatches `clearError` when the user clicks "go home". The `clearError` must fire *before* navigation — otherwise RouteGuard sees non-null errors and re-navigates back to `/error` in a loop.

**Files:**
- Create: `src/containers/ShowError.jsx`
- Delete: `src/containers/ShowError.js`

- [ ] **Step 1: Read current `src/containers/ShowError.js`**

- [ ] **Step 2: Apply the template**

```jsx
import { useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearError } from '../slices/errorsSlice';
// ... styled-components imports, etc.

const ShowError = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const error = useSelector((state) => state.errors);

  const handleHomeClick = useCallback(() => {
    dispatch(clearError());
    navigate('/');
  }, [dispatch, navigate]);

  // Show a message based on `error` (which is the serialized error object).
  // The old code used `error?.status` from the axios response; with RTK's
  // default serializer, the shape is { name, message, stack }. You can
  // keep displaying error.message or extend with rejectWithValue later.

  return (
    <ErrorWrapper>
      <h1>Ooops!</h1>
      <p>{error?.message ?? "Something went wrong"}</p>
      <button onClick={handleHomeClick}>Go Home</button>
    </ErrorWrapper>
  );
};

export default ShowError;
```

Note: the old code read `err.response` (an axios response object) off the error and displayed status codes. RTK's default thunk serializer captures only `{ name, message, stack }` from thrown errors. To preserve richer error info, you'd need `rejectWithValue(err.response)` in each thunk and read `action.payload` instead of `action.error`. For the initial migration, use `error?.message` and defer the richer-error refactor.

- [ ] **Step 3: Delete old, commit new**

```bash
rm src/containers/ShowError.js
git add src/containers/ShowError.jsx
git add -u src/containers/ShowError.js
git commit -m "Rewrite ShowError with hooks, clear-before-navigate pattern"
```

---

## Task 24: Rewrite `components/SearchBar` — `.js` → `.jsx`

The search input in the top bar. Replaces the singleton `history.push` with `useNavigate`. Drops `PUBLIC_URL`.

**Files:**
- Create: `src/components/SearchBar.jsx`
- Delete: `src/components/SearchBar.js`

- [ ] **Step 1: Create `src/components/SearchBar.jsx`**

Full content (the old file is 147 lines; I've already read it — preserving it verbatim with only the two conversions):

```jsx
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Form = styled.form`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px var(--shadow-color);
  background-color: var(--color-primary-dark);
  border: 1px solid var(--color-primary);
  width: ${(props) => (props.$state ? '30rem' : '2rem')};
  cursor: ${(props) => (props.$state ? 'auto' : 'pointer')};
  padding: 2rem;
  height: 2rem;
  outline: none;
  border-radius: 10rem;
  transition: all 300ms cubic-bezier(0.645, 0.045, 0.355, 1);

  @media ${(props) => props.theme.mediaQueries.large} {
    background-color: var(--color-primary);
    border: 1px solid transparent;
    padding: 1.5rem;
  }

  @media ${(props) => props.theme.mediaQueries.smallest} {
    max-width: 25rem;
  }
`;

const Input = styled.input`
  font-size: 14px;
  line-height: 1;
  font-weight: 300;
  background-color: transparent;
  width: 100%;
  margin-left: ${(props) => (props.$state ? '1rem' : '0rem')};
  color: var(--text-color);
  border: none;
  transition: all 300ms cubic-bezier(0.645, 0.045, 0.355, 1);

  @media ${(props) => props.theme.mediaQueries.large} {
    font-size: 13px;
  }

  @media ${(props) => props.theme.mediaQueries.medium} {
    font-size: 12px;
  }

  @media ${(props) => props.theme.mediaQueries.small} {
    font-size: 11px;
  }

  &:focus,
  &:active {
    outline: none;
  }

  &::placeholder {
    color: var(--text-color);
  }
`;

const Button = styled.button`
  line-height: 1;
  pointer-events: ${(props) => (props.$state ? 'auto' : 'none')};
  cursor: ${(props) => (props.$state ? 'pointer' : 'none')};
  background-color: transparent;
  border: none;
  outline: none;
  color: var(--text-color);

  @media ${(props) => props.theme.mediaQueries.large} {
    color: var(--text-color);
    font-size: 10px;
  }

  @media ${(props) => props.theme.mediaQueries.small} {
    color: var(--text-color);
    font-size: 8px;
  }
`;

const SearchBar = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [state, setState] = useState(false);
  const node = useRef();
  const inputFocus = useRef();

  useEffect(() => {
    const handleClick = (e) => {
      if (node.current?.contains(e.target)) return;
      setState(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const onFormSubmit = (e) => {
    e.preventDefault();
    if (input.length === 0) return;
    setInput('');
    setState(false);
    navigate(`/search/${input}`);
  };

  return (
    <Form
      $state={state}
      onClick={() => {
        setState(true);
        inputFocus.current.focus();
      }}
      onSubmit={onFormSubmit}
      ref={node}
    >
      <Button type="submit" $state={state}>
        <FontAwesomeIcon icon={'search'} size="1x" />
      </Button>
      <Input
        onChange={(e) => setInput(e.target.value)}
        ref={inputFocus}
        value={input}
        $state={state}
        placeholder="Search for a movie..."
      />
    </Form>
  );
};

export default SearchBar;
```

Changes from the old file:
- `import history from '../history'` → `import { useNavigate } from 'react-router-dom'`
- `history.push(\`${process.env.PUBLIC_URL}/search/${input}\`)` → `navigate(\`/search/${input}\`)`
- `state` and `$state` prop prefix on styled-components (v6 transient prop convention)
- `handleClick` moved inside `useEffect` (was defined outside, which was stale-closure-prone)

- [ ] **Step 2: Delete the old file**

```bash
rm src/components/SearchBar.js
```

- [ ] **Step 3: Commit**

```bash
git add src/components/SearchBar.jsx
git add -u src/components/SearchBar.js
git commit -m "Rewrite SearchBar with useNavigate and transient styled-components props"
```

---

## Task 25: Rewrite other components that reference `PUBLIC_URL`

Five components (`NotFound`, `MovieItem`, `CastItem`, `Pagination`, `Logo`) use `process.env.PUBLIC_URL` inside `<Link to={...}>` or similar. Each needs the `PUBLIC_URL` prefix stripped, then the file renamed from `.js` to `.jsx`.

**Files:**
- Create (by rename + edit): `src/components/NotFound.jsx`, `MovieItem.jsx`, `CastItem.jsx`, `Pagination.jsx`, `Logo.jsx`
- Delete: the 5 corresponding `.js` files

- [ ] **Step 1: For each of the 5 files, read the current content and create a `.jsx` version with `PUBLIC_URL` removed**

Find-and-replace pattern: `` `${process.env.PUBLIC_URL}/...` `` → `` `/...` `` (remove the interpolation; `PUBLIC_URL` is always empty string when hosted at the domain root).

Also: `process.env.PUBLIC_URL + '/'` → `'/'`. Watch for both template-literal and string-concat forms.

For each file, the process is:
1. `cat src/components/<Name>.js` (read current content)
2. Create `src/components/<Name>.jsx` with `PUBLIC_URL` removed
3. Verify no other changes

- [ ] **Step 2: Delete the 5 old files**

```bash
rm src/components/NotFound.js src/components/MovieItem.js src/components/CastItem.js src/components/Pagination.js src/components/Logo.js
```

- [ ] **Step 3: Commit**

```bash
git add src/components/NotFound.jsx src/components/MovieItem.jsx src/components/CastItem.jsx src/components/Pagination.jsx src/components/Logo.jsx
git add -u src/components/NotFound.js src/components/MovieItem.js src/components/CastItem.js src/components/Pagination.js src/components/Logo.js
git commit -m "Rename 5 components to .jsx and strip PUBLIC_URL references"
```

---

## Task 26: Pure renames — remaining components `.js` → `.jsx`

Nine components have no content changes, only the extension rename. Use `git mv` to preserve history.

**Files (9 renames):**
- `src/components/Rating.js` → `.jsx`
- `src/components/Loading.js` → `.jsx`
- `src/components/Cast.js` → `.jsx`
- `src/components/MoviesList.js` → `.jsx`
- `src/components/Header.js` → `.jsx`
- `src/components/SortBy.js` → `.jsx`
- `src/components/MenuItem.js` → `.jsx`
- `src/components/Button.js` → `.jsx`
- `src/components/Loader.js` → `.jsx`

- [ ] **Step 1: Rename all nine**

```bash
cd src/components
for f in Rating Loading Cast MoviesList Header SortBy MenuItem Button Loader; do
  git mv "${f}.js" "${f}.jsx"
done
cd ../..
```

- [ ] **Step 2: Verify**

```bash
ls src/components/*.js 2>&1 || echo "no .js left"
ls src/components/*.jsx
```
Expected: no `.js` files remaining in `src/components/`, all 15 should be `.jsx`.

- [ ] **Step 3: Commit**

```bash
git commit -m "Rename pure components .js → .jsx (no content change)"
```

---

## Task 27: Update `src/api/tmdb.js`

Two changes: axios baseline (no API surface change, just a version bump via Task 2's `package.json`) and swap `process.env.REACT_APP_API` for `import.meta.env.VITE_TMDB_KEY`.

**Files:**
- Modify: `src/api/tmdb.js`

- [ ] **Step 1: Replace the entire contents of `src/api/tmdb.js`**

```js
import axios from 'axios';

export default axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    api_key: import.meta.env.VITE_TMDB_KEY,
  },
});
```

- [ ] **Step 2: Commit**

```bash
git add src/api/tmdb.js
git commit -m "Update tmdb API wrapper to import.meta.env for Vite"
```

---

## Task 28: First install + build loop

The moment of truth. Run `npm install` and then `npm run build`. Iterate on errors until the build succeeds.

**Files:**
- Create: `node_modules/` (via install)
- Create: `package-lock.json` (regenerated)
- Create: `dist/` (via build)

- [ ] **Step 1: Run `npm install`**

```bash
npm install
```
Expected: resolves all dependencies, regenerates `package-lock.json`, populates `node_modules/`. May show deprecation warnings — those are harmless. Should NOT show native compilation errors (`node-gyp`, `node-sass`), because we dropped node-sass.

If installation fails:
- Check the error — usually a peer dep mismatch with React 19 for an older package
- Pin the specific package to a version that matches React 19 (e.g., `react-helmet-async` 2.x, `react-redux` 9.x)
- Re-run `npm install`

- [ ] **Step 2: Run `npm run build`**

```bash
npm run build
```
Expected: Vite builds, outputs to `dist/`, finishes with something like `✓ built in 3.21s`.

- [ ] **Step 3: Fix build errors iteratively**

Common errors and their fixes:

**"Failed to resolve import 'X'"**
- A file is importing from an old path (`../history`, `../actions`, `../reducers`). Search the codebase:
  ```bash
  grep -rn "from '../history'\|from '../actions\|from '../reducers'" src/
  ```
  Each match needs to be updated to import from `../slices/<name>Slice` or to be dropped entirely.

**"Cannot find module 'react-scripts'"**
- A file has a leftover import. Search:
  ```bash
  grep -rn "react-scripts" src/
  ```
  Remove the import.

**"process is not defined"**
- A file still references `process.env.PUBLIC_URL` or `process.env.REACT_APP_*`. Search:
  ```bash
  grep -rn "process\.env" src/
  ```
  Replace with `import.meta.env.VITE_*` (for real env vars) or just delete (for `PUBLIC_URL`).

**"X is not exported from 'react-router-dom'"**
- Usually `withRouter`, `Switch`, `Redirect`. These are v6+ removed. Replace with hooks (`useNavigate`, `useLocation`, `useParams`) or the v7 equivalents (`<Routes>`, `<Navigate>`).

**styled-components "Received 'state'/'isMobile' etc. for a non-boolean attribute"**
- v6 now warns when non-DOM props aren't prefixed with `$`. Find the offending styled component and rename `props.state` → `props.$state` in both the styled definition and the JSX call site.

**"Cannot read properties of undefined (reading 'config')"** (likely at runtime, not build)
- A container is still reading `state.geral`. Grep:
  ```bash
  grep -rn "state\.geral\|state\.recommended[^s]\|state\.moviesPerson[^_]" src/
  ```
  Rename to `state.config`, `state.recommendations`, `state.moviesForPerson`.

Fix each error, re-run `npm run build`, repeat until it succeeds.

- [ ] **Step 4: Commit any fixes**

```bash
git add -A
git commit -m "Fix build errors surfaced by first npm run build

(list specific fixes applied here)"
```

If no fixes were needed, skip this step.

- [ ] **Step 5: Verify `dist/` contents**

```bash
ls dist/
```
Expected: `index.html`, `assets/` (with hashed JS and CSS), `favicon.ico`, `_redirects`, `preview.jpg`, `manifest.json`.

---

## Task 29: Local smoke test via `npm run dev`

Start the dev server, click through the app in a real browser, verify each route.

- [ ] **Step 1: Verify `.env.local` has a real TMDB key**

```bash
cat .env.local
```
Expected: contains `VITE_TMDB_KEY=<not the placeholder from the spec>`.

If the value is still `replace_me_with_real_tmdb_v3_api_key`, retrieve the real key from https://www.themoviedb.org/settings/api and update the file before proceeding.

- [ ] **Step 2: Start dev server**

```bash
npm run dev
```
Expected: Vite prints `Local: http://localhost:3000/`.

- [ ] **Step 3: Open the app in a browser**

Visit http://localhost:3000/ in a browser. Expected flow:

| Route | Expected behavior |
|---|---|
| `/` | Redirects to `/discover/Popular`, list of popular movies loads |
| Click a movie poster | Navigates to `/movie/:id`, movie detail + cast + recommendations load |
| Click a cast member | Navigates to `/person/:id`, person detail + filmography load |
| Back button on `/movie/:id` (if came from a list) | Returns to previous page |
| Sidebar item for current section | Highlighted visually |
| Type in search box and submit | Navigates to `/search/:query`, search results load |
| Visit `/genres/NotARealGenre` manually | Redirects to `/404` via `selectIsValidMenuName` |
| Visit `/discover/NotReal` manually | Redirects to `/404` |
| Temporarily break the API (set `VITE_TMDB_KEY=bad` in `.env.local`, restart dev server, revisit `/`) | Any fetch fails → `errorsSlice` populated → `<RouteGuard>` navigates to `/error` → error page renders with a message |
| On `/error`, click "go home" | `clearError()` dispatched → `navigate('/')` → no re-loop back to `/error` |

Restore the real TMDB key in `.env.local` after the error test.

- [ ] **Step 4: Fix anything broken**

For each broken behavior, diagnose:
- Check browser devtools console for React/Redux errors.
- Check Redux DevTools (if installed) for the action stream.
- Grep for the offending behavior in `src/`.
- Commit the fix with a descriptive message.

- [ ] **Step 5: Once every item in the table passes, commit any lingering fixes**

```bash
git add -A
git commit -m "Fix smoke-test issues: <specifics>"
```

- [ ] **Step 6: Stop the dev server** (`Ctrl+C`)

---

## Task 30: (User action) Cloudflare Pages dashboard changes

**This task requires the user to manually update Cloudflare Pages settings.** The agent running this plan cannot do this via API without CF tokens.

- [ ] **Step 1: Change build output directory**

- Open Cloudflare dashboard → `movie-library-react` project
- Navigate to: **Settings** → **Builds & deployments** → **Build configurations**
- **Build output directory**: change `build` → `dist`
- Save

- [ ] **Step 2: Add `VITE_TMDB_KEY` environment variable**

- Same project → **Settings** → **Variables and Secrets**
- **Add variable**:
  - Name: `VITE_TMDB_KEY`
  - Value: (paste the TMDB v3 API key from `.env.local`)
  - Environment: **Production** (and optionally **Preview**)
- Save

- [ ] **Step 3: (Optional) Delete the now-unused `REACT_APP_API` variable**

If the old CRA-era env var is still set on the Pages project, remove it. It's harmless but confusing.

- [ ] **Step 4: Confirm before proceeding to Task 31**

Once both settings are saved, you're ready to merge.

---

## Task 31: Merge `modernize` → `main` and deploy

Fast-forward merge the branch to `main` and push. Cloudflare Pages automatically builds on push to `main`.

- [ ] **Step 1: Run `npm run build` one last time on the branch to confirm green**

```bash
npm run build
```
Expected: successful build, `dist/` populated.

- [ ] **Step 2: Switch to `main`**

```bash
git checkout main
```

- [ ] **Step 3: Merge the branch**

```bash
git merge modernize --no-ff -m "Modernize to Vite + React 19 + RTK

Full rewrite off CRA/node-sass/React 16 onto Vite/React 19/React Router 7/
Redux Toolkit. See docs/superpowers/specs/2026-04-11-movie-library-modernization-design.md
for architectural context."
```

Using `--no-ff` to preserve a merge commit that clearly marks the modernization boundary. (Alternative: `--ff-only` for linear history — your preference.)

- [ ] **Step 4: Push to origin**

```bash
git push origin main
```

- [ ] **Step 5: Watch the Cloudflare Pages build**

Open the Cloudflare dashboard → `movie-library-react` → Deployments tab. The latest deployment should be in-progress (building the new commit).

Watch the build log. Expected:
- Clone succeeds
- `Detected the following tools from environment: nodejs@22.x.x`
- `npm install` succeeds (no node-gyp errors)
- `npm run build` succeeds (Vite builds to `dist/`)
- `Success: Assets published!`
- Deployment live

If the build fails on Cloudflare but succeeded locally:
- The most likely cause is a missing `VITE_TMDB_KEY` in the production env vars — verify Task 30 step 2 was actually saved.
- The second most likely cause is an unfrozen dep version that resolved differently on Cloudflare's registry mirror. Pin the offending version in `package.json` locally, commit, push.

---

## Task 32: Post-deploy verification

Visit the live site and repeat the smoke test from Task 29.

- [ ] **Step 1: Visit `https://movies.fidalgo.dev`**

Check each row of the Task 29 smoke-test table against production. Most common production-only issue: CORS or CSP blocking TMDB API calls — mitigated by confirming the env var is set, since TMDB doesn't enforce origin-based blocking.

- [ ] **Step 2: Check Cloudflare Pages analytics**

Pages dashboard → **Analytics** tab → confirm 2xx responses, no surge of 4xx/5xx. Bot traffic is still there (unavoidable) but now it's free.

- [ ] **Step 3: Delete the `modernize` branch**

Only after production is confirmed healthy:

```bash
git branch -d modernize
```

Leave the remote branch alone since it was never pushed.

- [ ] **Step 4: Celebrate — you're done.**

---

## Rollback (if production deploy fails)

If `Task 32 Step 1` shows a broken production site:

1. **Immediate**: Cloudflare dashboard → Deployments tab → find the last successful pre-migration deploy → click **Rollback**. Site is restored in seconds; no git action needed.
2. **Then diagnose**: check the failed build log. Most issues are env-var or version-pin related and can be fixed on a side branch.
3. **Re-deploy**: push the fix branch → verify preview deploy → merge to main when green.

See spec Section 10 for full rollback details.

---

## Notes on execution

- **Each task should end with a clean working tree** (`git status` shows nothing uncommitted). If a task gets interrupted mid-commit, finish the commit before moving on.
- **Do not push `modernize` to origin** until Task 31. Intermediate pushes fire (failing) preview builds on Cloudflare.
- **Containers and components in Tasks 16–26 have templates but not full code** — the plan assumes you read the current file before rewriting. The conversions are mechanical but require the original JSX structure for visual fidelity.
- **If you get stuck at Task 28 (first build)**, the problem is almost always an import referring to a deleted file. Grep for the error symbol first; don't scroll the log.
