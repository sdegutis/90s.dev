# API Reference

## Core

- `Ref`: Dynamic pointer

- `$`: Convenience for `new Ref(...)`

## IPC/RPC

- `BC`: Like `BroadcastChannel` but scoped to current user-agent (e.g. tab).
  The default event types are `SysEvent`, `KeyEvent`, `ProcEvent`, and `PanelEvent`
