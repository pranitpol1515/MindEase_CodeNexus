from __future__ import annotations

from pathlib import Path

# Make `import database.*` resolve to `backend/database/*` when running from repo root.
__path__ = [str((Path(__file__).resolve().parent.parent / "backend" / "database").resolve())]

