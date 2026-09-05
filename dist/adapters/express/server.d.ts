import { type Application } from "express";
export default class ServerExpress {
    private static instance;
    private readonly app;
    private readonly port;
    private readonly host;
    private constructor();
    static getInstance(): ServerExpress;
    useStart: () => void;
    useGetApp: () => Application;
    private setupMiddlewares;
    private setupRoutes;
    private setupErrorHandling;
}
//# sourceMappingURL=server.d.ts.map