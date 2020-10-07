import { ILogger } from "../src/workers/Logger/LoggerBase";

const mock: jest.Mocked<ILogger> = {
  log: jest.fn(),
  handleError: jest.fn(),
  handleMessage: jest.fn()
};

export default mock;