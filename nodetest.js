require('zone.js/dist/zone-node');

function log(str) {
  Zone.root.run(function() {
    console.log(str);
  });
}
function foo() {
  Zone.current.fork({
    name: 'fooZone', 
    onScheduleTask: function(delegate, curr, target, task) {
      log('Zone begin to schedule task not async yet ' + task.source);
      return delegate.scheduleTask(target, task);
    },
    onInvokeTask: function(delegate, curr, target, task, applyThis, applyArgs) {
      log('~~~~Zone before invoke async callback~~~~' + task.source);
      delegate.invokeTask(target, task, applyThis, applyArgs);
      log('~~~~Zone after invoke async callback~~~~' + task.source);
    },
  }).run(function() {
    log('current zone, ' + Zone.current.name);
    setTimeout(function() {
      log('timeout is up, ', Zone.current.name);
    }, 100);
  });
};

foo();
