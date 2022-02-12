import { Service } from "moleculer";
import { LogLevel } from "@d-fischer/logger";

export default function TwurpleMoleculerLogger(service: Service) {
    return {
        logger: {
            minLevel: "trace",
        },
        custom: {
            crit: (message: string) => {
                service.logger.fatal(`[Twurple]: ${message}`);
            },
            error: (message: string) => {
                service.logger.error(`[Twurple]: ${message}`);
            },
            warn: (message: string) => {
                service.logger.warn(`[Twurple]: ${message}`);
            },
            info: (message: string) => {
                service.logger.info(`[Twurple]: ${message}`);
            },
            debug: (message: string) => {
                service.logger.debug(`[Twurple]: ${message}`);
            },
            trace: (message: string) => {
                service.logger.trace(`[Twurple]: ${message}`);
            },
            // Fallback if for some reason a level is used that isn't covered here
            // Should never happen, but idk
            log: (level: LogLevel, message: string) => {
                service.logger.info(`[Twurple] ${level}: ${message}`);
            },
        },
    };
}
