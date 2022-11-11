# CS 6660 Project: Influences of Reknown Artists
## Project for Visualization for Data Sciences - Fall 2022

Team Members:
* Nishita Karcher - nishita.karcher@utah.edu
* Nick Lord-Ender-Laing - u1368438@utah.edu
* Eisen Montalvo - eisen.montalvo@utah.edu

# Overview

## Setup

`dvp` is a monorepo, setup with [lerna](https://github.com/lerna/lerna) 

```bash
# run this in the datavispr root directory
# to install and link all the packages
npm run bootstrap
```

* or with the `dvp` cli:
```bash
dvp bootstrap
# or
dvp bs
```
> If you add or remove dependencies, make sure to rerun the bootstrap command

### Packages Overview

* `be`: Backend Apollo GraphQL api
* `fe`: Frontend SvelteKit app
* `cli`: optional shell tool

> The root folder of `dvp` has a `package.json` as well. Some `devDependencies` like
> `jest` are hoisted to the root so that the packages can share them

## CLI

The `dvp` cli is an optional shell script that contains a few useful commands for development.

### Setup

If you want to use the cli, add this to your shell configuration file:

```bash
  # .zshrc, .bashrc, .bash_profile
  export DVP_PATH=<file/path/to/your/datavispr>
  source $DVP_PATH/packages/cli/cli.sh
```

### Usage

```bash
#
# Changes your current directory to the datavis root
#
dvp

#
# Changes your current directory to the specified datavis package
# - Example: dvp app
#
dvp <package>

#
# Runs the npm script named <command> from the root package.json
#
dvp <command>

#
# If there is a conflict between a package name and a root script name,
# specify root before the command to disambiguate.
# - Example: dvp root bootstrap
#
dvp root <command>

#
# Adds an npm package to the dependencies of the named package.
# - Example: dvp app add @testing-library/react-native --dev
#   - equal to: `npx lerna add @testing-library/react-native packages/app --dev
#
dvp <package> add <npm-package> <options>


#
# Runs any npm script defined in the specified package's package.json
# - Example: dvp api start
#
dvp <package> <command>

#
# Opens the repository's Github link in
# the default browser
#
dvp gh

#
# Sources the dvp cli. Useful when adding a new package.
#
dvp src

```

### Routes
Simply go to `localhost:...` where the number after the colon is the one given to you in the console after running our project

You can also go to `localhost:.../chords` to see our work in progress for our chord visualization to the right of the other components. We want to keep it separate from the main route until we make the chord visualization a proper component.


### Process Book Status

- [ ] Overview & Motivation - So far, this is just the appropriate sections from our proposal pasted together
- [x] Related Work - Fully up to date with our progress so far
- [x] Questions - Fully up to date with our progress so far
- [ ] Data - So far, this is just the appropriate sections from our proposal pasted together. Note that we have most of our data together and the strutcure implemented with all of our tables, even if they do now have all of their rows yet!
- [x] Exploratory Data Analysis - Fully up to date with our progress so far
- [x] Design Evolution - Fully up to date with our progress so far  
- [ ] Implementation - Not yet written
- [ ] Evaluation - Not yet written