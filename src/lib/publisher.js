const io = require('socket.io-client');

const SERVER = process.env.Q_SERVER || 'http://localhost:3333';

class Q {

  constructor(q) {
    console.log(`connecting to socket io server ${SERVER}`);
    this.q = io.connect(`${SERVER}`);
    io.on('event', function(data){
      console.log('io event', data);
    });
    io.on('disconnect', function(){
      console.log('io disconnect');
    });
  }

  /**
   * Publish an event (room) with payload 
   * @param queue
   * @param event
   * @param payload
   */ 
  publish(queue, event, payload) {
    //console.log('in the publisher with event', event);
    let message = {queue,event,payload};
    this.q.emit('publish', message); 
  }
  
}

module.exports = Q;