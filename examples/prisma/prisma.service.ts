// src/services/prisma.service.ts
import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";


// # 1. Instalar Prisma CLI como dependencia de desarrollo
// npm install -D prisma
// 
// # 2. Instalar el cliente de Prisma y la extensión Accelerate
// npm install @prisma/client @prisma/extension-accelerate
// 
// # 3. Inicializar Prisma (crea la carpeta prisma/ con schema.prisma y el archivo .env)
// npx prisma init

// DATABASE_URL="prisma://accelerate.net/?api_key=TU_API_KEY_AQUI"
// # Generar los tipos de TypeScript del cliente
// npx prisma generate

// # Si usas migraciones en desarrollo:
// npx prisma migrate dev --name init

// astro.config.mjs
// import { defineConfig } from 'astro/config';
// import node from '@astrojs/node';

// export default defineConfig({
//   output: 'server', // o 'hybrid'
//   adapter: node({ mode: 'standalone' })
// });

// ============================================================
// 1. FACTORY HELPER & TYPING DE EXTENSIÓN
// ============================================================

const createExtendedPrismaClient = () => {
	return new PrismaClient({
		datasources: {
			db: {
				url: process.env.DATABASE_URL,
			},
		},
	}).$extends(withAccelerate());
};

// Tipo inferido con soporte para todos los métodos de Prisma + Accelerate
export type ExtendedPrismaClient = ReturnType<
	typeof createExtendedPrismaClient
>;

// Declaración en globalThis para sobrevivir al HMR de Vite/Astro en dev
declare global {
	// eslint-disable-next-line no-var
	var __prismaClientInstance: ExtendedPrismaClient | undefined;
}

// ============================================================
// 2. CLASE SINGLETON (CONSTRUCTOR PRIVADO + INSTANCE)
// ============================================================

export class PrismaService {
	// Regla Singleton 1: Propiedad estática privada para la instancia única
	private static instance: PrismaService;

	// Cliente de base de datos extendido con Accelerate
	public readonly client: ExtendedPrismaClient;

	// Regla Singleton 2: Constructor privado que previene `new PrismaService()`
	private constructor() {
		if (process.env.NODE_ENV === "production") {
			this.client = createExtendedPrismaClient();
		} else {
			// En desarrollo (Vite HMR en Astro), reutilizamos la instancia del globalThis
			if (!globalThis.__prismaClientInstance) {
				globalThis.__prismaClientInstance = createExtendedPrismaClient();
			}
			this.client = globalThis.__prismaClientInstance;
		}
	}

	// Regla Singleton 3: Método estático global de acceso
	public static getInstance(): PrismaService {
		if (!PrismaService.instance) {
			PrismaService.instance = new PrismaService();
		}
		return PrismaService.instance;
	}

	// ============================================================
	// MÉTODOS DE UTILIDAD CON ARROW FUNCTIONS (MANTENER 'this')
	// ============================================================

	public DISCONNECT = async (): Promise<void> => {
		await this.client.$disconnect();
	};

	public CONNECT = async (): Promise<void> => {
		await this.client.$connect();
	};
}

// ============================================================
// 3. EXPORTACIÓN SEGURA
// ============================================================

// Instancia única del servicio
export const PRISMA_SERVICE = PrismaService.getInstance();

// Exportación directa del cliente extendido para consultas
export const db = PRISMA_SERVICE.client;

// Exportación de utilidades
export const { DISCONNECT: PRISMA_DISCONNECT, CONNECT: PRISMA_CONNECT } =
	PRISMA_SERVICE;

import type { APIRoute } from "astro";
import { db } from "../../services/prisma.service";

export const GET: APIRoute = async () => {
	try {
		// Uso directo de db con caché de Accelerate
		const users = await db.user.findMany({
			cacheStrategy: { ttl: 60 }, // Extensión Accelerate
		});

		return new Response(JSON.stringify(users), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		return new Response(
			JSON.stringify({ error: "No se pudieron obtener los usuarios" }),
			{ status: 500 },
		);
	}
};

---

import { db } from "../services/prisma.service";

// Se ejecuta en el servidor durante el renderizado SSR
const posts = await db.post.findMany({
	where: { published: true },
	take: 10,
	cacheStrategy: { ttl: 300 },
});
---

<main>
  <h1>Publicaciones < /1>h<ul>;
{
	posts.map((post) => (
      <li>{post.title}</li>
    ))
}
</ul>
</main>
