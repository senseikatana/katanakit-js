import type { Application } from "express";

import ServerExpress from "./server";

export const { getApp, start }: ServerExpress = ServerExpress.getInstance();

export const app: Application = getApp();
