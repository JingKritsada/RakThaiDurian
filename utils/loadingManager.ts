type Listener = (isLoading: boolean) => void;

class LoadingManager {
	private static instance: LoadingManager;
	private isLoading = false;
	private count = 0;
	private listeners: Listener[] = [];

	private constructor() {}

	public static getInstance(): LoadingManager {
		if (!LoadingManager.instance) {
			LoadingManager.instance = new LoadingManager();
		}

		return LoadingManager.instance;
	}

	public show(): void {
		this.count++;
		if (this.count > 0 && !this.isLoading) {
			this.isLoading = true;
			this.notify();
		}
	}

	public hide(): void {
		if (this.count > 0) {
			this.count--;
		}
		if (this.count === 0 && this.isLoading) {
			this.isLoading = false;
			this.notify();
		}
	}

	public subscribe(listener: Listener): () => void {
		this.listeners.push(listener);
		// Immediate callback with current state
		listener(this.isLoading);

		return () => {
			this.listeners = this.listeners.filter((l) => l !== listener);
		};
	}

	private notify(): void {
		this.listeners.forEach((listener) => listener(this.isLoading));
	}
}

export const loadingManager = LoadingManager.getInstance();
