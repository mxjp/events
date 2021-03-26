# @mpt/events
Event emitter library inspired by the event api used in vscode extensions.

## Installation
```bash
npm i @mpt/events
```

## Example
```ts
import { Emitter } from "@mpt/events";

class Example {
  private readonly _onMessage = new Emitter<[message: string, sender: string]>();
  public readonly onMessage = this._onMessage.event;

  public something() {
    this._onMessage.emit("Hello World!", "something");
  }
}

const example = new Example();

example.onMessage((message, sender) => {
  console.log(`Message from ${sender}: ${message}`);
});

example.something();
```
