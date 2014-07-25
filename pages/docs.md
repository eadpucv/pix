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

<!--
<ul class='docs'>
	<li><i class='pix pix-3x pix-think'></i> pix-think
		<ul>
			<li>{% include stack.html pix1="think" pix2="idea" %} pix-think-idea</li>
			<li>{% include stack.html pix1="think" pix2="list" %} pix-think-task</li>
			<li>{% include stack.html pix1="think" pix2="question" %} pix-think-question</li>
			<li>{% include stack.html pix1="think" pix2="ok" %} pix-think-ok, pix-think-complete</li>
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

-->

<h3>HTML PiX Structure</h3>
<h4>Score Overview</h4>
<div class='docs-block'>
	.pix-score<br>
	<div class='docs-block docs-bk'>
		<strong>ul</strong>.pix-header<br>
		<div class='docs-block docs-bk'>
			<strong>li</strong>.block<br>
			.block-user<br>
			<div class='docs-block docs-bk'>
				.pix-group<br>
				<div class='docs-block docs-bk'><strong>i</strong>.pix pix-user</div><br>
				<div class='docs-block docs-bk'><strong>label</strong></div>
			</div>
		</div><br>
		<div class='docs-block docs-bk'>
			<strong>li</strong>.block<br>
			.block-dialogue<br>
			<div class='docs-block docs-bk'>
				.pix-group<br>
				<div class='docs-block docs-bk'><strong>i</strong>.pix pix-dialogue</div><br>
				<div class='docs-block docs-bk'><strong>label</strong></div>
			</div>
		</div><br>
		<div class='docs-block docs-bk'>
			<strong>li</strong>.block<br>
			.block-system<br>
			<div class='docs-block docs-bk'>
				.pix-group<br>
				<div class='docs-block docs-bk'><strong>i</strong>.pix pix-system</div><br>
				<div class='docs-block docs-bk'><strong>label</strong></div>
			</div>
		</div>
	</div>

	<div class='docs-block'>
		<strong>ul</strong>.pix-steps<br>
		<div class='docs-block'>
			<strong>li</strong>.pix-step<br>
			<div class='docs-block'>
				<strong>ul</strong>.pix-blocks<br>
				<div class='docs-block'>
					<strong>li</strong>.block block-user<br>
					<div class='docs-block'>
						.pix-group<br>
						<div class='docs-block'><strong>i</strong>.pix pix-<em>icon-name</em></div><br>
						<div class='docs-block'><strong>p</strong></div>
					</div>
				</div><br>
				<div class='docs-block'>
					<strong>li</strong>.block block-dialogue<br>
					<div class='docs-block'>
						.pix-group<br>
						<div class='docs-block'><strong>i</strong>.pix pix-<em>icon-name</em></div><br>
						<div class='docs-block'><strong>p</strong></div>
					</div>
				</div><br>
				<div class='docs-block'>
					<strong>li</strong>.block block-system<br>
					<div class='docs-block'>
						.pix-group<br>
						<div class='docs-block'><strong>i</strong>.pix pix-<em>icon-name</em></div><br>
						<div class='docs-block'><strong>p</strong></div>
					</div>
				</div><br>
				<div class='docs-block'>
					.pix-notes<br>
					<div class='docs-block'><strong>p</strong>
					</div>
				</div>
			</div>
		</div>
		<div class='docs-block'>
			<strong>li</strong>.pix-step<br>
			<div class='docs-block'>
				<strong>ul</strong>.pix-blocks<br>
				<div class='docs-block'>
					<strong>li</strong>.block block-user<br>
					<div class='docs-block'>
						.pix-group<br>
						<div class='docs-block'><strong>i</strong>.pix pix-<em>icon-name</em></div><br>
						<div class='docs-block'><strong>p</strong></div>
					</div>
				</div><br>
				<div class='docs-block'>
					<strong>li</strong>.block block-dialogue<br>
					<div class='docs-block'>
						.pix-group<br>
						<div class='docs-block'><strong>i</strong>.pix pix-<em>icon-name</em></div><br>
						<div class='docs-block'><strong>p</strong></div>
					</div>
				</div><br>
				<div class='docs-block'>
					<strong>li</strong>.block block-system<br>
					<div class='docs-block'>
						.pix-group<br>
						<div class='docs-block'><strong>i</strong>.pix pix-<em>icon-name</em></div><br>
						<div class='docs-block'><strong>p</strong></div>
					</div>
				</div><br>
				<div class='docs-block'>
					.pix-notes<br>
					<div class='docs-block'><strong>p</strong>
					</div>
				</div>
			</div>
		</div>
		<div class='docs-block'>
			<strong>li</strong>.pix-step<br>
			<div class='docs-block'>
				<strong>ul</strong>.pix-blocks<br>
				<div class='docs-block'>
					<strong>li</strong>.block block-user<br>
					<div class='docs-block'>
						.pix-group<br>
						<div class='docs-block'><strong>i</strong>.pix pix-<em>icon-name</em></div><br>
						<div class='docs-block'><strong>p</strong></div>
					</div>
				</div><br>
				<div class='docs-block'>
					<strong>li</strong>.block block-dialogue<br>
					<div class='docs-block'>
						.pix-group<br>
						<div class='docs-block'><strong>i</strong>.pix pix-<em>icon-name</em></div><br>
						<div class='docs-block'><strong>p</strong></div>
					</div>
				</div><br>
				<div class='docs-block'>
					<strong>li</strong>.block block-system<br>
					<div class='docs-block'>
						.pix-group<br>
						<div class='docs-block'><strong>i</strong>.pix pix-<em>icon-name</em></div><br>
						<div class='docs-block'><strong>p</strong></div>
					</div>
				</div><br>
				<div class='docs-block'>
					.pix-notes<br>
					<div class='docs-block'><strong>p</strong>
					</div>
				</div>
			</div>
		</div>
		<div class='docs-block'>
			<strong>li</strong>.pix-step<br>
			<br>
			<br>
			<br>
			<br>
			<br>
			<em>etc...</em>
			<br>
			<br>
			<br>
			<br>
			<br>
			<br>
		</div>
	</div>
</div>

<h3>Regular and Stacked Icons</h3>
<div class='row'>
	<div class='col-md-2'>
		<h5>Regular Icon</h5>
		<div class='docs-block'>
			<strong>li</strong>.block<br>
			<div class='docs-block'>
				.pix-group<br>
				<div class='docs-block'><strong>i</strong>.pix pix-<em>icon-name</em></div><br>
				<div class='docs-block'><strong>p</strong></div>
			</div>
		</div>
	</div>
	<div class='col-md-2'>
		<h5>Stacked Icon</h5>
		<div class='docs-block'>
			<strong>li</strong>.block<br>
			<div class='docs-block'>
				.pix-group<br>
				<div class='docs-block'>
					.pix-stacked<br>
					<div class='docs-block'><strong>i</strong>.pix pix-<em>icon-name</em></div><br>
					<div class='docs-block'><strong>i</strong>.pix pix-<em>icon-name</em></div><br>
					<div class='docs-block'><strong>i</strong>.pix pix-<em>icon-name</em></div><br>
				</div>
				
				<div class='docs-block'><strong>p</strong></div>
			</div>
		</div>
	</div>
</div>
<h3>Testing Area</h3>

<div style='font-size: 500%'>
	<div class='pix-stack'>

		<i class='color pix pix-grid-all stack-upper-left'></i>
		<i class='blue pix pix-grid-all stack-upper-right'></i>
		<i class='green pix pix-grid-all stack-lower-left'></i>
		<i class='orange pix pix-grid-all stack-lower-right'></i>
		<i class='pix pix-grid-all pix-stack-1x'></i>
	</div>
	&nbsp;&nbsp;&nbsp;
	{% include stack.html pix1="cog" pix2="gear" %} 
	;&nbsp;
	<div class='pix-stack pix-stack-lg'>
	    <i class='pix pix-gear color'></i>
	    <i class='pix pix-cog pix-spin'></i>
	</div>
	&nbsp;
		<div class='pix-stack pix-stack-lg'>
	    <i class='pix pix-ok green'></i>
	    <i class='pix pix-refresh pix-spin'></i>
	</div>
	&nbsp;
	{% include stack-ul.html pix="hand" ul="arrows-move" %} 
	&nbsp;
	{% include stack.html pix1="ok" pix2="refresh" %} 
	&nbsp;
	{% include stack.html pix1="circle" pix2="user-happy" %} 
	&nbsp;
	{% include stack.html pix1="contact" pix2="book" %} 
	&nbsp;
	{% include stack.html pix1="face-intrigued" pix2="say" %}
	&nbsp;
	{% include stack.html pix1="lock" pix2="gear-large" %}
	&nbsp; 
	{% include stack-ul.html pix="touch-1" ul="switch" %}
	&nbsp; 
	{% include stack-ul.html pix="mouse-all" ul="arrows-move" %}
	&nbsp; 
	{% include stack-ul.html pix="keyboard" ul="keyboard-tab" %}  
</div>

