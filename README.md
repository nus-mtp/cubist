# Cubist 3D [![Build Status](https://travis-ci.org/nus-mtp/cubist.svg?branch=master)](https://travis-ci.org/nus-mtp/cubist) [![Coverage Status](https://coveralls.io/repos/nus-mtp/cubist/badge.svg?branch=master&service=github)](https://coveralls.io/github/nus-mtp/cubist?branch=master)
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
* Mocha

## Requirements
* Install **NodeJS 5.2+**
* Install **MongoDB 3.0.0**

## Setup Instruction

```
$ git clone git@github.com:nus-mtp/cubist.git
$ npm install
```

###For develoment environment

```
$ npm run api-dev
$ npm run webapp-dev
```

###For production environment

```
$ npm run api-prod
$ npm run webapp-prod
```

## Project Initialization
* Go to team's Google Drive and download `private.js`. Move the file to `src/api/config/settings`
* Go to team's Google Drive and download `models.zip`
* Extract to copy the `models` folder into the repo folder
* Clear MongoDB database for `cubist-api-development` (if necessary)
* Install Gulp globally by running: `npm install gulp -g`
* Run script: `gulp script --path src/api/scripts/createData/index.js`

## Development Instruction
* For every issue, work on a separate branch
* For every commit, specify clearly the purpose of the commit in this format:

```
$ git commit -m "[purpose] commit message"
```

* Run these commands before every commit:

```
$ npm run lint
$ npm run sasslint
$ npm run test
```

* When there are new commits in **`master`** branch, please keep up with it by merging into your branch using command:

```
$ git merge master --no-commit
$ git commit -m "commit message"
```

* When your branch is ready, create a pull request through **GitHub** and assign one of the collaborators to review your work
* After the pull request is approved, you can merge into **`master`** branch through **GitHub** or using command:

```
$ git merge [your-branch-name] --no-ff --no-commit
$ git commit -m "commit message"
```

## Bug Reports
For bug reporting, please create issues in Github
