export class ProductController {
    products = [];
    // GET /products
    useGetAll(_request, response) {
        response.json(this.products);
    }
    // GET /products/:id
    useGetProductById(request, response) {
        const id = Number.parseInt(String(request.params.id), 10);
        const product = this.products.find((item) => item.id === id);
        if (!product) {
            response.status(404).json({ error: "Product not found" });
            return;
        }
        response.json({ productById: product });
    }
    // POST /products
    useCreateProduct(request, response) {
        const { name = "", price = 0 } = (request.body ?? {});
        const product = {
            id: this.products.length + 1,
            name,
            price: Number(price),
        };
        this.products.push(product);
        response.status(201).json(product);
    }
    // PUT /products/:id
    useUpsertProduct(request, response) {
        const id = Number.parseInt(String(request.params.id), 10);
        const product = this.products.find((item) => item.id === id);
        if (!product) {
            response.status(404).json({ error: "Product not found" });
            return;
        }
        const { name, price } = (request.body ?? {});
        product.name = name ?? product.name;
        product.price = Number(price ?? product.price);
        response.json(product);
    }
    // DELETE /products/:id
    useDeleteProductById(request, response) {
        const id = Number.parseInt(String(request.params.id), 10);
        const index = this.products.findIndex((item) => item.id === id);
        if (index === -1) {
            response.status(404).json({ error: "Product not found" });
            return;
        }
        this.products.splice(index, 1);
        response.status(204).send();
    }
}
//# sourceMappingURL=products.controller.js.map