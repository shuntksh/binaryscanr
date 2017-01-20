import * as cluster from "cluster";
import * as control from "strong-cluster-control";

import app from "dist/binaryscanr";

control.start({ size: control.CPUS})
    .on('error', (err) => {
        console.error(err);
    });

if (cluster.isWorker) {
    app.listen(process.env.PORT || "3000");
    console.log(`Worker ${process.pid} started`);    
}
