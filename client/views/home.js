var locations = [
	"Dankin Donuts", "Dank of America", "Meth Refinery", "Math Refinery", "The center of a Jihad",
	"Chuckee Cheese", "North Korea", "Dead", "Guantanamo Bay", "Berlin Wall in 1960s", "Forever 21",
	"BOFA", "ICDC", "Nick\'s House", "Paris Bagguette", "Stanford", "The Louvre",
	"Swimming Pool", "Hot Tub", "Dumpster", "Dream", "Strip Club", "Spy Training Facility",
	"Playground", "Sewers", "JChill HQ", "Hot Tub Factory", "Dank Farm"
]

var roles = [
	"Villager", "Not Spy", "Very Much Not Spy", "Goat", "Boss", "Tourist", "Dank Dealer", "Dank Addict",
	"Hitler", "Chairman Mao", "Kim Jong Un", "Fidel Castro", "Obama", "Stalin", "Loser", "Fuckup",
    "Shirtless Guy", "Shithead", "Fucker", "Totally not the fucking spy", "Fucking Shithead"
]

var myRole

Template.home.helpers({
    homepage: function(param) {
        return param.hash.page == Session.get('homepage')
    },
    members: function() {
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
        return locations
	},
    randLeft: function() {
		return (Math.random()*80) + "%";
    },
    randTop: function() {
        return (Math.random()*300 - 500)+"px"
    },
    randColor: function() {
        return '#'+Math.floor(Math.random()*16777215).toString(16)
    },
	randSize: function() {
		return (Math.random()*16 + 8) + "pt"
	},
	locationRole: function() {
        var loc = Games.findOne({_id:Session.get('thisGame')._id}).location
		var members = Games.findOne({_id:Session.get('thisGame')._id}).members
		for(var i=0;i<members.length;i++) {
			if(members[i].id == Session.get('me').id) {
				var role = members[i].role
				break
			}
		}
		if(role == 'spy')
			return "YOU'RE THE SPY!!!!! SHHHHHHH!!!!!"
		if(!role) // uhhhh wtf
			role = roles[Math.floor(Math.random()*roles.length)]
		return "YOUR ROLE IS " + role + " AND YOUR LOCATION IS " + loc + "!!!!!!!"
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
		var thisGame = Games.findOne({_id:Session.get('thisGame')._id})
		console.log(thisGame)
		var spyIndex = Math.floor(Math.random()*thisGame.members.length)
		for(var i=0;i<thisGame.members.length;i++) {
			if(i==spyIndex)
				thisGame.members[spyIndex].role = "spy"
			else
				thisGame.members[i].role = roles[Math.floor(Math.random()*roles.length)]
		}
		thisGame.location = locations[Math.floor(Math.random()*locations.length)]
        Games.update({"_id" : thisGame._id}, {$set : {"started" :true}});
        Games.update({"_id" : thisGame._id}, {$set : {location: thisGame.location}});
        Games.update({"_id" : thisGame._id}, {$set : {members: thisGame.members}});
		Session.set('thisGame', thisGame)
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
        role: 'spy',
		id: Math.random().toString(36).substring(5,10)
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
    var code = $('#joinCode').val().toLowerCase()
    Session.set('thisGame', Games.findOne({code: code}))
    var thisGame = Session.get('thisGame')
    Session.set('me', {
        name: name,
        role: 'spy',
		id: Math.random().toString(36).substring(5,10)
    })
    if(thisGame) {
        var members = thisGame.members
        members.push(Session.get('me'))
        up('thisGame', 'members', members)
    }
    Games.update({"_id" : thisGame._id}, {$push : {"members" : {
        "name" : name,
        "role" : "spy",
		id: Session.get('me').id
    }}});
    return thisGame
}

var up = function(sesh, prop, val) {
    var thing = Session.get(sesh)
    thing[prop] = val
    Session.set(sesh, thing)

}
