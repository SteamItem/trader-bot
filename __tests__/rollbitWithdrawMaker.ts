import { RollbitWithdrawMakerTask } from "../src/workers/WithdrawMaker/RollbitWithdrawMakerTask";
import { EnumBot } from "../src/helpers/enum";
import { IBotParam } from "../src/models/botParam";
import { RollbitApi } from "../src/api/rollbit";

const botParam: IBotParam = { id: EnumBot.RollbitCsGo, name: "Rollbit", worker: true, period: 1, cookie: "TEST" }
const itemToBuy = { price: 3.23, ref: "4e512ec9-d264-4929-b499-587b28d8622a", markup: 0, items: [{name: "SSG 08 | Bloodshot (Field-Tested)", image: "", classid: 3608084161, instanceid: 188530139, weapon: "SSG 08", skin: "Bloodshot", rarity: "Classified", exterior: "Field-Tested", price: 3.23, markup: 0 }]};
// TODO: Mock
const api = new RollbitApi();

test('Fail withdraw', async () => {
  const withdrawMaker = new RollbitWithdrawMakerTask(api, botParam, [itemToBuy]);
  await withdrawMaker.work();
  expect(withdrawMaker.successWithdrawResult).toHaveLength(0);
});

test('Performance for multiple withdraw', async () => {
  const startTime = new Date();

  const withdrawMaker = new RollbitWithdrawMakerTask(api, botParam, [itemToBuy]);
  await withdrawMaker.work();
  await withdrawMaker.work();
  await withdrawMaker.work();
  await withdrawMaker.work();
  await withdrawMaker.work();

  const endtime = new Date();
  const timeTaken = endtime.getTime() - startTime.getTime();
  const averageTime = timeTaken / 5;

  expect(averageTime).toBeLessThanOrEqual(300);
});