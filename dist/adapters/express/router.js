import { Router } from "express";
const router = Router();
router.get("/", (_request, response) => {
    response.json({ message: "Get all users" });
});
router.get("/:id", (request, response) => {
    const { id = "" } = request.params;
    response.json({ message: `Get user by ${id}` });
});
router.post("/", (_request, response) => {
    response.json({ message: "Create a new user" });
});
export default router;
//# sourceMappingURL=router.js.map