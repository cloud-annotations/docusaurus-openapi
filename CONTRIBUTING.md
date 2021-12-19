# Contributing to Docusaurus OpenAPI

Our goal is to make API documentation a seamless experience for both the developers creating and the ones using them. In order to achieve this, we built Docusaurus OpenAPI from scratch to be a native extension to Docusaurus. If you're interested in contributing to Docusaurus OpenAPI, hopefully, this document makes the process for contributing easier.

## Get Involved

There are many ways to contribute, and many of them do not involve writing any code. Here's a few ideas to get started:

- Simply start using Docusaurus OpenAPI. Does everything work as expected? If not, we're always looking for improvements. Let us know by [opening an issue](https://github.com/cloud-annotations/docusaurus-plugin-openapi/issues/new).
- Look through the [open issues](https://github.com/cloud-annotations/docusaurus-plugin-openapi/issues). Provide workarounds, ask for clarification, or suggest labels.
- If you find an issue you would like to fix, [open a pull request](https://github.com/cloud-annotations/docusaurus-plugin-openapi/blob/main/CONTRIBUTING.md#your-first-pull-request). Issues tagged as _[Good first issue are](https://github.com/cloud-annotations/docusaurus-plugin-openapi/labels/Good%20first%20issue)_ a good place to get started.
- Read through our documentation (READMEs or even this page). If you find anything that is confusing or can be improved, you can click the "pencil ✏️" icon at the top of the file, which will take you to the GitHub interface to make and propose changes.

Contributions are very welcome. If you think you need help planning your contribution, please reach out to our maintainer on Twitter at [@bourdakos1](https://twitter.com/bourdakos1) and let us know you are looking for a bit of help.

## Our Development Process

All work on Docusaurus OpenAPI happens directly on GitHub. All changes will be public through pull requests and go through the same review process.

All pull requests will be checked by the continuous integration system, GitHub actions. There are unit tests, end-to-end tests and code style/lint tests.

### Branch Organization

Docusaurus OpenAPI has one primary branch `main`. We don't use separate branches for development or for upcoming releases.

## Proposing a Change

### Bugs

## Pull Requests

### Your First Pull Request

Fork the cloud-annotations/docusaurus-plugin-openapi repository

```sh
git clone git@github.com:your-username/docusaurus-plugin-openapi.git
```

```sh
cd where-you-cloned-docusaurus-plugin-openapi
yarn install
```

```sh
yarn watch
```

```sh
yarn watch:demo
```

```sh
yarn build
```

```sh
yarn serve
```

```sh
yarn test
```

```sh
yarn test:cypress
```
