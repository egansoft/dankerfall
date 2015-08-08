Template.home.helpers({
    homepage: function(param) {
        return param.hash.page == Session.get('homepage')
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
        // if(joinGame())
        //     Session.set('homepage', 'join')
        console.log(joinGame())
    },

    'click .back': function() {
        Session.set('homepage', 'home')
    }
});

Session.set('homepage', 'home')

var setupGame = function() {
    var name = $('#newName').val()
    var hash = Math.random().toString(36).substring(5,10);
    Games.insert({
        code: hash,
        members: [
            name
        ]
    })
    console.log(Games.find().fetch())
}

var joinGame = function(code, name) {
    var name = $('#joinName')
    var code = $('#joinCode')
    Session.set('game', Games.findOne({code: code}))
    return Session.get('game')
}
