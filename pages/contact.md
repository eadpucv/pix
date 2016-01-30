---
layout: simple
title: PiX - Contact
active: contact
---

<div class='row'>
	<div class='col-sm-8 col-sm-offset-2'>
        <h2>Contact Us!</h2>
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


        <h3>Contact Information</h3>

        <address>
            <strong><span class='orange'>.:TIG:.</span> Taller de Investigaciones Gráficas</strong>
            <a href='http://www.ead.pucv.cl'>e[ad] Escuela de Arquitectura y Diseño PUCV</a>

            Matta 12, Recreo
            Viña del Mar, Chile
            Postal Code: 2580129
            +56 32 2274401
            PO Box: 4170 V2 Valparaíso
        </address>
    </div>
</div>

<div class='row'>
    <div class='col-sm-4 col-sm-offset-2'>
        <h3>Team</h3>
        <ul class='media-list'>
            <li class='media'>
                <a class='pull-left' href='#'>
                    <img class='media-object img-circle' src='{{ site.baseurl }}/img/herbert.jpg' width='48' alt='Herbert Spencer'>
                </a>
                <div class='media-body'>
                    <h4 class='media-heading'>Herbert Spencer</h4>
                    <span>Visual & Interaction Designer - <a href="https://twitter.com/hspencer">@hspencer</a></span>
                </div>
            </li>
            <li class='media'>
                <a class='pull-left' href='#'>
                    <img class='media-object img-circle' src='{{ site.baseurl }}/img/katherine.jpg' width='48' alt='Katherine Exss'>
                </a>
                <div class='media-body'>
                    <h4 class='media-heading'>Katherine Exss</h4>
                    <span>User Researcher & Information Architect - <a href="https://twitter.com/alikathe">@alikathe</a></span>
                </div>
            </li>
            <li class='media'>
                <a class='pull-left' href='#'>
                    <img class='media-object img-circle' src='{{ site.baseurl }}/img/hugo.jpg' width='48' alt='Hugo Solar'>
                </a>
                <div class='media-body'>
                    <h4 class='media-heading'>Hugo Solar</h4>
                    <span>Lead Developer - <a href="https://twitter.com/hugosolar">@hugosolar</a></span>
                </div>
            </li>
        </ul>
    </div>
    <div class='col-sm-4'>
        <h3>Special thanks to</h3>
        <ul>
            <li>Nicole Dupre, UX Designer - <a href="https://twitter.com/dupre">@dupre</a></li>
            <li>Melany Marin</li>
            <li>Ingrid Céspedes</li>
        </ul>
        <h4>And Also to</h4>
        <ul>
            <li><a href='https://github.com/sapegin/grunt-webfont'>Grunt-Webfont</a></li>
            <li><a href='https://icomoon.io/'>IcoMoon</a></li>
        </ul>
    </div>
</div>
