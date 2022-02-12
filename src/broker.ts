import { ServiceBroker } from "moleculer";
import { ZodValidator } from "moleculer-zod-validator";
import * as env from "env-var";

import registerAllTwitchServices from "./twitch";

import GlobalPrisma from "./mixins/database";

const broker = new ServiceBroker({
    validator: new ZodValidator(),
    transporter: env.get("BROKER_TRANSPORTER_URI").required().asUrlString(),
    logger: {
        type: "Console",
        options: {
            level: env.get("BROKER_LOG_LEVEL").default("info").asString(),
            formatter: "simple",
        },
    },
    async stopped() {
        await new GlobalPrisma().instance.$disconnect();
    },
});

registerAllTwitchServices(broker);

broker.start();
