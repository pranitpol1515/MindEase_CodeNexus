from __future__ import annotations

from pathlib import Path

# Make `import models.*` resolve to `backend/models/*` when running from repo root.
__path__ = [str((Path(__file__).resolve().parent.parent / "backend" / "models").resolve())]

