"""
Ensure the `backend/` directory is importable when running from repo root.

This keeps existing imports like `from database.database import ...` working
when starting the app as `uvicorn backend.main:app`.
"""

from __future__ import annotations

import sys
from pathlib import Path


_ROOT = Path(__file__).resolve().parent
_BACKEND = _ROOT / "backend"

if _BACKEND.exists():
    backend_str = str(_BACKEND)
    if backend_str not in sys.path:
        # Prepend so local modules win over any similarly-named installed packages.
        sys.path.insert(0, backend_str)

