from __future__ import annotations

from pathlib import Path

# Make `import routes.*` resolve to `backend/routes/*` when running from repo root.
__path__ = [str((Path(__file__).resolve().parent.parent / "backend" / "routes").resolve())]

