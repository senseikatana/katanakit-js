// routes/user.routes.ts
import { type Request, type Response, Router } from "express";

const router = Router();

router.get("/", (response: Response, request: Request) => {
	const { id } = request.params;
	response.json({ message: `Get user with ${id}` });
});

router.get("/:id", (request: Request, response: Response) => {
	const { id = "" } = request.params;
	response.json({ message: `Get user by ${id}` });
});

router.post("/", (response: Response, request: Request) => {
	const { id, slug } = request.params;
	response.json({ message: `Create a new user with ${id} or with ${slug}` });
});

export default router;
