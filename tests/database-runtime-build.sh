#!/bin/bash
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "$0")/../.zscripts" && pwd)"
TEST_ROOT="$(mktemp -d)"
trap 'rm -rf "$TEST_ROOT"' EXIT
mkdir -p "$TEST_ROOT/bin" "$TEST_ROOT/project"
# Packaging mechanics only; actual database behavior is covered by test:integration.
cat >"$TEST_ROOT/bin/npm" <<'EOF'
#!/bin/bash
set -euo pipefail
if [ "$1" = run ] && [ "$2" = db:setup ]; then
  target="${ROUTEWISE_DATABASE_URL#file:}"
  mkdir -p "$(dirname "$target")"
  if [ ! -e "$target" ]; then printf 'fresh catalog\n' >"$target"; fi
elif [ "$1" = run ] && [ "$2" = db:backup ] && [ "$3" = -- ]; then
  printf 'explicit snapshot\n' >"$4"
else
  echo 'unexpected npm invocation' >&2; exit 1
fi
EOF
chmod +x "$TEST_ROOT/bin/npm"
export PATH="$TEST_ROOT/bin:$PATH"
PROJECT_DIR="$TEST_ROOT/project" BUILD_DIR="$TEST_ROOT/fresh" bash "$SCRIPT_DIR/database-runtime-build.sh"
test "$(cat "$TEST_ROOT/fresh/db/routewise.sqlite")" = 'fresh catalog'
PACKAGE_PREVIEW_DB=1 PROJECT_DIR="$TEST_ROOT/project" BUILD_DIR="$TEST_ROOT/copied" bash "$SCRIPT_DIR/database-runtime-build.sh"
test "$(cat "$TEST_ROOT/copied/db/routewise.sqlite")" = 'explicit snapshot'
if PROJECT_DIR="$TEST_ROOT/project" BUILD_DIR="$TEST_ROOT/fresh" bash "$SCRIPT_DIR/database-runtime-build.sh"; then exit 1; fi
test "$(cat "$TEST_ROOT/fresh/db/routewise.sqlite")" = 'fresh catalog'
echo 'database runtime packaging tests passed'
