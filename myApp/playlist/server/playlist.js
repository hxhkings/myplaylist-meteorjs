myPlaylist = new Mongo.Collection('playlist');

Meteor.publish('myOwnPlaylist', function(){
	var currentUser = this.userId;
	return myPlaylist.find({createdBy:currentUser});
});
Meteor.methods({
		'insertPlaylistItem':function(title, desc, embed, download){
			var playlistUser = Meteor.userId();
			myPlaylist.insert({title: title,
							   desc: desc,
							   embed: embed,
							   download:download, createdBy:playlistUser});
		},

		'removePlaylistItem':function(id){
			var playlistUser = Meteor.userId();
			myPlaylist.remove({_id:id, createdBy:playlistUser});
		}

	});
