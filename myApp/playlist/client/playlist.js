myPlaylist = new Mongo.Collection('playlist');
	
if(Meteor.isClient){

Meteor.subscribe('myOwnPlaylist');
Template.musicSearch.events({

		'submit form':function(event){
			event.preventDefault();
			$('div#searchResults').empty();
			var searchWord = event.target.music.value;
			var maxResults = event.target.maxResult.value;
					$.get("https://www.googleapis.com/youtube/v3/search", {
								part:'snippet',
								order:'relevance',
								maxResults:maxResults,
								q: searchWord,
								key: 'AIzaSyBYS1LYviodUXSujeP2IkjOkkF-5q6R30U'
							}, function(data){
								$.each(data.items, function(idx, item){
									let title = item.snippet.title;
									let desc = item.snippet.description;
									let embed = 'https://www.youtube.com/embed/' + item.id.videoId;
									let download = 'https://www.ssyoutube.com/watch?v=' + item.id.videoId;

									$('div#searchResults').append(
									'<span><iframe height="180px" src="' +
									 embed + '" allowfullscreen></iframe><p class="title" data-title="'+ title + 
									 '" data-desc="' + desc + '" data-embed="'+embed+'" data-download="'+download+'">' + 
									 item.snippet.title + '</p></span>');
									
								});
							});
			event.target.music.value = '';
			$('input[type=text].add').val('');
			$('input.add').removeClass('title');
			},

		'change #range': function(event){
			$('#forRange').val(event.target.value);
		}
	});

	Template.results.events({
		'click p.title': function(event){
		$('input[type=text].add').removeAttr('value');
		$('input[type=text].add').val($(event.target).data('title'));
		var title = $(event.target).data('title');
		var desc = $(event.target).data('desc');
		var embed = $(event.target).data('embed');
		var download = $(event.target).data('download');
		Session.set('title', title);
		Session.set('desc', desc);
		Session.set('embed', embed);
		Session.set('download', download);
		
		},

		'click :button':function(){
			if($('input[type=text].add').val()){
				var title = Session.get('title');
				var desc = Session.get('desc');
				var embed = Session.get('embed');
				var download = Session.get('download');
				
				Meteor.call('insertPlaylistItem', title, desc, embed, download);
			}		
		}
	});

		Template.playList.events({
		
		'click .delete': function(event){
			event.preventDefault();
			var id = this._id;
			Meteor.call('removePlaylistItem', id);
		}
		});

		Template.playList.helpers({
		
		'rows': function(){		
			if(myPlaylist.find().count() > 0){
				$('h3#video').removeAttr('class');
				$('table').removeAttr('class');
			return myPlaylist.find({},{sort:{title:1}});
			} else{
				$('h3#video').attr('class','hide');
				$('table').attr('class','hide');
			}

		},

		'classHide':function(){
			
			if(myPlaylist.find().count() == 0){
				return "hide";
			}
			
		}

		
	});
		Template.checkLog.helpers({
			'log':function(){
				if(Meteor.userId() == null){
				return "Log-in to use the app!";
				}else{
				return "You are successfully logged-in!";
				}
			}
		});

}

if(Meteor.isServer){
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

}