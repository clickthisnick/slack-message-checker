#!/usr/bin/env bash

# apm is atom package manager
APM_DIR="$(which apm)"

# If APM_DIR is unset or empty string ("")
if [ -z "$APM_DIR" ]
then
  echo "Open Atom and run \"Window: Install Shell Commands\" from the Command Palette."
else
  # File icons https://atom.io/packages/file-icons
  apm install file-icons

  # Linter https://atom.io/packages/linter
  apm install linter

  # Formats code https://atom.io/packages/atom-beautify
  apm install atom-beautify

  # Lints javascript https://atom.io/packages/linter-eslint
  apm install linter-eslint

  # Open recent files option https://atom.io/packages/open-recent
  apm install open-recent

  # Shows all TODO, FIXME, CHANGED in projects https://atom.io/packages/todo-show
  apm install todo-show

  # Show a minimap of the source code https://atom.io/packages/minimap
  apm install minimap

  # Highlights selected text https://atom.io/packages/highlight-selected
  apm install highlight-selected

  # Hightlights selected text in minimap https://atom.io/packages/minimap-highlight-selected
  apm install minimap-highlight-selected

  # Display colors in files https://atom.io/packages/pigments
  apm install pigments

  # Detects the indentation per file https://atom.io/packages/auto-detect-indentation
  apm install auto-detect-indentation

  # Alt and drag to select multiple vertical chars https://atom.io/packages/sublime-style-column-selection
  apm install sublime-style-column-selection

  # Git command in atom https://atom.io/packages/git-plus
  apm install git-plus

  # Drag and drop code https://atom.io/packages/simple-drag-drop-text
  apm install simple-drag-drop-text

  # Tool to help with merge conflicts https://atom.io/packages/merge-conflicts
  apm install merge-conflicts

  # Show commit history for changes https://atom.io/packages/git-time-machine
  apm install git-time-machine

  # Auto documentation starter https://atom.io/packages/docblockr
  apm install docblockr

  # Auto update atom packages auto-update-packages
  apm install auto-update-packages

  # Go To defintion https://atom.io/packages/goto-definition
  apm install goto-definition

  # Git blame https://atom.io/packages/git-blame
  apm install git-blame

  # Javascript hotkey snippets https://atom.io/packages/turbo-javascript
  apm install turbo-javascript

  # Align code https://atom.io/packages/aligner
  apm install aligner

  # Aligner support for js https://atom.io/packages/aligner-javascript
  apm install aligner-javascript

  # Spell checking https://atom.io/packages/linter-spell
  apm install linter-spell

  # Typescript https://atom.io/packages/atom-typescript
  apm install atom-typescript

  # Typescript linter, also needed to autocompile https://atom.io/packages/linter-tslint
  apm install linter-tslint

fi
