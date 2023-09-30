
/**
 * A listener to an event.
 */
export interface EventListener<T extends unknown[]> {
	(...args: T): void;
}

/**
 * A subscription to an event.
 */
export interface EventSubscription {
	/**
	 * Remove one instance of the listener represented by this subscription.
	 */
	(): void;
}

/**
 * A function that can be called to attach an event listener.
 */
export interface Event<T extends unknown[]> {
	/**
	 * Attach an event listener.
	 *
	 * Listeners attached multiple times will also be called multiple times.
	 *
	 * @returns A function that can be called to remove one instance of the listener.
	 */
	(listener: EventListener<T>): EventSubscription;
}

/**
 * An emitter can be used to emit events.
 *
 * @example
 * ```ts
 * class Example {
 *   private readonly _onMessage = new Emitter<[message: string, sender: string]>();
 *   public readonly onMessage = this._onMessage.event;
 *
 *   public something() {
 *     this._onMessage.emit("Hello World!", "something");
 *   }
 * }
 *
 * const example = new Example();
 *
 * example.onMessage((message, sender) => {
 *   console.log(`Message from ${sender}: ${message}`);
 * });
 *
 * example.something();
 * ```
 */
export class Emitter<T extends unknown[]> {
	#listeners: EventListener<T>[] = [];

	/**
	 * Call all listeners of this emitter.
	 *
	 * @param args The arguments to pass to the listeners.
	 * @returns True if any listeners have been called.
	 */
	emit(...args: T): boolean;
	emit(): boolean {
		const listeners = this.#listeners;
		for (let i = 0; i < listeners.length; i++) {
			listeners[i].apply(null, arguments as unknown as T);
		}
		return listeners.length > 0;
	}

	/**
	 * Call all listeners of this emitter.
	 *
	 * @param getArgs A function to compute the arguments only if there are any listeners.
	 * @returns True if any listeners have been called.
	 */
	emitLazy(getArgs: () => T): boolean {
		const listeners = this.#listeners;
		if (listeners.length > 0) {
			const args = getArgs();
			for (let i = 0; i < listeners.length; i++) {
				listeners[i].apply(null, args);
			}
			return true;
		}
		return false;
	}

	/**
	 * The event that is controlled by this emitter.
	 */
	event: Event<T> = listener => {
		this.#listeners.push(listener);
		return () => {
			const index = this.#listeners.indexOf(listener);
			if (index !== -1) {
				this.#listeners.splice(index, 1);
			}
		};
	};
}
