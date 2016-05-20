var https = require('https');

// slackに送る
function sendToSlack(path, message, channel, context, otherParameters) {
  context = context ? context : {succeed: function(){}, fail: function(){}, done: function(){}};

  var options = {
    hostname: "hooks.slack.com",
    port: 443,
    path: path,
    method: 'POST'
  };

  var req = https.request(options, function(res) {
    if (res.statusCode == 200) {
      context.done();
    } else {
      var message = "通知に失敗しました. SlackからHTTP " + res.statusCode + "が返りました";
      console.error(message);
      context.fail(message);
    }
  });
  req.on('error', function(e) {
    var message = "通知に失敗しました. Slackから次のエラーが返りました: " + e.message;
    console.error(message);
    context.fail(message);
  });

  var parameters = otherParameters ? otherParameters : {};
  parameters.text = message;
  parameters.channel = channel;
  parameters.username = 'ハートマン軍曹';
  parameters.link_names = 1;
  req.write(JSON.stringify(parameters));
  req.write("\n");
  req.end();
}

// clound watchのアラートで発火します
exports.handler = function(event, context) {
  for(var i = 0;  i < event.Records.length; i++) {
    var record = event.Records[i];
    var sns = record.Sns;
    var message = JSON.parse(sns.Message);

    var text = [];
    var msgs = [
      'さっさとこの障害を解決しろ豚共!!',
      '今すぐ敵を殲滅せよ',
      'さっさと片付けて勝利の杯をあげよう!!',
      '今すぐ原因を探せ虫ケラ共が!!',
      'この程度の障害、我が軍の準備運動にもならんわ',
      'やれやれ、また障害か。諸君、お仕事の時間だよ。',
      'さぁ、パーティー(障害対応)の始まりだ',
      'だまって、原因追及しろ、このおカマ野郎!!'
    ];

    var rand = Math.floor(Math.random() * msgs.length) ;

    text.push("@channel " + msgs[rand]);
    text.push("名前 : " + message.AlarmName);
    text.push("内容 : " + message.AlarmDescription);
    text.push("理由 : " + message.NewStateReason);

    console.log(text.join("\n"));
    sendToSlack(
        "/services/T04Q5G460/B1264C0SW/Th08sUj9aWuEZm7pJWNRpDrh",
        text.join("\n"),
        "#spin-app-alert",
        i == event.Records.length - 1 ? context : null,
        {"icon_emoji" : ":sergeant:"}
        );
  }
}
