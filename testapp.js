// create an entries collection the MongoDB db
Entries = new Meteor.Collection('entries');

if (Meteor.isClient) {

    // expose the Entries collection to the entries template (as 'entries')
    Template.entries.entries = function () {
        // return all entries sorted by time
        return Entries.find({}, { sort: { time: -1 }});
    }

    // create events for the 'input' template
    Template.input.events = {
        // map the event (click) for the control for the given selector
        'click input#sendMessage': function (event) {
            var name = document.getElementById('user');
            var message = document.getElementById('message');
            if (message.value != '' && name.value != '') {
                // add the entry to the list of entries
                Entries.insert({
                    name: name.value,
                    message: message.value,
                    time: Date.now()
                });

                document.getElementById('message').value = '';
                message.value = '';
            }
        }
    }

    // create events for the 'entries' template
    Template.entries.events = {
        // map the event (click) for the control for the given selector
        'click input#clear': function (event) {
            // make call to a server-side function to do remove the entries,
            // since you can't just call anything you want from the client
            Meteor.call('removeAllEntries');
        }
    }

}

if (Meteor.isServer) {
    Meteor.startup(function () {
        // define some methods on the server
        return Meteor.methods({
            removeAllEntries: function () {
                return Entries.remove({});
            }
        });
    });
}
