import { ServiceBroker } from "moleculer";
import { ZodValidator } from "moleculer-zod-validator";
import * as env from "env-var";

const broker = new ServiceBroker({
    validator: new ZodValidator(),
    transporter: env.get("BROKER_TRANSPORTER_URI").required().asUrlString(),
    logger: {
        type: "Console",
        options: {
            formatter: "simple"
        }
    }
});

broker.start();