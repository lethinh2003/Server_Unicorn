"use strict";
const cron = require("node-cron");

class CronTasksService {
  startOneTaskAfterTime = ({ time, callback }) => {
    const cronTask = cron.schedule(
      "*/1 * * * *",
      () => {
        Promise.resolve()
          .then(callback)
          .catch((err) => console.log(err))
          .finally(() => {
            cronTask.stop();
          });
      },

      {
        scheduled: false,
      }
    );
    setTimeout(() => {
      cronTask.start();
    }, time);
  };
}

module.exports = new CronTasksService();
