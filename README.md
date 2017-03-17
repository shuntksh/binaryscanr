# binaryscanr

[![Greenkeeper badge](https://badges.greenkeeper.io/shuntksh/binaryscanr.svg)](https://greenkeeper.io/)
[![build status](https://travis-ci.org/shuntksh/binaryscanr.svg?branch=master)](https://travis-ci.org/shuntksh/binaryscanr)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/672d5dca2c154c5cba660fcad52dedef)](https://www.codacy.com/app/shuntksh/binaryscanr?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=shuntksh/binaryscanr&amp;utm_campaign=Badge_Grade)

A Tcl Binary Scan command editor / testor app that help you learn and use the tcl binary command by visualizing actions with your real data.

[![Demo](https://raw.githubusercontent.com/shuntksh/binaryscanr/master/assets/demo.gif)](https://binaryscanr.com/)

## About

The primary goal of this project is to learn to write in "[React](https://facebook.github.io/react/)/[Redux](http://redux.js.org/)/[TypeScript](http://www.typescriptlang.org/)" stack by making something substantial. This is my first project involves TypeScript and so far it is all positive thanks to active and welcoming community especially around [@types](http://definitelytyped.org/). I personally wrote [couple](https://www.npmjs.com/package/@types/strong-cluster-control) [of](https://www.npmjs.com/package/@types/forever-monitor) [type](https://www.npmjs.com/package/@types/react-portal) files along the way.

That said, Tcl's binary scan command has been always something I wanted to visualize and understand what's going on behind the scene especially when I write network protocol dissectors in Tcl. Although official reference guide made it really clear on how it works, it will be a great tool to get yourself "ah ha" into binary command, and I myself learned a lot from using this tool!

## Ussage

You can start by selecting one of examples from righthand side.

## Design

![Design](https://raw.githubusercontent.com/shuntksh/binaryscanr/master/assets/highlevel_design.png)

### Frontend - react-base "editor" application

The frontend is following common react + redux design pattern where all component that requires access to the shared state are connected via "container" glue components. The app has three main React components. The one is to edit tcl filter string called "TaggableInput" and the two is to edit hexadecimal input called "HexEditor" and the other is to display results called "ResultTable". API calls are handled by helper functions that is subscribing to the Redux store without using Redux middleware.

### Backend - An express-base simple API server (+Tclsh)

The backend is implemented in `Tcl` + `express.js` that provides a simple API layer. Front end app is also being served by the express.js application as a static html / css /js files.

## How to build

```bash
yarn
yarn test
yarn build
```

## Start server

```bash
# hopefully
docker-compose up .
# or
tclsh src/tcl/binaryscanr.tcl &
yarn server:start
```

## Feedback / Suggestion / Contribution

Please, please send me your feed back / suggestion / comment! As this is my very first TypeSctipt project and also fairly new to JS, I am always thrilled to hear how things can be improved.
