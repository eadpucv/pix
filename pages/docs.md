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
			<div class='note top'>Wireframe 01</div>
			<ul class='split'>
				<li class="block block-user">
					<div class="pix-group">Y así se comporta la celda cuando hay sólo texto, que es muy posible que ocurra.</div>
				</li>
				<li class="block block-dialogue">
					<div class="pix-group"></div>
				</li>
				<li class="block block-system">
					<div class="pix-group"></div>
				</li>
			</ul>
			<div class='note bottom'>En este momento parece oportuno agregar una nota</div>
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


<h4>Dropdown</h4>
<p>Hay que modificar el display y el posicionamiento en el CSS. Buscar '.select' en 'app.less'</p>

<div class="row">
	<div class="col-md-4">
		Ejemplo de autocomplete
		<ul class="select nav nav-stacked pix-ul">
			<li><a href="#"><i class="pix pix-fw pix-click"></i> click</a></li>
			<li><a href="#"><i class="pix pix-fw pix-clock"></i> clock</a></li>
			<li><a href="#"><i class="pix pix-fw pix-cloud"></i> cloud</a></li>
			<li><a href="#"><i class="pix pix-fw pix-collapse"></i> collapse</a></li>
		</ul>
	</div>
	<div class="col-md-4">
		<div class="docs-block">
			<strong>ul</strong>select nav nav-stacked pix-ul
			<div class="docs-block"><div class="docs-block"><strong>i</strong>.pix pix-fw pix-iconName</div> text</div>
			<div class="docs-block"><div class="docs-block"><strong>i</strong>.pix pix-fw pix-iconName</div> text</div>
			<div class="docs-block"><div class="docs-block"><strong>i</strong>.pix pix-fw pix-iconName</div> text</div>
			<div class="docs-block"><div class="docs-block"><strong>i</strong>.pix pix-fw pix-iconName</div> text</div>
		</div>
	</div>
	<div class="col-md-4">
		Ejemplo para el selector de "tipo de partitura"
		<ul class="select nav nav-stacked pix-ul">
			<li><a href="#"><i class="pix pix-fw pix-dialogue"></i> dialogue</a></li>
			<li><a href="#"><i class="pix pix-fw pix-mobile"></i> mobile</a></li>
			<li><a href="#"><i class="pix pix-fw pix-tablet"></i> tablet</a></li>
			<li><a href="#"><i class="pix pix-fw pix-notebook"></i> notebook</a></li>
			<li><a href="#"><i class="pix pix-fw pix-desktop"></i> desktop</a></li>
			<li><a href="#"><i class="pix pix-fw pix-tv"></i> tv</a></li>
			<li><a href="#"><i class="pix pix-fw pix-game"></i> game</a></li>
			<li><a href="#"><i class="pix pix-fw pix-body"></i> body</a></li>
		</ul>
	</div>
</div>


<script type="text/javascript" src="{{ site.baseurl }}/js/jquery.min.js"></script>
<script type="text/javascript" src="{{ site.baseurl }}/js/handlebars.min.js"></script>
<script type="text/javascript" src="{{ site.baseurl }}/js/app.js"></script>