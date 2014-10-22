---
layout: base
title: PiX - Documentation
active: docs
---

<p>Pix is designed to flow as you type in a natural and intuitive manner. For this reason we have created a hierarchical namimg schema for icons, from generic to specific. This syntax hierarchy serves as a way to combiane icons by stacking them the same way language works combining words and changing the meaning of the whole chain.</p>

<h3>HTML PiX Structure</h3>
<h4>Basic Element</h4>
Each step of the process comprises 3 <code>block</code> elements inside a <code>li.pix-step</code> that belongs to a <code>ul.pix-steps</code>.


<div class="row">
	<div class="col-md-3">
		<h5>Bloque sin editar</h5>
		<li class='block'>
			<textarea placeholder='type "pix" or ...'></textarea>
		</li>
	</div>
	<div class="col-md-3">
		<h5>Bloque sin editar</h5>
		<div class='docs-block'>
			<strong>li</strong>.block<br>
			<div class='docs-block docs-bk'>
				<strong>textarea</strong>
			</div>
		</div>
	</div>
	<div class="col-md-3">
		<h5>Bloque editado</h5>
		<li class='block'>
			<div class="pix-group">
				<i class="pix pix-click"></i>El usuario hace click sobre el botón aceptar
			</div>
		</li>
	</div>
	<div class="col-md-3">
		<h5>Bloque editado</h5>
		<div class="docs-block">
			<strong>li</strong>.block
			<div class="docs-block">
				<strong>div</strong>.pix-group<br>
				<div class="docs-block">
					<strong>i</strong>.pix 
				</div> + text
			</div>
		</div>
	</div>
</div>

<h2>Partitura</h2>

<div class="pix-score">
	<!-- the score header -->
	<ul class="pix-header col-md-1">
		<li class="block block-user">
			<div class="pix-group"><i class='pix pix-person'></i><label>person</label></div>
		</li>
		<li class="block block-dialogue">
			<div class="pix-group"><i class='pix pix-dialogue'></i><label>dialogue</label></div>
		</li>
		<li class="block block-system">
			<div class="pix-group"><i class='pix pix-system'></i><label>system</label></div>
		</li>
	</ul>

	<!-- the steps -->
	<ul class="pix-steps">
		<li class="pix-step col-md-1">
			{% include tools-top.html %}
			<ul>
				<li class="block block-user">
					<div class="pix-group"><i class="pix">think</i>the user thinks about something</div>
				</li>
				<li class="block block-dialogue">
					<div class="pix-group"><i class="pix">scroll</i>the user scroll through the homepage</div>
				</li>
				<li class="block block-system">
					<div class="pix-group"><i class="pix">empty</i>nothing really happens</div>
				</li>
			</ul>
			{% include tools-bottom.html %}
		</li>
		
		<li class="pix-step col-md-1">
			{% include tools-top.html %}
			<ul>
				<li class="block block-user">
					<div class="pix-group"><i class="pix">say</i>the user says about something</div>
				</li>
				<li class="block block-dialogue">
					<div class="pix-group"><i class="pix">collapse</i>and closes the app</div>
				</li>
				<li class="block block-system">
					<div class="pix-group"></div>
				</li>
			</ul>
			{% include tools-bottom.html %}
		</li>
		
		<li class="pix-step col-md-1">
			{% include tools-top.html %}
			<ul class='split'>
				<li class="block block-user">
					<div class="pix-group"> ... </div>
				</li>
				<li class="block block-dialogue">
					<div class="pix-group"></div>
				</li>
				<li class="block block-system">
					<div class="pix-group"></div>
				</li>
			</ul>
			{% include tools-bottom.html %}
		</li>
		
		<li class="pix-step col-md-1">
			{% include tools-top.html %}
			<ul>
				<li class="block block-user">
					<div class="pix-group"></div>
				</li>
				<li class="block block-dialogue">
					<div class="pix-group"></div>
				</li>
				<li class="block block-system">
					<div class="pix-group"></div>
				</li>
			</ul>
			{% include tools-bottom.html %}
		</li>
		
		<li class="pix-step col-md-1">
			{% include tools-top.html %}
			<ul>
				<li class="block block-user">
					<textarea rows='10'></textarea>
				</li>
				<li class="block block-dialogue">
					<textarea rows='10'></textarea>
				</li>
				<li class="block block-system">
					<textarea rows='10'></textarea>
				</li>
			</ul>
			{% include tools-bottom.html %}
		</li>
		
		<li class="pix-step col-md-1">
			{% include tools-top.html %}
			<ul>
				<li class="block block-user">
					<textarea rows='10'></textarea>
				</li>
				<li class="block block-dialogue">
					<textarea rows='10'></textarea>
				</li>
				<li class="block block-system">
					<textarea rows='10'></textarea>
				</li>
			</ul>
			{% include tools-bottom.html %}
		</li>
		
		<li class="pix-step col-md-1">
			{% include tools-top.html %}
			<ul>
				<li class="block block-user">
					<textarea rows='10'></textarea>
				</li>
				<li class="block block-dialogue">
					<textarea rows='10'></textarea>
				</li>
				<li class="block block-system">
					<textarea rows='10'></textarea>
				</li>
			</ul>
			{% include tools-bottom.html %}
		</li>
		
		<li class="pix-step col-md-1">
			{% include tools-top.html %}
			<ul>
				<li class="block block-user">
					<textarea rows='10'></textarea>
				</li>
				<li class="block block-dialogue">
					<textarea rows='10'></textarea>
				</li>
				<li class="block block-system">
					<textarea rows='10'></textarea>
				</li>
			</ul>
			{% include tools-bottom.html %}
		</li>
		
		<li class="pix-step col-md-1">
			{% include tools-top.html %}
			<ul>
				<li class="block block-user">
					<textarea rows='10'></textarea>
				</li>
				<li class="block block-dialogue">
					<textarea rows='10'></textarea>
				</li>
				<li class="block block-system">
					<textarea rows='10'></textarea>
				</li>
			</ul>
			{% include tools-bottom.html %}
		</li>
		
		<li class="pix-step col-md-1">
			{% include tools-top.html %}
			<ul>
				<li class="block block-user">
					<div class="pix-group"></div>
				</li>
				<li class="block block-dialogue">
					<div class="pix-group"></div>
				</li>
				<li class="block block-system">
					<div class="pix-group"></div>
				</li>
			</ul>
			{% include tools-bottom.html %}
		</li>
		
		
	</ul>
</div>

<hr>
<h4>Para el selector y el autocomplete</h4>
<ul class="select nav nav-stacked pix-ul">
	<li><a href="#"><i class="pix pix-fw pix-click"></i> click</a></li>
	<li><a href="#"><i class="pix pix-fw pix-clock"></i> clock</a></li>
	<li><a href="#"><i class="pix pix-fw pix-cloud"></i> cloud</a></li>
	<li><a href="#"><i class="pix pix-fw pix-collapse"></i> collapse</a></li>
</ul>

<script type="text/javascript" src="{{ site.baseurl }}/js/jquery.min.js"></script>
<script type="text/javascript" src="{{ site.baseurl }}/js/handlebars.min.js"></script>
<script type="text/javascript" src="{{ site.baseurl }}/js/app.js"></script>