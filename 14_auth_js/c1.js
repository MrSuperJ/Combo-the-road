var casper = require('casper').create()
var url='http://10.125.188.75:9080/ICFS/logon.html'

casper.start(url)
casper.then(function(){
  this.echo('����ϵͳ��½��'+this.getTitle());
});
casper.thenOpen('http://www.songlairui.cn', function() {
    this.echo('Second Page: ' + this.getTitle());
});
casper.run()