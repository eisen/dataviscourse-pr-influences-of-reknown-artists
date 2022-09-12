#!/usr/bin/env bash

dvp () {
  local CURRENT_DIR=$(pwd)

  # check the env is set
  if [[ -z "$DVP_PATH" ]]; then
    echo -e "\n========================================================================"
    echo -e "@datavis/cli cannot be used because the \$DVP_PATH env is not"
    echo -e "set. Make sure you followed the setup instructions in the README.md"
    echo -e "========================================================================\n"
    return 1
  fi

  local REPOS=$(ls $DVP_PATH/packages)

  # mono repo package nav and script access
  if [[ -z "$1" ]]; then
    cd "$DVP_PATH"
  else
    if [[ "$1" == "src" ]]; then
      echo "Sourcing cli..."
      source "$DVP_PATH/packages/cli/cli.sh"
    elif [[ "$1" == "clean:bootstrap" ]]; then
      # TODO: move this to a script used by root package.json
      ecc clean
      # TODO: instead of looping, we can instead run `lerna exec`
      for REPO in $REPOS; do
        ecc $REPO clean
      done
      ecc bootstrap
    elif [[ "$1" == "gh" ]]; then
      URL=$(git remote get-url origin --push)
      open "$URL"
    elif [[ "$1" == "install" ]]; then
      cd "$DVP_PATH"
      npm install
      cd "$CURRENT_DIR"
    # check if first arg is one of the packages
    elif [[ "${REPOS[@]}" =~ "$1" ]]; then
      local REPO_NAME="$1"
      local CMD="$2"
      cd "$DVP_PATH/packages/$REPO_NAME"
      if [[ ! -z "$2" ]]; then
        if [[ "$CMD" == "add" ]]; then
          local NPM_PKG="$3"
          echo "npx lerna add "$NPM_PKG" "packages/$REPO_NAME" "${@:4}""
          npx lerna add "$NPM_PKG" "packages/$REPO_NAME" "${@:4}"
        else
          npm run "$CMD"
        fi

        # return to the caller's original directory
        cd "$CURRENT_DIR"
      fi 
    else
      cd "$DVP_PATH"
      npm run "$1"

      # return to the caller's original directory
      cd "$CURRENT_DIR"
    fi
  fi

}