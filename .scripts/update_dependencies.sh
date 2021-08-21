#!/usr/bin/env bash
# MIT © Sindre Sorhus - sindresorhus.com
# https://gist.github.com/sindresorhus/7996717
# https://gist.github.com/GianlucaGuarini/8001627

# git hook to run a command after `git pull` if a specified file was changed
# Run `chmod +x post-merge` to make it executable then put it into `.git/hooks/`.

changed_files="$(git diff-tree -r --name-only --no-commit-id ORIG_HEAD HEAD)"

check_run() {
	echo "$changed_files" | grep -E --quiet "$1" && eval "$2"
}

# run yarn when yarn.lock changed
check_run "yarn.lock" "yarn"
