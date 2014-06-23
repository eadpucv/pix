---
layout: base
title: PiX - Contact
active: contact
---

<div class='row'>
	<div class='col-sm-6'>
		<h3>Drop us a line</h3>
		<p>Feel free to write us and share your thought on this tool.</p>
	</div>
	<div class='col-sm-6'>
		<form name='contact' action="http://getsimpleform.com/messages?form_api_token=a7bacae78284faac22747762aefba2c0" method="post">
			<input type='hidden' name='redirect_to' value='{{ site.baseurl }}/pages/thankyou' />
			<div class='form-group'>
				<label for='name'>Name</label>
				<input type='text' name='name' class='form-control'/>
			</div>
			<div class='form-group'>
				<label for='email'>Email</label>
				<input type='text' name='email' class='form-control'/>
			</div>
			<div class='form-group'>
				<label for='kind'>Kind</label>
				<select name='kind' class='form-control'>
					<option selected>inquiry regarding the language</option>
					<option>feature request</option>
					<option>icon request</option>
					<option>share an idea for improvement</option>
					<option>request access to the reposity as a collaborator</option>
				</select>
			</div>
			<div class='form-group'>
				<label for='message'>Message</label>
				<textarea name='message' class='form-control' rows='8'></textarea>
			</div>
			<input type='submit' value='Send' class='btn btn-primary pull-right'/>
		</form>
	</div>
</div>
