import {
    Service,
    ServiceBroker,
    Context,
    Errors as MoleculerErrors,
} from "moleculer";
import { ZodParams } from "moleculer-zod-validator";
import { z } from "zod";
import { PubSubClient } from "@twurple/pubsub";
import * as env from "env-var";

import TwitchAuth from "../utilities/auth";

export default class TwitchPubsubService extends Service {
    private pubsub!: PubSubClient;
    private userId!: string;

    constructor(broker: ServiceBroker) {
        super(broker);

        this.parseServiceSchema({
            name: "twitch.pubsub",
            version: 1,
            dependencies: ["v1.twitch.auth"],
            started: this.serviceStarted,
        });
    }

    public async serviceStarted() {
        this.pubsub = new PubSubClient();
        this.userId = await this.pubsub.registerUserListener(
            new TwitchAuth("bot").authProvider,
        );
    }
}
