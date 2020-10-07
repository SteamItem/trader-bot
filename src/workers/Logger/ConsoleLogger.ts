import { LoggerBase } from "./LoggerBase";

export class ConsoleLogger extends LoggerBase {
  log(message: string): void {
    console.log(message);
  }
}
