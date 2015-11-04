# Cubist 3D [![Build Status](https://travis-ci.org/nus-mtp/cubist.svg?branch=master)](https://travis-ci.org/nus-mtp/cubist)
With advances in 3D printing and 3D scanning technologies, there is an increasing number of 3D models that are being put online. The goal of this project is to develop an open source Web gallery for 3D models, allowing users to upload and download 3D models without a fee. The gallery also spots several advanced features for interacting and viewing 3D models.

## Application Structure
`To be edited`

## Technology Stacks
* React
* Redux
* Webpack
* Gulp
* NodeJS
* Express
* MongoDB
* SASS

## Requirements
* Install `NodeJS`
* Install `MongoDB`
* Install `Sublime Text` with the following packages:
  * Babel
  * SublimeLinter
  * SublimeLinter ESLint
  * SublimeLinter SassLint

## Setup Instruction
`git clone git@github.com:nus-mtp/cubist.git`   
`npm install`

###For develoment environment
`npm run api-dev`   
`npm run webapp-dev`

###For production environment
`npm run api-prod`   
`npm run webapp-prod`


## Development Instruction
* For every issue, work on a separate branch
* For every commit, specify clearly the purpose of the commit in this format `[purpose] commit message`
* Run command `npm run lint` before every commit. If you have modified stylesheets, run command `npm run sasslint`
* When there are new commits in `master` branch, please keep up with it by merging into your branch using command: `git merge master --no-commit`
* When your branch is ready, create a pull request through GitHub and assign one of the collaborators to review your work
* After review, you can merge into `master` branch through GitHub or using command: `git merge [your-branch-name] --no-ff --no-commit`

## Bug Reports
For bug reporting, please create issues in Github
