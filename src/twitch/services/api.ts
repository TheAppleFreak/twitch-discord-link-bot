import {
    Service,
    ServiceBroker,
    Context,
    Errors as MoleculerErrors,
} from "moleculer";
import { ZodParams } from "moleculer-zod-validator";
import { z } from "zod";
import { ApiClient } from "@twurple/api";
import * as env from "env-var";

import TwitchAuth from "../utilities/auth";
import TwurpleMoleculerLogger from "../utilities/logger";

export default class TwitchApiService extends Service {
    private api!: ApiClient;

    constructor(broker: ServiceBroker) {
        super(broker);

        this.parseServiceSchema({
            name: "twitch.api",
            version: 1,
            dependencies: ["v1.twitch.auth"],
            started: this.serviceStarted,
        });
    }

    public async serviceStarted() {
        this.api = new ApiClient({
            authProvider: new TwitchAuth("bot").authProvider,
            logger: TwurpleMoleculerLogger(this),
        });
    }
}
