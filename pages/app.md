---
layout: app
title: PiX Application
active: app
---

<h1 class='score-header'><input placeholder='Name your score' value='Score Name'></h1>
<textarea class='score-description' placeholder='Describe your score' rows='1'>This is the description you can edit. Navigate the score with your TAB key to add new columns. In the icon input area just type the icon's name and it'll appear.</textarea>


<div id="pix-template">
	<!-- Handlebars template-->
</div>

<button id="add-new" class='btn btn-primary pull-right'><i class='pix pix-fw pix-3x'>add</i></button>
<script id="layout-score" type="text/x-handlebars-template">
	<div class='pix-score'>
	     <ul class='pix-header col-lg-1 col-sm-2 col-xs-3'>
			<li class='block block-user'><div class='pix-group'><i class='pix pix-person'></i><label>person</label></div></li>
			<li class='block block-dialogue'><div class='pix-group'><i class='pix pix-dialogue'></i><label>dialogue</label></div></li>
			<li class='block block-system'><div class='pix-group'><i class='pix pix-system'></i><label>system</label></div></li>
		</ul>
	    <ul class='pix-steps'>
	    {% raw %}
	        {{{step}}} 
	    {% endraw %}
	    </ul>
	</div>
</script>

<script id="pix-step" type="text/x-handlebars-template">
	<li class='pix-step col-lg-1 col-sm-2 col-xs-3'>
    	<a href="#split-toggle" class="fly-link top">Split score</a>
        <ul>
            <li class='block block-user'>
                <input type='text' class="pix pix-input input-user" placeholder='empty'>
                <textarea class="pix-note input-user" placeholder='type here...'></textarea>
            </li>
            <li class='block block-dialogue'>
                <input type='text' class="pix pix-input input-dialogue" placeholder='empty'>
                <textarea class="pix-note input-dialogue" placeholder='type here...'></textarea>
            </li>
            <li class='block block-system'>
                <input type='text' class="pix pix-input input-system" placeholder='empty'>
                <textarea class="pix-note input-system" placeholder='type here...'></textarea>
            </li>
            <div class='note'>
               <textarea class="input-note" placeholder='type here...'></textarea>
            </div>
        </ul>
        <a href="#add-note" class="fly-link bottom">Add note</a>
    </li>
</script>
