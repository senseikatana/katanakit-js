import { describe, expect, it } from "vitest";

import { LoggerService, type LogStrategy } from "@/core/services/logger.service";

describe("LoggerService", () => {
	it("delegates to the configured strategy", () => {
		const calls: Array<{ level: string; message: string }> = [];
		const strategy: LogStrategy = {
			output: (level, message) => calls.push({ level, message }),
		};

		const logger = LoggerService.getInstance();
		logger.setStrategy(strategy);
		logger.log("info", "hello", { id: 1 });

		expect(calls).toEqual([{ level: "info", message: "hello" }]);
	});

	it("defaults to the info level when only a message is provided", () => {
		const calls: Array<{ level: string; message: string }> = [];
		const strategy: LogStrategy = {
			output: (level, message) => calls.push({ level, message }),
		};

		const logger = LoggerService.getInstance();
		logger.setStrategy(strategy);
		logger.log("plain message");

		expect(calls).toEqual([{ level: "info", message: "plain message" }]);
	});
});
