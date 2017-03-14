# binaryscanr

A Tcl Binary Scan Tester

[![Greenkeeper badge](https://badges.greenkeeper.io/shuntksh/binaryscanr.svg)](https://greenkeeper.io/)
[![build status](https://travis-ci.org/shuntksh/binaryscanr.svg?branch=master)](https://travis-ci.org/shuntksh/binaryscanr)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/672d5dca2c154c5cba660fcad52dedef)](https://www.codacy.com/app/shuntksh/binaryscanr?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=shuntksh/binaryscanr&amp;utm_campaign=Badge_Grade)

[![Demo](https://raw.githubusercontent.com/shuntksh/binaryscanr/master/demo.gif)](https://binaryscanr.com/)

## About

The primary goal of this project was to learn to write "[React](https://facebook.github.io/react/)/[Redux](http://redux.js.org/)" app in [TypeScript](http://www.typescriptlang.org/) by making something substantial. This was my first project involves TypeScript and so far it is all positive thanks to active community support especially around [@types](http://definitelytyped.org/). I personally wrote [couple](https://www.npmjs.com/package/@types/strong-cluster-control) [of](https://www.npmjs.com/package/@types/forever-monitor) [type](https://www.npmjs.com/package/@types/react-portal) files along the way. That said, Tcl's binary scan command has been always something I wanted to visualize and understand what's going on behind the scene especially when I write a protocol dissector using it.

### A simple API server

Backend is implemented in `Tcl` + `express.js` that provides a simple API layer. Front end app is also being served by the express.js application as a static html / css /js files.

### A front-end "editor" application

It consist of two main components. One is to edit tcl filter string called "TaggableInput" and the other to edit hexadecimal input called "HexEditor". Both are connected to a redux store using "react-redux" npm module. API calls are made by helper functions that is subscribing to the store without using Redux middle ware stack.

## How to build

```bash
yarn
yarn test
yarn build
```

## Start server

```bash
docker-compose up .
# or
tclsh src/tcl/binaryscanr.tcl &
yarn server:start
```
