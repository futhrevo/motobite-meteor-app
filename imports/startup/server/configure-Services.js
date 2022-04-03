import { Meteor } from 'meteor/meteor';
import { ServiceConfiguration } from 'meteor/service-configuration';

const services = Meteor.settings.private.oAuth;

if (services) {
  for (const service in services) {
    ServiceConfiguration.configurations.upsert({ service }, {
      $set: services[service],
    });
  }
}
