import test, { ExecutionContext } from "ava";

import { Emitter, EventListener } from "../src/index.js";

type TestArgs = [string, number];

function createListener(t: ExecutionContext): [(expected: TestArgs[]) => void, EventListener<TestArgs>] {
	const calls: TestArgs[] = [];
	return [
		expected => {
			t.deepEqual(calls, expected);
			calls.length = 0;
		},
		(...event: TestArgs) => calls.push(event),
	];
}

test(Emitter.prototype.emit.name, t => {
	const [assert, listener] = createListener(t);
	const emitter = new Emitter<TestArgs>();
	t.false(emitter.emit("foo", 42));
	assert([]);

	const removeA = emitter.event(listener);
	t.true(emitter.emit("bar", 77));
	assert([["bar", 77]]);

	emitter.event(listener);
	t.true(emitter.emit("baz", 99));
	assert([["baz", 99], ["baz", 99]]);

	removeA();
	t.true(emitter.emit("foo", 42));
	assert([["foo", 42]]);

	removeA();
	t.false(emitter.emit("foo", 42));
	assert([]);
});

test(Emitter.prototype.emitLazy.name, t => {
	t.plan(7);
	const [assert, listener] = createListener(t);
	const emitter = new Emitter<TestArgs>();
	t.false(emitter.emitLazy(() => {
		t.fail();
		return ["", 0];
	}));
	assert([]);

	const removeA = emitter.event(listener);
	const removeB = emitter.event(listener);
	t.true(emitter.emitLazy(() => {
		t.pass();
		return ["foo", 42];
	}));
	assert([["foo", 42], ["foo", 42]]);

	removeA();
	removeB();
	t.false(emitter.emitLazy(() => {
		t.fail();
		return ["", 0];
	}));
	assert([]);
});
