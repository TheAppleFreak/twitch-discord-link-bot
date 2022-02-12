import { Service, ServiceBroker, Errors as MoleculerErrors } from "moleculer";
import { RefreshingAuthProvider } from "@twurple/auth";
import { z } from "zod";
import * as env from "env-var";

export default class TwitchAuth {
    private static authProviders: {
        [key: string]: {
            provider: RefreshingAuthProvider;
            accessToken: string;
            expiresIn: number;
            obtainmentTimestamp: number;
            scope: string[];
        };
    };
    public id: string;

    constructor(
        id: string,
        options?: z.infer<typeof TwitchAuthValidator>,
        broker?: ServiceBroker,
    ) {
        this.id = id;

        if (TwitchAuth.authProviders === undefined) {
            TwitchAuth.authProviders = {};
        }

        try {
            this.authProvider;
        } catch (err) {
            if (options === undefined) {
                throw new MoleculerErrors.MoleculerClientError(
                    "Must supply connection credentials for a new auth provider!",
                    401,
                    "TWITCH_MISSING_CREDENTIALS",
                    { id },
                );
            }

            TwitchAuth.authProviders[this.id] = {
                provider: new RefreshingAuthProvider(
                    {
                        clientId: options.clientId,
                        clientSecret: options.clientSecret,
                        onRefresh: async (newTokenData) => {
                            TwitchAuth.authProviders[this.id].accessToken =
                                newTokenData.accessToken;
                            TwitchAuth.authProviders[this.id].expiresIn =
                                newTokenData.expiresIn!;
                            TwitchAuth.authProviders[
                                this.id
                            ].obtainmentTimestamp =
                                newTokenData.obtainmentTimestamp;
                            TwitchAuth.authProviders[this.id].scope =
                                newTokenData.scope;

                            if (broker) {
                                broker.emit("v1.twitch.auth.refreshed", {
                                    instance: this.id,
                                });
                            }
                        },
                    },
                    {
                        accessToken: "",
                        refreshToken: options.refreshToken!,
                        expiresIn: 0,
                        obtainmentTimestamp: 0,
                    },
                ),
                accessToken: "",
                expiresIn: 0,
                obtainmentTimestamp: 0,
                scope: [],
            };
        }
    }

    get authProvider() {
        return TwitchAuth.authProviders[this.id].provider;
    }
}

class TwitchAuthService extends Service {
    constructor(broker: ServiceBroker) {
        super(broker);

        this.parseServiceSchema({
            name: "twitch.auth",
            version: 1,
            events: {
                "v1.twitch.auth.created": (payload: { instance?: string }) => {
                    this.logger.debug(
                        `Twitch auth provider "${payload.instance}" created.`,
                    );
                },
                "v1.twitch.auth.refreshed": (payload: {
                    instance?: string;
                }) => {
                    this.logger.debug(
                        `Twitch auth provider "${payload.instance}" refreshed token.`,
                    );
                },
            },
            created: this.serviceCreated,
        });
    }

    public serviceCreated() {
        new TwitchAuth(
            "bot",
            {
                refreshToken: env.get("TWITCH_REFRESH_TOKEN").asString(),
                clientId: env.get("TWITCH_CLIENT_ID").required().asString(),
                clientSecret: env
                    .get("TWITCH_CLIENT_SECRET")
                    .required()
                    .asString(),
            },
            this.broker,
        );

        this.broker.emit(`v${this.version}.twitch.auth.created`, {
            instance: "bot",
        });
    }
}

export { TwitchAuthService };

const TwitchAuthValidator = z.object({
    refreshToken: z.string().optional(),
    clientId: z.string().length(30),
    clientSecret: z.string().length(30),
});
