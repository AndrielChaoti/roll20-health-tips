const HEALTH_DESC = [ 'Unconcious', 'Near Death', 'Badly Injured', 'Injured', 'Barely Injured', 'Uninjured', 'Dead' ];

on('chat:message', function(msg) {
    // custom api macros
    if(msg.type == 'api') {
        if (msg.content.indexOf('!hp ') !== -1) {
            // get target
            var target = msg.content.replace('!hp ', '');
            var tokens = findObjs({ type: 'graphic', subtype: 'token', id: target }, true);
            if (tokens.length == 0) {
                respond(msg, 'Can\'t find ' + target + '.');
            } else {
                // get bar value
                var bar1_percent = (tokens[0].get('bar1_value') / tokens[0].get('bar1_max')) * 5;
                // clamp bar value
                bar1_percent = Math.min(Math.max(Math.ceil(bar1_percent), 0), 5);
                var healthStr = HEALTH_DESC[bar1_percent];
                if (tokens[0].get('status_dead')) healthStr = HEALTH_DESC[6];
                var x = tokens[0].get('left');
                var y = tokens[0].get('top');
                var pageid = Campaign().get('playerspecificpages');
                if (pageid == false) { 
                    pageid = Campaign().get('playerpageid');
                } else {
                    pageid = pageid[msg.playerid];
                }
                sendPing(x, y, Campaign().get('playerpageid'), null, false);
                respond(msg, tokens[0].get('name') + ' is **' + healthStr + '**');
            }
        }
    }
})

function respond(msg, content) {
    var characters = findObjs({_type: 'character'});
    var speaking;
    characters.forEach(function(chr) { if(chr.get('name') == msg.who) speaking = chr; });
 
    var out;

    out = '&{template:desc} {{desc=' + content + '}}'

    if(speaking) sendChat('character|'+speaking.id, out, null, {noarchive: true});
    else sendChat('player|'+msg.playerid, out, null, {noarchive: true});
}