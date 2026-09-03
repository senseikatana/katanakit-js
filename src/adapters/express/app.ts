import type { Application } from "express";

import ServerExpress from "./server.js";

export const { useGetApp, useStart }: ServerExpress = ServerExpress.getInstance();

export const app: Application = useGetApp();
