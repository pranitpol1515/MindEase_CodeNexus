from __future__ import annotations

from pathlib import Path

# Make `import ai.*` resolve to `backend/ai/*` when running from repo root.
__path__ = [str((Path(__file__).resolve().parent.parent / "backend" / "ai").resolve())]

