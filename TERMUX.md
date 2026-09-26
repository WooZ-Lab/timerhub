# TimerHub development in Termux

Codex command execution in Termux needs to run without Bubblewrap. Termux on
Android does not provide the Linux namespace setup that Codex's Bubblewrap
sandbox requires. Configure Codex for `danger-full-access` in the top level of
`$CODEX_HOME/config.toml` (normally `~/.codex/config.toml`):

```toml
approval_policy = "never"
sandbox_mode = "danger-full-access"
```

Keep these keys before any table header such as `[tui]`. TOML keys after a
table header belong to that table, so putting `sandbox_mode` under `[tui]`
silently leaves Codex at its default `workspace-write` mode, which fails when
Codex tries to build a Bubblewrap command.

The Termux app runs as an Android application user, so `danger-full-access`
means commands are unrestricted within that app's Android permissions. Use
this setup only when that access model is intended.

This repository is on Android shared storage, which does not support the
symlinks npm normally creates in `node_modules/.bin`. Install dependencies
with:

```sh
npm install --bin-links=false --ignore-scripts
```

This installs the JavaScript dependencies without native package install
scripts. Wrangler's local Worker runtime (`workerd`) does not support Android
ARM64, so `wrangler dev` cannot run natively in Termux. Use a Linux environment
for local Worker emulation. The static TimerHub app can still be served with
Python's HTTP server.

The Codex shell, filesystem, network, npm registry, and git remote checks have
been verified with this configuration. Worker route behavior can be exercised
with a local mock harness, but that does not replace a Cloudflare runtime or
deployed endpoint test.
