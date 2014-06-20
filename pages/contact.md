---
layout: base
title: PiX - Contact
active: contact
---


<form action="http://getsimpleform.com/messages?form_api_token=a7bacae78284faac22747762aefba2c0" method="post">
	{% if site.baseurl == null %}
<input type='hidden' name='redirect_to' value='http://localhost:4000/pages/thankyou' />
	{% else %}
<input type='hidden' name='redirect_to' value='{{ site.baseurl }}/pages/thankyou' />
	{% endif %}

<div class='form-group'>
	<label for='name'>Name</label>
	<input type='text' name='name' class='form-control'/>
</div>

<div class='form-group'>
	<label for='email'>Email</label>
	<input type='text' name='email' class='form-control'/>
</div>

<div class='form-group'>
	<label for='message'>Message</label>
	<textarea name='message' class='form-control'></textarea>
</div>


<input type='submit' value='Send' class='btn btn-primary'/>
</form>