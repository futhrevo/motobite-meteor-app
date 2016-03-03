/* global Modules, DrivesAdvtColl*/
const configure = () => {
        //start process in later to handle old records deletions
        const Later = Meteor.npmRequire('later');
        let wrapLater = Later;
        // will fire every 1 minutes
        const textSched = wrapLater.parse.text('every 1 min');
        // function to execute       
        const logTime = () =>{
            console.log(new Date());
            //3 hour old time stamp
            let epochTime = (Date.now() / 1000 | 0) - (3600 * 3);

            // DriversAdvtColl.remove({startTime: {$lt: epochTime}});
            DrivesAdvtColl.remove({startTime: {$lt: epochTime}});
        }
        
        // execute logTime one time on the next occurrence of the text schedule
        wrapLater.setInterval(Meteor.bindEnvironment(logTime), textSched);
    }
    
    Modules.server.configureCron = configure;