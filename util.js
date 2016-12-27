var webClient = require('slack-terminalize').getWebClient();
/**
 * Wrapper function for postMessage from slack-client to handle formatting.
 *
 * @param  { object } slack-client Channel boject
 * @param  { string } message to send to Slack channel
 * @param  { boolean } flag to indicate block formatting
 * @return { none }
 *
 */
var postMessage = function (channel, message, format) {

    format = format || true;
    message = (format && '```' + message + '```') || message;

    // more on this API here: https://api.slack.com/methods/chat.postMessage
    webClient.chat.postMessage(channel, message, {
        as_user: true
    });

};

exports.postMessage = postMessage;