/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';
import { Email } from 'meteor/email';
import './configure-Email';

if (Meteor.isServer) {
  describe('Email Tests', () => {
    beforeEach(() => {
      console.log(process.env.MAIL_URL);
    });
    it('email is sent, check inbox', () => {
      Email.send({
        to: 'k.rakeshlal@gmail.com',
        from: 'test@motobite.com',
        subject: `running unit test at ${new Date()}`,
        text: 'Mocha says Hi',
      });
    });
  });
}
