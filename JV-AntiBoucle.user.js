// ==UserScript==
// @name        JV-AntiBoucle
// @namespace   JV-AntiBoucle
// @description Efface les messages contenant les liens et mots-clés Boucle des forums.
// @include     http*://www.jeuxvideo.com/forums/42-*
// @include     http*://www.jeuxvideo.com/forums/0-*
// @version     1.0.3
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @updateURL   https://raw.githubusercontent.com/Saberdream/JV-AntiBoucle/main/JV-AntiBoucle.meta.js
// @downloadURL https://raw.githubusercontent.com/Saberdream/JV-AntiBoucle/main/JV-AntiBoucle.user.js
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_listValues
// @grant       GM_deleteValue
// @grant       GM_addStyle
// @icon        https://i.imgur.com/BuDsWpM.png
// @author      Jyren
// @noframes
// ==/UserScript==

GM_addStyle('/* .picto-msg-balance {background:url("http://image.noelshack.com/fichiers/2017/07/1486986675-button-balancer.png") 0 0 no-repeat;display:inline-block;width:16px;height:16px;}.picto-msg-balance span {position:absolute;top:0;left:-999em;} */ #antiboucle-box-info {width:400px;height:50%;background-color:#fff;position:absolute;top:0;bottom:0;left:0;right:0;margin:auto;display:none;z-index:9999;padding:15px 10px;box-shadow:0px 0px 15px 0px #ccc;border-radius:7px;}#antiboucle-close-box {position:absolute;top:0;right:5px;}#antiboucle-overlay {z-index:9998;background-color:#000;opacity:0.5;position:fixed;top:0;right:0;width:100%;height:100%;display:none;}#list-tags {width:100%;}#antiboucle-tags {display:none;}');

this.$ = this.jQuery = jQuery.noConflict(true);

$(document).ready(function(){
	var Options = [
		'filterlinksonly'
	];
	
	// évite de casser le script à la première installation, cette partie peut être supprimée ensuite
	$.each(Options, function(index, val){
		if(typeof GM_getValue(val) === 'undefined') {
			GM_setValue(val, '');
		}
	});
	//
	
	var OptionsOverlay = '<li class="text-center">JV-AntiBoucle</li>'
		+'<li><span class="float-start">Filtrer les liens seulement</span><input class="input-on-off" id="filterlinksonly" '+GM_getValue("filterlinksonly")+' type="checkbox"><label for="filterlinksonly" class="btn-on-off"></label></li>'
		+'<li><span class="float-start"><a href="#" id="antiboucle-show-tags">Personnaliser la liste des mots-clé</a></span><label></label></li>'
		+'<li id="antiboucle-tags"><input type="text" name="list-tags" id="list-tags" value="'+GM_getValue('taglist')+'" /><label for="list-tags"></label></li>'
		+'<li><span class="float-start"><a href="#" id="antiboucle-open-box">En savoir plus sur le script</a></span><label></label></li>';
	var DialogTags = '<div id="antiboucle-box-info"><a href="#" id="antiboucle-close-box" title="Fermer la fenêtre"><img src="http://i.imgur.com/pFVCnkU.png" alt="Fermer" /></a>'
	+'Pour personnaliser la liste des mots-clé que vous souhaitez filtrer, il suffit de les entrer dans le champ de texte séparés par un espace (le script ne tient pas compte des mots contenant un espace).<br>Conseil : pour une plus large couverture du script, mettez seulement les ids des vidéos, ex : YbN48GgQZ74'
	+'</div>'
	+'<div id="antiboucle-overlay"></div>';
	$('.menu-user-forum').append(OptionsOverlay);
	$('body').append(DialogTags);
	$("#list-tags").on('focusout',function(){
		GM_setValue('taglist', $(this).val());
	});
	$.each(Options, function(index, val){
		var OptionName = val;
		$('#'+val).on('click', function(){
			if($(this).is(':checked')) GM_setValue(OptionName, 'checked');
			else GM_setValue(OptionName, '');
		});
	});
	$('#antiboucle-show-tags').on('click',function(e){
		e.preventDefault();
		if($('#antiboucle-tags').css('display') == 'none') $('#antiboucle-tags').css('display', 'block');
		else $('#antiboucle-tags').css('display', 'none');
		return false;
	});
	$('#antiboucle-open-box').on('click',function(e){
		e.preventDefault();
		$('#antiboucle-box-info').css('display', 'block');
		$('#antiboucle-overlay').css('display', 'block');
		return false;
	});
	$('#antiboucle-close-box, #antiboucle-overlay').on('click',function(e){
		e.preventDefault();
		$('#antiboucle-box-info').css('display', 'none');
		$('#antiboucle-overlay').css('display', 'none');
		return false;
	});
	var tags = [
		'B7FC9FCDsA0', 'YbN48GgQZ74', '6hpfj3'
	];
	if(typeof GM_getValue('taglist') != 'undefined') {
		if(GM_getValue('taglist').length>0) {
			var Taglist = GM_getValue('taglist').trim();
			var Taglist = Taglist.split(' ');
			$(Taglist).each(function(index,val){
				tags.push(val);
			});
		}
	}
	if(tags.length>0) {
		var regexp = new RegExp(tags.join('|'), 'gi');

		if(GM_getValue("filterlinksonly") == 'checked') {
			$('.bloc-message-forum').each(function(index){
				var Post = $(this);
				var PostContent = $(this).children('.conteneur-message').children('.inner-head-content').children('.bloc-contenu').children('.txt-msg');
				var Text = PostContent.text();

				if(Text.match(regexp)) {
					$(PostContent).html(PostContent.html().replace(regexp, '<i>Lien supprimé par JV-AntiBoucle</i>'));
				}
			});
		}
		else {
			$('.bloc-message-forum').each(function(index){
				var Post = $(this);
				var PostContent = $(this).children('.conteneur-message').children('.inner-head-content').children('.bloc-contenu').children('.txt-msg');
				var Text = PostContent.text();

				if(Text.match(regexp)) {
					$(PostContent).html('<i>Ce message a été retiré par JV-AntiBoucle</i>');
				}
			});
		}
	}
});