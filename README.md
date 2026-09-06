# FySim

A 2D rigid-body physics engine and interactive simulation tool, written from
scratch in JavaScript and WebGL. Built January-May 2018 as a bachelor thesis at
the University of Stavanger: *Simulating Classical Mechanics on a Web Platform*
(`docs/`).

I wrote the physics engine, the graphics engine and the simulation tool. A
partner wrote the surrounding web platform - accounts, groups, a forum, scene
storage - and hosted the site. That hosting is gone, so this repo runs the
simulator on its own machine, with a small local host in place of the original
MySQL-backed Flask application.

![Discs, gears and boxes dropped into the starter scene](docs/screenshot.png)

## Running it

No dependencies, no build step. Python 3 and a browser with WebGL:

```sh
python3 serve.py
```

Then open <http://127.0.0.1:8000/>. `--port` and `--host` are available if 8000
is taken.

Scenes you save are written to `scenes.db`, a SQLite file created next to
`serve.py` on first run. Delete it to start clean.

## Using the tool

The panel on the right holds four tabs:

| Tab     | What it does                                                        |
| ------- | ------------------------------------------------------------------- |
| Draw    | Spawn squares, discs and gears, or draw a free-form polygon          |
| Tools   | Attach hinges, ropes and pulleys between bodies                      |
| Inspect | Read and write live properties, move, delete, pin, show force vectors |
| Scene   | Freeze, pause, and save or load a scene                              |

Drawing a polygon: pick **Draw → Polygon**, left-click to place each corner
(the running angle and segment length are shown at the cursor), right-click to
undo a corner, and press Enter to close the shape. **Draw → Polygon** has a mode
selector for whether the result is static or dynamic, and a snapping mode for
polar or cartesian increments.

Inspecting: pick **Inspect → Object properties** and click a body. The popup
shows position, velocity, orientation, angular velocity, density, mass and the
three friction/restitution constants - all editable, with Apply and Delete.

## What is in the engine

Written for the thesis, in `web/sim_static/`:

- `physics_engine/` - the simulation core. Collision is defined over the
  interval between ticks rather than at an instant, so a body moving fast
  between two frames is still caught. Pair-finding is an O(n^2) loop over
  polygons rejected by an axis-aligned bounding box test; collision groups
  carry contact state across ticks so resting stacks settle instead of
  jittering.
- `physics_engine/collision_box_handeler/` - an abandoned optimisation. It is a
  sorted structure meant to bring pair-finding below O(n^2), but measuring it
  showed the constant-factor overhead lost to the plain bounding box loop at
  the object counts this tool actually runs, so it is not wired in. Left in the
  tree because it is part of the thesis.
- `physics_engine/polygon/` - arbitrary polygons with holes, area, centre of
  mass and moment of inertia derived from the geometry.
- `physics_engine/{hinge,fixed,rope,pulley}*.js` - constraints.
- `graphics/` - a small WebGL renderer: shader programs, vertex and element
  buffers, meshes, an orthographic camera, and a debug pass for force vectors
  and collision boxes.
- `utilities/` - vector and column-major 3×3 matrix maths, a seeded RNG (the
  simulation is deterministic), linked list and queue.
- `user_interface/` - the tool modes: spawning, drawing, dragging, constraint
  placement, undo/redo, screenshots.
- `physics_simulator.js` - the public API the web front-end talks to.
  `how_to_use.txt` in the same folder is its reference, written for my partner
  at the time; it is still accurate.

The engine is self-contained. It needs a `<canvas>` and nothing else:

```js
var ps = new PhysicsSimulator(document.getElementById('canvas'));
ps.setModeCustomShapeSpawner();
ps.setCustomShape(PhysicsSimulator.DISC);
```

`web/local/boot.js` builds the starter scene against that same API, if you want
a worked example.

## Layout

```
serve.py              local dev host: static files + the scene API, stdlib only
web/                  <- this folder is the deployment; upload it as-is
  index.html          the standalone page
  local/              written for this build
    base.js           finds the install path, so the folder runs at any URL
    scenes.js         scene save/load: a real server if there is one,
                      otherwise the browser's localStorage
    boot.js           boots gui + sim, stands in for the login and router
                      modules, and lays out the starter scene
    app.css           layout so the simulator fills the window
  sim_static/         the engine, the renderer and the tool GUI  (original)
  gui_static/         shared GUI widgets                          (original)
  _static/            front-end framework and stylesheets         (original)
docs/                 the thesis, and the screenshot above
```

Everything under `sim_static/`, `gui_static/` and `_static/` is the 2018 source.
No file there has been edited. Eight dead ones were removed: the client-side
router and its library, the original multi-page entry point, a stale `index.html`
and test page that referenced files deleted years ago, and two unused test
shaders.

## How the original was cut down

The site was a full platform: seven front-end modules booted against a Flask app
with MySQL-backed users, groups, messages and a forum. The simulator itself is
only two of those modules, and it turned out the tool GUI already had an entry
point with no account behind it - `sim.jML.structure.public_panel`, the
simulator as it appeared on the public front page.

So `web/local/boot.js` loads `gui` and `sim`, and substitutes the rest:

- **usr** - a fixed local user. The tool checks `login.loggedin` to decide
  whether to offer scene saving; here it is always true.
- **router** - a no-op. There is one page.

`serve.py` serves the module static folders at the URLs the original front-end
requests (`/sim_static/...`, `/gui_static/...`, `/_static/...`) and reimplements the
four endpoints the tool actually calls, against SQLite instead of MySQL:

| Endpoint                                | Purpose               |
| --------------------------------------- | --------------------- |
| `GET  /sim/get?action=my_scenes`        | list saved scenes     |
| `GET  /sim/get?action=scene`            | one scene's metadata  |
| `GET  /sim/get?action=scene_body`       | one scene's body      |
| `POST /sim/form?action=save_scene`      | save a scene          |

The response envelope matches the original `common.Packet` shape, so the
front-end's request layer is unmodified.

## Hosting it

**Upload the `web/` folder. That is the whole deployment.** No Python on the
server, no database, no build step - it is static files, so it works on any web
host, including PHP-only shared hosting.

Rename it to whatever you want the URL to be:

```
fjellheim.org/markus/game/fysim/     <- upload web/ as "fysim"
```

It works at a domain root, on a subdomain, or at any depth of subdirectory -
`web/local/base.js` works out where it lives from its own script URL.

Scenes are then saved in the visitor's browser (localStorage), capped at eight,
oldest dropped when full. Each visitor gets their own; nothing is shared and
nothing is stored on your server.

`serve.py` is for local development only. It is a single-process host with no
TLS and no access control, and its scene endpoints are open to anyone who can
reach it, so don't put it on a public address. It stays useful locally: when the
page is served by it, scenes go to SQLite instead of the browser. The page
probes for a server on the first save and remembers the answer, so the same
`web/` folder does the right thing in both places.

If you later want scenes shared between visitors, the four endpoints in the
table above are the entire contract - around 80 lines of PHP against MySQL, and
nothing in the front-end changes.

### If it breaks after uploading

Open the browser console. The renderer fetches its GLSL over HTTP, so a blank
blue canvas with the toolbar drawn means the `.vert` / `.frag` files under
`web/sim_static/graphics/shaders/` did not arrive. Check they uploaded, and that
the host is not refusing unknown file extensions.

## Testing changes

The tool is WebGL and mouse-driven, so a page that loads proves very little.
Drive it in headless Chrome and check state, not just pixels:

```sh
python3 serve.py --port 8017 &
google-chrome --headless=new --disable-gpu --enable-unsafe-swiftshader \
    --window-size=1280,900 --virtual-time-budget=8000 \
    --screenshot=shot.png http://127.0.0.1:8017/
```

For anything interactive, attach to `--remote-debugging-port` and read back
`window.physicsSimulator.animator.animatedObjects` positions over a few seconds.
Bodies quietly falling through the floor look identical to bodies at rest in a
single frame.
