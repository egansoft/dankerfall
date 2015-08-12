Template.home.helpers({
    homepage: function(param) {
        return param.hash.page == Session.get('homepage')
    },
    members: function() {
        console.log('memebrs')
        return Games.findOne({_id:Session.get('thisGame')._id}).members
    },
    code: function() {
        return Session.get('thisGame').code
    },
    me: function() {
        return Session.get('me')
    },
    started: function() {
        return Games.findOne({_id:Session.get('thisGame')._id}).started
    },
    locations: function() {
        return [
          "Dankin Donuts", "Dank of America", "Meth Refinery", "Math Refinery", "LOL Worlds 2015", "The center of a Jihad",
          "Chuckee Cheese", "North Korea", "Dead", "Guantanamo Bay", "Berlin Wall in 1960s", "Forever 21",
          "BOFA", "ICDC", "Nick\'s House", "Paris Bagguette", "Bikini Bottom", "Stanford", "The Louvre",
          "Swimming Pool", "Hot Tub", "Dumpster", "Dream", "Strip Club", "Spy Training Facility",
          "Playground", "Sewers"
        ];
    },
    randLeft: function() {
        return (Math.random()*810-100)+"px"
    },
    randTop: function() {
        return (Math.random()*300 - 500)+"px"
    },
    randColor: function() {
        return '#'+Math.floor(Math.random()*16777215).toString(16)
    }
});

Template.home.events({
    'click #newButton': function() {
        Session.set('homepage', 'new')
    },

    'click #joinButton': function() {
        Session.set('homepage', 'join')
    },

    'click #createButton': function() {
        setupGame()
        Session.set('homepage', 'wait')
    },

    'click #enterButton': function() {
        console.log(joinGame())
        Session.set('homepage', 'wait')
    },

    'click .back': function() {
        Session.set('homepage', 'home')
    },

    'click #startButton': function() {
        up('thisGame', 'started', true)
        var thisGame = Session.get('thisGame')
        Games.update({"_id" : thisGame._id}, {$set : {"started" :true}});
    },

    'click #endButton': function() {
        up('thisGame', 'started', false)
        var thisGame = Session.get('thisGame')
        Games.update({"_id" : thisGame._id}, {$set : {"started" :false}});
    }
});

Session.set('homepage', 'home')

var setupGame = function() {
    var name = $('#newName').val()
    var hash = Math.random().toString(36).substring(5,10);
    me = {
        name: name,
        role: 'spy'
    }
    var id = Games.insert({
        code: hash,
        members: [me],
        started: false
    })
    thisGame = Games.findOne({_id:id})
    Session.set('thisGame', thisGame)
    Session.set('me', me)
    console.log(Games.find().fetch())
    console.log(thisGame)
}

var joinGame = function(code, name) {
    var name = $('#joinName').val()
    var code = $('#joinCode').val()
    Session.set('thisGame', Games.findOne({code: code}))
    var thisGame = Session.get('thisGame')
    Session.set('me', {
        name: name,
        role: 'spy'
    })
    if(thisGame) {
        var members = thisGame.members
        members.push(Session.get('me'))
        up('thisGame', 'members', members)
    }
    Games.update({"_id" : thisGame._id}, {$push : {"members" : {
        "name" : name,
        "role" : "spy"
    }}});
    return thisGame
}

var up = function(sesh, prop, val) {
    var thing = Session.get(sesh)
    thing[prop] = val
    Session.set(sesh, thing)

}
