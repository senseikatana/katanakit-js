import { ServerExpress } from "@/index";
import type { Application, Request, Response } from "express";
import { LOGGER } from "./helpers";
import { JSON_STRINGIFY } from "./helpers/converters";
import { SET_STORAGE } from "./helpers/localstorage/storage.service";

export const { getApp, start }: ServerExpress = ServerExpress.getInstance();

export const app: Application = getApp();

app.use("/", (request: Request, response: Response) => {
	request.params;
	response.json({ msg: "Application Express initialized" });
});

const themeStoraged = SET_STORAGE("theme", "light", "localStorage");

LOGGER(JSON_STRINGIFY(themeStoraged));
