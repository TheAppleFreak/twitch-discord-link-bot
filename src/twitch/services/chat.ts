import {
    Service,
    ServiceBroker,
    Context,
    Errors as MoleculerErrors,
} from "moleculer";
import { ChatClient } from "@twurple/chat";

import TwitchAuth from "../utilities/auth";
import TwurpleMoleculerLogger from "../utilities/logger";

import * as Validators from "../validators/chat";

export default class TwitchChatService extends Service {
    private chat!: ChatClient;
    private listeners!: ReturnType<ChatClient["addListener"]>[];

    constructor(broker: ServiceBroker) {
        super(broker);

        this.parseServiceSchema({
            name: "twitch.chat",
            version: 1,
            dependencies: ["v1.twitch.auth"],
            actions: {
                // action
                // addVip
                // ban
                // changeColor
                // clear
                // deleteMessage
                // disableEmoteOnly
                // disableFollowersOnly
                // disableR9k
                // disableSlow
                // disableSubsOnly
                // enableEmoteOnly
                // enableFollowersOnly
                // enableR9k
                // enableSlow
                // enableSubsOnly
                // getCommandClass
                // getMods
                // getVips
                // host
                join: {
                    params: Validators.TwitchChatJoinValidator.schema,
                    handler: this.join,
                },
                // knowsCommand
                // mod
                // part
                // purge
                // raid
                // removeVip
                // runCommercial
                say: {
                    params: Validators.TwitchChatSayValidator.schema,
                    handler: this.say,
                },
                // timeout
                // unhost
                // unhostOutside
                // unmod
                // unraid
                whisper: {
                    params: Validators.TwitchChatWhisperValidator.schema,
                    handler: this.whisper,
                },
            },
            started: this.serviceStarted,
            stopped: this.serviceStopped,
        });
    }

    public async join(
        ctx: Context<typeof Validators.TwitchChatJoinValidator.context>,
    ) {
        this.chat.join(ctx.params.channel!);
    }

    public async say(
        ctx: Context<typeof Validators.TwitchChatSayValidator.context>,
    ) {
        this.chat.say(
            ctx.params.channel!,
            ctx.params.message!,
            ctx.params.attributes,
        );
    }

    public async whisper(
        ctx: Context<typeof Validators.TwitchChatWhisperValidator.context>,
    ) {
        this.chat.whisper(ctx.params.user!, ctx.params.message!);
    }

    public async serviceStarted() {
        this.chat = new ChatClient({
            authProvider: new TwitchAuth("bot").authProvider,
            logger: TwurpleMoleculerLogger(this),
        });

        this.listeners = [];
        this.registerEventListeners();

        await this.chat.connect();
    }

    public async serviceStopped() {
        await this.chat.quit();
    }

    private registerEventListeners() {
        this.listeners.push(
            this.chat.onAction(async (channel, user, message, msg) => {
                this.broker.emit<
                    typeof Validators.TwitchChatOnActionValidator.call
                >(`v${this.version}.twitch.chat.action`, {
                    channel,
                    user,
                    message,
                    msg,
                });
            }),
            // onAnyMessage
            // onAuthenticationFailure
            // onBan
            // onBitsBadgeUpgrade
            // onChatClear
            // onCommunityPayForward
            // onCommunitySub
            this.chat.onConnect(() => {
                this.broker.emit(`v${this.version}.twitch.chat.connect`);

                this.logger.debug(`Connected to Twitch Messaging Interface.`);
            }),
            // onCtcp
            // onCtcpReply
            // onDisconnect
            this.chat.onDisconnect(async (manually, reason) => {
                this.broker.emit<
                    typeof Validators.TwitchChatOnDisconnectValidator.call
                >(`v${this.version}.twitch.chat.disconnect`, {
                    manually,
                    reason,
                });

                this.logger.debug(
                    `${
                        manually ? "Deliberately d" : "D"
                    }isconnected from Twitch Messaging Interface. ${
                        manually ? "Reason: " + reason?.message : ""
                    }`,
                );
            }),
            // onEmoteOnly
            // onFollowersOnly
            // onGiftPaidUpgrade
            // onHost
            // onHosted
            // onHostsRemaining
            this.chat.onJoin(async (channel, user) => {
                this.broker.emit<
                    typeof Validators.TwitchChatOnJoinValidator.call
                >(`v${this.version}.twitch.chat.join`, {
                    channel,
                    user,
                });
            }),
            this.chat.onJoinFailure(async (channel, reason) => {
                this.broker.emit<
                    typeof Validators.TwitchChatOnJoinFailureValidator.call
                >(`v${this.version}.twitch.chat.joinFailure`, {
                    channel,
                    reason,
                });
            }),
            this.chat.onMessage(async (channel, user, message, msg) => {
                this.broker.emit<
                    typeof Validators.TwitchChatOnMessageValidator.call
                >(`v${this.version}.twitch.chat.message`, {
                    channel,
                    user,
                    message,
                    msg,
                });
            }),
            this.chat.onMessageFailed(async (channel, reason) => {
                this.broker.emit<
                    typeof Validators.TwitchChatOnMessageFailedValidator.call
                >(`v${this.version}.twitch.chat.messageFailed`, {
                    channel,
                    reason,
                });
            }),
            this.chat.onMessageRatelimit(async (channel, message) => {
                this.broker.emit<
                    typeof Validators.TwitchChatOnMessageRatelimitValidator.call
                >(`v${this.version}.twitch.chat.messageFailed`, {
                    channel,
                    message,
                });
            }),
            // onMessageRemove
            // onNickChange
            // onNoPermission
            // onNotice
            // onPart
            // onPasswordError
            // onPrimeCommunityGift
            // onPrimePaidUpgrade
            // onR9k
            // onRaid
            // onRaidCancel
            this.chat.onRegister(() => {
                this.broker.emit(`v${this.version}.twitch.chat.register`);

                this.logger.debug(
                    `Registered with Twitch Messaging Interface. Now able to send messages.`,
                );
            }),
            // onResub
            // onRewardGift
            // onRitual
            // onSlow
            // onStandardPayForward
            // onSub
            // onSubExtend
            // onSubGift
            // onSubsOnly
            // onTimeout
            // onUnhost
            this.chat.onWhisper(async (user, message, msg) => {
                this.broker.emit<
                    typeof Validators.TwitchChatOnWhisperValidator.call
                >(`v${this.version}.twitch.chat.whisper`, {
                    user,
                    message,
                    msg,
                });
            }),
        );

        this.logger.debug("Registered chat event listeners.");
    }

    public unregisterEventListeners() {
        this.listeners.map((listener) => {
            this.chat.removeListener(listener);
        });

        this.logger.debug("Unregistered chat event listeners.");
    }
}
