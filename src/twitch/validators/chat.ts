import { ZodParams } from "moleculer-zod-validator";
import { z } from "zod";

// Events
const TwitchChatOnActionValidator = new ZodParams({
    channel: z.string(),
    user: z.string(),
    message: z.string(),
    msg: z.any(),
});

// onAnyMessage
// onAuthenticationFailure
// onBan
// onBitsBadgeUpgrade
// onChatClear
// onCommunityPayForward
// onCommunitySub

// onCtcp
// onCtcpReply
const TwitchChatOnDisconnectValidator = new ZodParams({
    manually: z.boolean(),
    reason: z.any().optional(),
});
// onEmoteOnly
// onFollowersOnly
// onGiftPaidUpgrade
// onHost
// onHosted
// onHostsRemaining
const TwitchChatOnJoinValidator = new ZodParams({
    channel: z.string(),
    user: z.string(),
});
const TwitchChatOnJoinFailureValidator = new ZodParams({
    channel: z.string(),
    reason: z.string(),
});
const TwitchChatOnMessageValidator = new ZodParams({
    channel: z.string(),
    user: z.string(),
    message: z.string(),
    msg: z.any(),
});
const TwitchChatOnMessageFailedValidator = new ZodParams({
    channel: z.string(),
    reason: z.string(),
});
const TwitchChatOnMessageRatelimitValidator = new ZodParams({
    channel: z.string(),
    message: z.string(),
});
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
// onRegister
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
const TwitchChatOnWhisperValidator = new ZodParams({
    user: z.string(),
    message: z.string(),
    msg: z.any(),
});

export {
    TwitchChatOnActionValidator,
    TwitchChatOnDisconnectValidator,
    TwitchChatOnJoinValidator,
    TwitchChatOnJoinFailureValidator,
    TwitchChatOnMessageValidator,
    TwitchChatOnMessageFailedValidator,
    TwitchChatOnMessageRatelimitValidator,
    TwitchChatOnWhisperValidator,
};

// Actions

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
const TwitchChatJoinValidator = new ZodParams({
    channel: z.string(),
});
// knowsCommand
// mod
// part
// purge
// raid
// removeVip
// runCommercial
const TwitchChatSayValidator = new ZodParams({
    channel: z.string(),
    message: z.string(),
    attributes: z
        .object({
            replyTo: z.string().optional(),
        })
        .optional(),
});
// timeout
// unhost
// unhostOutside
// unmod
// unraid
const TwitchChatWhisperValidator = new ZodParams({
    user: z.string(),
    message: z.string(),
});

export {
    TwitchChatJoinValidator,
    TwitchChatSayValidator,
    TwitchChatWhisperValidator,
};
