import { WorkerUnit } from './WorkerUnit';
export abstract class WorkerTask extends WorkerUnit {
  abstract async work(): Promise<void>;
}
