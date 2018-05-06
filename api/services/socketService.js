/**
 * 
 * socketService.js
 * 
 */
var socketIO = require('socket.io');
var uuid = require('node-uuid');
var crypto = require('crypto'); 

let stuff ={
    io: null,
    swrtcSignalMaster: (server, config)=>{
        stuff.io = socketIO.listen(server);
        stuff.io.sockets.on('connection', function (client) {
            //console.log('connected someone ',i++);
            
            client.resources = {
                screen: false,
                video: true,
                audio: false
            };

            client.on('brav_message', function(data,cb){
                //console.log('recieved on brav_message: ');
                //cb(null,{ok:true,message:'recieved brav message !'})
                //client.emit('brav_push',{ok:true,message:'how are you boy'});
                CurrentSessionDynamicsService.authenticate(data,safeCb(cb),()=>{
                    
                    if(data.type=='SIGNAL'){
                        /**
                         * (room)=> switch room
                         * (room)=> load last 10 messages
                         * Must check if this stupid is allowed to join his room
                         *  - get history of chatroom and give
                         **/
                        if(!client.chatrooms){client.chatrooms={}};
                        client.chatrooms.group = 'discussion_'+data.room ;
                        client.bravData = {
                            email : data.authDecoded.email,
                            discussionRoomId : data.room
                        };
                        client.join('discussion_'+client.bravData.discussionRoomId);
                        CurrentSessionDynamicsService.getAllMessages(data.room,(resObj)=>{
                            safeCb(cb)(false,{
                                ok:true,
                                joined:true,
                                docs : resObj.docs
                            });
                            stuff.io.sockets.in('discussion_'+client.bravData.discussionRoomId)
                                .emit('brav_push', {
                                    ok:true,
                                    type:'SIGNAL',
                                    message:'one user just joined'
                            });
                        });
                        
                    }
                });
                if(data.type=='MESSAGE'){
                    /*stuff.io.sockets.in('chatroom').emit('brav_push', {
                            ok:true,
                            type:'MESSAGE',
                            message:data.message
                    });*/
                }
                else if(data.type=='DISCUSSION_ROOM_MESSAGE'){
                    let payload = data.payload ;
                    payload.ts = TimeHelperService.getNow();
                    payload.sender = client.bravData.email;
                    stuff.io.sockets.in('discussion_'+client.bravData.discussionRoomId)
                        .emit('brav_push', {
                            ok:true,
                            type:'DISCUSSION_ROOM_MESSAGE',
                            payload:payload
                    });
                    payload.roomId = client.bravData.discussionRoomId ;
                    //console.log('ToSave ',payload);
                    CurrentSessionDynamicsService.saveMessage(payload);
                } 
            });
            // pass a message to another id
            client.on('message', function (details) {
                if (!details) return;

                var otherClient = stuff.io.to(details.to);
                if (!otherClient) return;

                details.from = client.id;
                otherClient.emit('message', details);
            });

            client.on('shareScreen', function () {
                client.resources.screen = true;
            });

            client.on('unshareScreen', function (type) {
                client.resources.screen = false;
                removeFeed('screen');
            });

            client.on('join', join);

            function removeFeed(type) {
                //console.log('removing feed')
                if (client.room) {
                    stuff.io.sockets.in(client.room).emit('remove', {
                        id: client.id,
                        type: type
                    });
                    if (!type) {
                        client.leave(client.room);
                        client.room = undefined;
                    }
                }
            }

            function join(req, cb) {
                // roomObject {name, token,}
                /** The socket client calls : joinRoom({name:$scope.stuff._id ....sessionID is room.name */
                let joinNow = (roomname)=>{
                    removeFeed();
                    safeCb(cb)(null, describeRoom(roomname));
                    client.join(roomname);
                    client.room = roomname;
                    stuff.io.sockets.to(client.id)
                        .emit({ok:true,type:'VIDEO',message:'Joined video room '+roomname});  
                };
                //console.log('Join Room Executed: '+req); // 
                if (!uuidHelperService.isObjectId(req.name)){
                    return safeCb(cb)({ok:false,message:'invalid name/id to join'});;
                }
                if(!req.token || (typeof req.token)!='string'){
                    return safeCb(cb)({ok:false,messageCouldn:'invalid token'});
                }
                // joinNow();
                CurrentSessionDynamicsService.authenticate(req,safeCb(cb),()=>{
                    /* MOCK THIS AND CODE LATER
                    CurrentSessionDynamicsService.joinSession(req.name,req.authDecoded.email,req.authDecoded.type,safeCb(cb),()=>{
                        // join is approved here
                    });
                    */
                    joinNow(req.name);
                });
                
            }
            // we don't want to pass "leave" directly because the
            // event type string of "socket end" gets passed too.
            client.on('disconnect', function () {
                removeFeed();
            });
            client.on('leave', function () {
                //console.log('leaving room')
                removeFeed();
            });

           

            // support for logging full webrtc traces to stdout
            // useful for large-scale error monitoring
            client.on('trace', function (data) {
                console.log('trace', JSON.stringify(
                [data.type, data.session, data.prefix, data.peer, data.time, data.value]
                ));
            });

            // tell client about stun and turn servers and generate nonces
            client.emit('stunservers', config.stunservers || []);

            // create shared secret nonces for TURN authentication
            // the process is described in draft-uberti-behave-turn-rest
            var credentials = [];
            // allow selectively vending turn credentials based on origin.
            var origin = client.handshake.headers.origin;
            if (!config.turnorigins || config.turnorigins.indexOf(origin) !== -1) {
                config.turnservers.forEach(function (server) {
                    var hmac = crypto.createHmac('sha1', server.secret);
                    // default to 86400 seconds timeout unless specified
                    var username = Math.floor(new Date().getTime() / 1000) + (server.expiry || 86400) + "";
                    hmac.update(username);
                    credentials.push({
                        username: username,
                        credential: hmac.digest('base64'),
                        urls: server.urls || server.url
                    });
                });
            }
            client.emit('turnservers', credentials);
        });


        function describeRoom(name) {
            var adapter = stuff.io.nsps['/'].adapter;
            var clients = adapter.rooms[name] || {};
            var result = {
                clients: {}
            };
            Object.keys(clients).forEach(function (id) {
                result.clients[id] = adapter.nsp.connected[id].resources;
            });
            return result;
        }
    },
};
let i =0;
module.exports = {
    liftSignalMaster :()=>{
        let config = sails.config.signalMasterConfig;
        sails.log('liftSignalMaster : HTTPS enable = ',sails.config.ssl.paths.enable);
        let port = config.server.port;
        let server_handler = function (req, res) {
            res.writeHead(404);
            res.end();
        };
        let server = null;
        // Create an http(s) server instance to that socket.io can listen to
        if (config.server.secure) {
            const fs = require('fs');
            server = require('https').Server({
                key: fs.readFileSync(config.server.key),
                cert: fs.readFileSync(config.server.cert),
                // passphrase: config.server.password
            }, server_handler);
        } else {
            server = require('http').Server(server_handler);
        }
        server.listen(port,()=>{
            sails.log('liftSignalMaster: UP on ',port);
            sails.log('-------------------------------------------------------');
        });
        stuff.swrtcSignalMaster(server,config);
    }
};

function safeCb(cb) {
    if (typeof cb === 'function') {
        return cb;
    } else {
        return function () {};
    }
}

/* UseLess code but reference is good *********

client.on('create', function (roomObject, cb) {
                //console.log('create room executed');
                if (arguments.length == 2) {
                    cb = (typeof cb == 'function') ? cb : function () {};
                    roomObject.name = roomObject.name || uuid();
                } else {
                    //console.log("-------------- ISSUE LOOK HERE  in on'create' --------------")
                    cb = roomObject;
                    name = uuid();
                }
                // check if exists
                var room = stuff.io.nsps['/'].adapter.rooms[name];
                if (room && room.length) {
                    safeCb(cb)('taken');
                }else{
                    join(name);
                    safeCb(cb)(null, name);
                }
});


*/