import sendgrid from 'sendgrid';
import Promise from 'bluebird';
import fs from 'fs';

import settings from 'api/config/settings';
import { Constants } from 'common';

const SendgridClient = sendgrid(settings.SENDGRID_API_KEY);

export default {
  readHtmlFile(fileName) {
    return new Promise((resolve, reject) => {
      fs.readFile(__dirname + `/${fileName}`, 'utf8', (err, data) => {
        if (err) {
          return reject(err);
        }
        return resolve(data);
      });
    });
  },
  resetPassword(newPassword, { name, email }) {
    this.readHtmlFile('resetPassword-inline.html')
    .then((htmlData) => {
      const resetEmail = new SendgridClient.Email({
        to: email,
        from: Constants.EMAIL_SENDER_ADDRESS,
        fromname: Constants.EMAIL_SENDER_NAME,
        subject: '[Cubist3D] Password Reset Information',
        html: htmlData
      });
      resetEmail.setSubstitutions({
        '-name-': [
          name
        ],
        '-password-': [
          newPassword
        ]
      });

      return new Promise((resolve, reject) => {
        SendgridClient.send(resetEmail, (err, json) => {
          if (err) {
            return reject(err);
          }
          resolve(json);
        });
      });
    });
  }
};
