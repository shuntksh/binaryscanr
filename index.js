/* tslint:disable:no-console */
const cluster = require("cluster");
const control = require("strong-cluster-control");

const app = require("./build/binaryscanr");

control.start({ size: 1 })
    .on("error", (err) => {
        console.error(err);
    });

if (cluster.isWorker) {
    app.listen(process.env.PORT || "3000");
    console.log(`Worker ${process.pid} started`);
}
