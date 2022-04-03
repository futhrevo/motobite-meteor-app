import { Meteor } from 'meteor/meteor';
import Later from 'later';
import { DrivesAdvtColl } from '../../api/collections/collectionsInit';

// start process in later to handle old records deletions
        // const Later = Meteor.npmRequire('later');
        // let wrapLater = Later;
        // will fire every 1 minutes
const textSched = Later.parse.text('every 1 min');
        // function to execute
const logTime = () => {
  console.log(new Date());
            // 3 hour old time stamp
  const epochTime = (Date.now() / 1000 || 0) - (3600 * 3);

            // DriversAdvtColl.remove({startTime: {$lt: epochTime}});
  DrivesAdvtColl.remove({ startTime: { $lt: epochTime } });
};

        // execute logTime one time on the next occurrence of the text schedule
Later.setInterval(Meteor.bindEnvironment(logTime), textSched);
