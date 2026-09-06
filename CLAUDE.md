This repo holds the physics engine and tool from my 2018 bachelor thesis, plus a
small local host that runs it without the original server.

Two kinds of code live here, and the distinction matters:

Original sources, kept verbatim:
	web/sim_static/  - the physics engine, graphics engine and tool GUI
	web/gui_static/  - shared GUI widgets
	web/_static/     - the front-end framework and stylesheets
Treat these as archival. Do not reformat, modernise or restyle them. Change one
only to fix something that is actually broken when run locally, and say up front
what you changed and why.

New code, written for the local build:
	serve.py         - static host plus the scene save/load API
	web/index.html
	web/local/       - boot script and layout overrides

For new code:
	ES5 in the browser (var, function, prototypes) to match the surrounding
	sources; no build step, no bundler, no npm dependencies.
	Python 3, standard library only. No Flask, no pip install.
	Keep the local build a thin shim. Behaviour belongs in the original engine.

Follow principles:
Single responsibility
- A function that branches into two unrelated behaviors (e.g. by role) is usually
  two functions wearing one name; split it, and push the branch to the caller if
  the caller already knows which one applies.
Segregation of interface and implementation
Non cyclic dependencies (hirearchical or layer based ect)
- A dependency can be hard (a direct call) or soft (module A holds an index into
  module B's array). If A depends on B, then B defines the interface for
  communication, A initiates communication. B is an exportable tool.
Reproducibility
- Should be deterministic. The engine seeds its own RNG for this reason; keep it
  that way.
Limit the size of a module to below ~1000 lines of code.

Limit line width to 100 columns.

Write comments as if the code always looked this way; no "previously," "this
fixes," or "to prevent X we now do Y" narration.
Bad: "// ramps down near target pos, prevents overshoot oscillations from the bug where..."
Good: "// ramps velocity to zero at the target pos to avoid oscillations at rest"

Never commit code yourself using git.

Edit files with the Edit and Write tools, never with sed, perl, heredocs or shell
redirection. Those tools render a red/green diff and the shell does not, and I want to
see every change you make to a file. This holds in auto mode too, whatever the mode's
own guidance says. Reading with cat, sed -n, grep and find is fine.
If a change genuinely needs the shell -- a bulk rename across many files, a generated
file, a binary -- go ahead, but say up front that you are doing it and why, and show me
the resulting diff afterwards.

To test changes: start the server, drive the page in headless Chrome, and check
both the console output and a screenshot. A page that loads is not proof the
physics runs; read back object positions over time. See README.md.
