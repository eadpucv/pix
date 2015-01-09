---
layout: app
title: PiX Application
active: app
---

<h1 class='score-header'><input placeholder='Name your score'></h1>
<textarea class='score-description' placeholder='Describe your score' rows='1'></textarea>


<div id="pix-template">
	<!-- Handlebars template-->
</div>

<button id="add-new" class='btn btn-primary pull-right'><i class='pix pix-fw pix-3x'>add</i></button>

<script id="layout-score" type="text/x-handlebars-template">
	<div class='pix-score'>
	     <ul class='pix-header'>
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
	<li class='pix-step'>
        <textarea class="note top" rows='1' placeholder='type here...'></textarea>
        <div class="fly-link top">
            <a href="#split" class="btn btn-tools tool-split" title="split score"><img src='{{ site.baseurl }}/img/tool_split.svg'></a>
            <a href="#remove" class="btn btn-tools tool-remove" title="remove step"><img src='{{ site.baseurl }}/img/tool_remove.svg'></a>
            <a href="#add" class="btn btn-tools tool-add" title="add step"><img src='{{ site.baseurl }}/img/tool_add.svg'></a>
        </div>
        <ul>
            <li class='block block-user'>
                <textarea rows='10' placeholder='type here...'></textarea>
                <div class="pix-div-input" contenteditable="true"></div>
            </li>
            <li class='block block-dialogue'>
                <textarea rows='10' placeholder='type here...'></textarea>
                <div class="pix-div-input" contenteditable="true"></div>
            </li>
            <li class='block block-system'>
                <textarea rows='10' placeholder='type here...'></textarea>
                <div class="pix-div-input" contenteditable="true"></div>
            </li>
        </ul>
        <div class="fly-link bottom">
            <a href="#add-note" class="btn btn-xs btn-tools tool-note" title="add note"><img src='{{ site.baseurl }}/img/tool_nota.svg'></a>
        </div>
            <textarea class="note bottom" rows='10' placeholder='type here...'></textarea>
    </li>
</script>
