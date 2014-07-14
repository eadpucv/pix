---
layout: base
title: PiX - Documentation
active: docs
---

<p>Pix is designed to flow as you type in a natural and intuitive manner. For this reason we have created a hierarchical namimg schema for icons, from generic to specific. This syntax hierarchy serves as a way to combiane icons by stacking them the same way language works combining words and changing the meaning of the whole chain.</p>


<h3><i class='pix pix-2x black pix-user'></i> User Intent</h3>

<table class='table table-bordered'>
	<tr>
		<thead>
			<th>
				1<sup>st</sup> order container: verb, action representing user intent
			</th>
			<th>
				2<sup>nd</sup> order element: generic object or construct
			</th>
			<th>
				3<sup>rd</sup> order complement: state or quality (rare)
			</th>
		</thead>
	</tr>
	<tr>
		<td>think, say, do, feel</td>
		<td>task, object, idea, question, text, picture, sound, location, voice, video</td>
		<td>complete, incomplete</td>
	</tr>
</table>

<ul class='docs'>
	<li><i class='pix pix-3x pix-think'></i> pix-think
		<ul>
			<li>{% include stack2.html pix1="think" pix2="idea" %} pix-think-idea</li>
			<li>{% include stack2.html pix1="think" pix2="list" %} pix-think-task</li>
			<li>{% include stack2.html pix1="think" pix2="question" %} pix-think-question</li>
			<li>{% include stack2.html pix1="think" pix2="ok" %} pix-think-ok, pix-think-complete</li>
		</ul>
	</li>
</ul>

####<i class='pix pix-2x black pix-dialogue'></i> Interface Dialogue####

#####Navigate#####
* scroll
	* mouse
	* touch
		* two fingers
		* three fingers
		* four fingers
* navigate
	- next
		+ touch
	- previous
		+ touch

#####Manipulate#####
* open
* close
	- touch
* move
	* resize
* drag
	* drag-n-drop
* rotate
	* element
	* touch
	* device
* select
	* radio
	* checkbox
	* dropdown
	* list

#####Controls#####
* input
	* text
	* voice
	* picture
	* video
	* sound
	* location
	* gesture
	* value
		- slider
		- wheel

#####Physical#####
* device
	* rotate
	* orient
	* orbit

####<i class='pix pix-2x black pix-gear'></i> System Response####
* update (refresh)
	* data
	* screen
* query
* process
	* success
	* fail
* file
	* upload
		* multiple
	* download
* communicate
	* send
	* receive


<h3>Testing Area</h3>

<div style='font-size: 500%'>
	 <div class='pix-stack'>
        
        <i class='color pix pix-grid-all pix-stack-1x upper-left'></i>
        <i class='blue pix pix-grid-all pix-stack-1x upper-right'></i>
        <i class='green pix pix-grid-all pix-stack-1x lower-left'></i>
        <i class='orange pix pix-grid-all pix-stack-1x lower-right'></i>
        <i class='pix pix-grid-all pix-stack-1x'></i>
    </div>
</div>