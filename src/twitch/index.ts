import { ServiceBroker } from "moleculer";

import { TwitchAuthService } from "./utilities/auth";
import TwitchApiService from "./services/api";
import TwitchChatService from "./services/chat";
import TwitchPubsubService from "./services/pubsub";

export default function registerAllTwitchServices(broker: ServiceBroker) {
    broker.createService(TwitchAuthService);
    broker.createService(TwitchApiService);
    broker.createService(TwitchChatService);
    broker.createService(TwitchPubsubService);
}

export {
    TwitchAuthService,
    TwitchApiService,
    TwitchChatService,
    TwitchPubsubService,
};
