/**
 * Example: IntersectionObserver and lazy-loading utilities.
 *
 * NOTE: IntersectionObserver requires a browser environment, so this example
 * is illustrative only and will not run under Bun/Node.
 */
import { LazyLoaderService, ObserverService } from "@/infrastructure/observer/observer.service";

const observer = ObserverService.getInstance();
const lazyLoader = LazyLoaderService.getInstance();

// Create a fade-in observer and observe elements.
observer.create(
	"fade-in",
	(entry) => {
		entry.target.classList.toggle("visible");
	},
	{ threshold: 0.2 },
);

observer.observe("fade-in", "#hero");
observer.observeAll("fade-in", ".card");

// Create an analytics observer.
observer.create("track-view", (entry) => {
	console.log(`View: ${entry.target.id}`);
});
observer.observe("track-view", "#promo-banner");

// Lazy load images for different sections.
lazyLoader.init("pokemon-list", ".pokemon-card img", "300px");
lazyLoader.init("blog-posts", ".post-cover img");

// Selective cleanup.
observer.disconnect("track-view");
lazyLoader.stop("pokemon-list");

// Full cleanup (e.g., on SPA route change or component unmount).
observer.disconnectAll();
lazyLoader.stopAll();
