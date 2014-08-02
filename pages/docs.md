---
layout: base
title: PiX - Documentation
active: docs
---

<p>Pix is designed to flow as you type in a natural and intuitive manner. For this reason we have created a hierarchical namimg schema for icons, from generic to specific. This syntax hierarchy serves as a way to combiane icons by stacking them the same way language works combining words and changing the meaning of the whole chain.</p>

<h3>HTML PiX Structure</h3>
<h4>Basic Element</h4>
Each step of the process comprises 3 <code>block</code> elements inside a <code>li.pix-step</code> that belongs to a <code>ul.pix-steps</code>.
<div class='row'>
	<div class='col-md-2'>
		<h5>Unedited block</h5>
		<div class='docs-block'>
			<strong>li</strong>.block<br>
			<div class='docs-block docs-bk'>
				<strong>input type='text'</strong>
			</div>
		</div>
	</div>
	<div class='col-md-2'>
		<h5>Regular Icon</h5>
		<div class='docs-block'>
			<strong>li</strong>.block<br>
			<div class='docs-block docs-bk'>
				<strong>div</strong>.pix-group<br>
				<div class='docs-block'>
					<strong>i</strong>.pix pix-<em>icon-name</em><br>
				</div><br>
				<div class='docs-block'>
					<strong>p</strong><br>
				</div>
			</div>
		</div>
	</div>
		<div class='col-md-2'>
		<h5>Stacked Icon</h5>
		<div class='docs-block'>
			<strong>li</strong>.block<br>
			<div class='docs-block docs-bk'>
				<strong>div</strong>.pix-group<br>
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

<h4>Score Overview</h4>
<div class='docs-block'>
	.pix-score<br>
	<div class='docs-block docs-bk'>
		<strong>ul</strong>.pix-header col-sm-1 col-xs-3<br>
		<div class='docs-block docs-bk'>
			<strong>li</strong>.block<br>
			.block-user<br>
			<div class='docs-block docs-bk'>
				<strong>div</strong>.pix-group<br>
				<div class='docs-block docs-bk'><strong>i</strong>.pix pix-user</div><br>
				<div class='docs-block docs-bk'><strong>label</strong></div>
			</div>
		</div><br>
		<div class='docs-block docs-bk'>
			<strong>li</strong>.block<br>
			.block-dialogue<br>
			<div class='docs-block docs-bk'>
				<strong>div</strong>.pix-group<br>
				<div class='docs-block docs-bk'><strong>i</strong>.pix pix-dialogue</div><br>
				<div class='docs-block docs-bk'><strong>label</strong></div>
			</div>
		</div><br>
		<div class='docs-block docs-bk'>
			<strong>li</strong>.block<br>
			.block-system<br>
			<div class='docs-block docs-bk'>
				<strong>div</strong>.pix-group<br>
				<div class='docs-block docs-bk'><strong>i</strong>.pix pix-system</div><br>
				<div class='docs-block docs-bk'><strong>label</strong></div>
			</div>
		</div>
	</div>
	<div class='docs-block'>
		<strong>ul</strong>.pix-steps<br>
		<div class='docs-block'>
			<strong>li</strong>.pix-step col-sm-1 col-xs-3<br>
			<div class='docs-block'>
				<strong>ul</strong>.pix-blocks<br>
				<div class='docs-block'>
					<strong>li</strong>.block block-user<br>
					<div class='docs-block'>
						<strong>div</strong>.pix-group<br>
						<div class='docs-block'><strong>i</strong>.pix pix-<em>icon-name</em></div><br>
						<div class='docs-block'><strong>p</strong></div>
					</div>
				</div><br>
				<div class='docs-block'>
					<strong>li</strong>.block block-dialogue<br>
					<div class='docs-block'>
						<strong>div</strong>.pix-group<br>
						<div class='docs-block'><strong>i</strong>.pix pix-<em>icon-name</em></div><br>
						<div class='docs-block'><strong>p</strong></div>
					</div>
				</div><br>
				<div class='docs-block'>
					<strong>li</strong>.block block-system<br>
					<div class='docs-block'>
						<strong>div</strong>.pix-group<br>
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
			<strong>li</strong>.pix-step col-sm-1 col-xs-3<br>
			<div class='docs-block'>
				<strong>ul</strong>.pix-blocks<br>
				<div class='docs-block'>
					<strong>li</strong>.block block-user<br>
					<div class='docs-block'>
						<strong>div</strong>.pix-group<br>
						<div class='docs-block'><strong>i</strong>.pix pix-<em>icon-name</em></div><br>
						<div class='docs-block'><strong>p</strong></div>
					</div>
				</div><br>
				<div class='docs-block'>
					<strong>li</strong>.block block-dialogue<br>
					<div class='docs-block'>
						<strong>div</strong>.pix-group<br>
						<div class='docs-block'><strong>i</strong>.pix pix-<em>icon-name</em></div><br>
						<div class='docs-block'><strong>p</strong></div>
					</div>
				</div><br>
				<div class='docs-block'>
					<strong>li</strong>.block block-system<br>
					<div class='docs-block'>
						<strong>div</strong>.pix-group<br>
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
			<strong>li</strong>.pix-step col-sm-1 col-xs-3<br>
			<div class='docs-block'>
				<strong>ul</strong>.pix-blocks<br>
				<div class='docs-block'>
					<strong>li</strong>.block block-user<br>
					<div class='docs-block'>
						<strong>div</strong>.pix-group<br>
						<div class='docs-block'><strong>i</strong>.pix pix-<em>icon-name</em></div><br>
						<div class='docs-block'><strong>p</strong></div>
					</div>
				</div><br>
				<div class='docs-block'>
					<strong>li</strong>.block block-dialogue<br>
					<div class='docs-block'>
						<strong>div</strong>.pix-group<br>
						<div class='docs-block'><strong>i</strong>.pix pix-<em>icon-name</em></div><br>
						<div class='docs-block'><strong>p</strong></div>
					</div>
				</div><br>
				<div class='docs-block'>
					<strong>li</strong>.block block-system<br>
					<div class='docs-block'>
						<strong>div</strong>.pix-group<br>
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
			<strong>li</strong>.pix-step col-sm-1 col-xs-3<br>
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

<h4>Testing Area</h4>
<div class='row'>
	{% include col-pix-stack.html gray='grid' top-right='ok' bottom-left='no' %}
</div>

