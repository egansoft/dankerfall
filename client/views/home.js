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

    },

    'click #enterButton': function() {

    },

    'click .back': function() {
        Session.set('homepage', 'home')
    }
});

Session.set('homepage', 'home')
