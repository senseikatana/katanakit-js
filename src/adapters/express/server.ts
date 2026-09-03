import cors from "cors";
import express, { type Application, type NextFunction, type Request, type Response } from "express";

import { LOGGER } from "@/core/services/logger.service";
import router from "./router";

export default class ServerExpress {
	private static instance: ServerExpress;
	private readonly app: Application;
	private readonly port: number;
	private readonly host: string;

	private constructor(port = 3000, host = "localhost") {
		this.app = express();
		this.port = port;
		this.host = host;
	}

	static getInstance(): ServerExpress {
		if (!ServerExpress.instance) {
			ServerExpress.instance = new ServerExpress();
		}
		return ServerExpress.instance;
	}

	start = (): void => {
		this.setupMiddlewares();
		this.setupRoutes();
		this.setupErrorHandling();

		this.app.listen(this.port, this.host, () => {
			LOGGER(`Server running on http://${this.host}:${this.port}`);
		});
	};

	getApp = (): Application => this.app;

	private setupMiddlewares(): void {
		this.app.use(cors());
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));
	}

	private setupRoutes(): void {
		this.app.get("/health", (_request: Request, response: Response) => {
			return response.json({
				status: "ok",
				timestamp: new Date().toISOString(),
			});
		});

		this.app.use("/", router);
	}

	private setupErrorHandling(): void {
		this.app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
			console.error("Unhandled error:", err);
			res.status(500).json({ error: "Internal Server Error" });
		});

		this.app.use((_req: Request, res: Response) => {
			res.status(404).json({ error: "Not Found" });
		});
	}
}
