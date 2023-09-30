# @mpt/events
A minimal event emitter that cleanly separates the emitting and the listening side.

## Installation
```bash
npm i @mpt/events
```

## Example
```ts
import { Emitter } from "@mpt/events";

class Example {
  #onMessage = new Emitter<[message: string, sender: string]>();
  onMessage = this.#onMessage.event;

  something() {
    this.#onMessage.emit("Hello World!", "something");
  }
}

const example = new Example();

example.onMessage((message, sender) => {
  console.log(`Message from ${sender}: ${message}`);
});

example.something();
```
