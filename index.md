---
layout: base
title: PiX - Interaction Notation for UX Design
active: index
---

<div class='row'>
    <div lang='en' class='col-sm-6'>
        <h3>Why?</h3>
        <p>We need a design deliverable that can encapsule the flow of interaction, the quality of the experience we're proposing to the user, to our team members and to the business.</p>
        
<<<<<<< HEAD
        <p>Most of the documents we hand out to our colleagues and clients represent snapshots of the experience flow, and we expect them to imagine the rest, to connect the dots with their imagination. It usually requires other material explanations —such as customer journeys, video sketches with personas, scenarios and the line— to give the idea of what we really want to be happening with our design. This is mainly because our design <strong>encompasses the flow of time</strong> but we lack the language to represent it properly and across all disciplines involved in the project.</p>
    </div>
    <div lang='es' class='col-sm-6'>
        <h3>¿Por Qué?</h3>
        <p>Necesitamos un entregable que permita encapsular el flujo de interacción, la cualidad y calidad de la experiencia que proponemos al usuario, a nuestros colegas y a nuestros clientes. </p>

        <p>La gran mayoría de los documentos que entregamos son imágenes estáticas del flujo de experiencia, y esperamos que ellos lo imaginen en su cabeza. Normalmente se requiere de otras explicaciones —videos, infografías, personas y escenarios, etc.— para dar la idea de lo que realmente proponemos y queremos que ocurra. Esto se debe principalmente a que nuestro diseño <strong>involucra el flujo del tiempo</strong> pero carecemos de un lenguaje que permita representarlo de forma adecuada y legible para todas las disciplinas involucradas en el proyecto.</p>
=======
        <p>Most of the documents we hand out to our colleagues and clients represent snapshots of the experience flow, and we expect them to imagine the rest, to connect the dots with their imagination. It usually requires other material explanations —such as customer journeys, video sketches with personas, scenarios and the like– to give the idea of what we really want to be happening with our design. This is mainly because our design <strong>is a dialogue that unfolds in time</strong> but we lack the language to represent it properly and across all disciplines involved in the project.</p>
    </div>
    <div lang='es' class='col-sm-6'>
        <h3>¿Por Qué?</h3>
        <p>Necesitamos un entregable que permita encapsular el flujo de interacción, la calidad de la experiencia que proponemos al usuario, a nuestros colegas y a nuestros clientes. </p>

        <p>La gran mayoría de los documentos que entregamos son imágenes estáticas del flujo de experiencia, y esperamos que imaginen el resto en su cabeza conectando los puntos. Normalmente se requiere de otras explicaciones —videos, infografías, personas y escenarios, etc.— para dar una idea de lo que realmente proponemos y queremos que ocurra. Esto se debe principalmente a que nuestro diseño <strong>es un diálogo que se despliega en el tiempo</strong> pero carecemos de un lenguaje que permita representarlo de forma adecuada y legible para todas las disciplinas involucradas en el proyecto.</p>
>>>>>>> v5.0.0
    </div>
</div>

<div class='row'>
    <div lang='en' class='col-sm-6'>
        <h3>How it works</h3>
        <p>The score is divided into three layers:</p>
        <ol>
            <li>The user layer</li>
            <li>The interaction layer</li>
            <li>The service layer</li>
        </ol>
    </div>
    <div lang='es' class='col-sm-6'>
        <h3>Cómo funciona</h3>
        <p>La partitura está dividida en tres capas:</p>
        <ol>
            <li>La capa del usuario</li>
            <li>La capa de la interacción</li>
            <li>La capa del servicio</li>
        </ol>
    </div>
</div>

<h2>The Score</h2>

<table class='table pix-table'>
    <tr>
        <th style='width: 20%'>
            <i class='pix pix-person'></i><br>
            <label>person</label>
        </th>
        <td style='width: 40%' lang='en'>
            <p>This layer depicts the persons's intent and goals through the development of his/her mental model of the task at hand. It also shows the (expected) emotions involved in the overall experience.</p>
        </td>
        <td style='width: 40%' lang='es'>
            <p>Esta capa muestra los objetivos de la persona mediante el desarrollo de su modelo mental de la tarea en cuestión. También muestra las emociones (esperadas) involucradas en la experiencia global.</p>
        </td>
    </tr>
    <tr>
        <th style='width: 20%'>
            <i class='pix pix-dialogue'></i><br>
            <label>dialogue</label>
        </th>
        <td style='width: 40%' lang='en'>
            <p>This is the interface dialogue layer that represents the concrete actions happening on the interface: gestures, messages, actions; all direct manipulation of elements and constructs happening onstage.</p>
        </td>
        <td style='width: 40%' lang='es'>
            <p>Esta es la capa del diálogo que representa las acciones concretas sucediendo en la interfaz: gestos, mensajes, acciones; toda manipulación directa de elementos y constructos sucediendo en el punto de contacto.</p>
        </td>
    </tr>
    <tr>
        <th style='width: 20%'>
            <i class='pix pix-system'></i><br>
            <label>system</label>
        </th>
        <td style='width: 40%' lang='en'>
            <p>This is the system layer which shows what happens under the hood, what enables the service performance; all supporting actions and processes delivered to the person.</p>
        </td>
        <td style='width: 40%' lang='es'>
            <p>Esta es la capa del sistema que muestra lo que ocurre tras bambalinas, aquello que permite que el servicio se desarrolle; todas las acciones de apoyo que son entregadas y presentadas a la persona.</p>
        </td>
    </tr>
</table>
<!--
<h1 class='score-header'><input placeholder='Name your score'></h1>
<textarea class='score-description' placeholder='Describe your score'></textarea>
<div class='pix-score'>
   <ul class='pix-header col-sm-1 col-xs-3'>
    <li class='block block-user'><div class='pix-group'><i class='pix pix-face'></i><label>person</label></div></li>
    <li class='block block-dialogue'><div class='pix-group'><i class='pix pix-interaction'></i><label>dialogue</label></div></li>
    <li class='block block-system'><div class='pix-group'><i class='pix pix-gear'></i><label>system</label></div></li>
</ul>
<ul class='pix-steps'>
    <li class='pix-step col-sm-1 col-xs-3'>
        <ul>
            <li class='block block-user'>
                <div class='pix-group'>
                    {% include pix-stack.html pix1='think' pix2='cube' %}
                    <p>The user wants to define a new PiX</p>
                </div>
            </li>
            <li class='block block-dialogue'>
                <div class='pix-group'>
                    {% include pix-stack.html pix1='mouse' pix2='click-center' top-left='arrows-vertical' %}
                    <p>So browses the page for the "create" button</p>
                </div>
            </li>
            <li class='block block-system'>
                <input type='text' placeholder='type here...'>
            </li>
            <div class='note'>
                <p>The PiX App has initiated properly. The system is idle.</p>
            </div>
        </ul>
    </li>
    <li class='pix-step col-sm-1 col-xs-3'>
        <ul>
            <li class='block block-user'>
                <input type='text' placeholder='type here...'>
            </li>
            <li class='block block-dialogue'>
                <div class='pix-group'>
                    {% include pix-stack.html pix1='mouse' pix2='click-left' top-left='plus' %}
                    <p>user clicks "new score"</p>
                </div>
            </li>
            <li class='block block-system'>
                <div class='pix-group'>
                    {% include pix-stack.html pix1='cube' pix2='circle-dashed' %}
                    <p>New PiX object is created with empty fields</p>
                </div>  
            </li>
        </ul>
    </li>
    <li class='pix-step col-sm-1 col-xs-3 split'>
        <ul>
            <li class='block block-user'>
                <input type='text' placeholder='type here...'>
            </li>
            <li class='block block-dialogue'>
                <div class='pix-group'>
                    {% include pix-stack.html pix1='read' pix2='square-dashed' %}
                    <p>Placeholders and labels provide visual cues</p>
                </div>
            </li>
            <li class='block block-system'>
                <input type='text' placeholder='type here...'>
            </li>
        </ul>
        <div class='note'>
            <p>PiX is created and stored in the browser</p>
        </div>
    </li>
    <li class='pix-step col-sm-1 col-xs-3'>
        <ul>
            <li class='block block-user'>
                <div class='pix-group'>
                    {% include pix-stack.html pix1='think' pix2='keyboard-type' %}
                    <p>Pick a name and description</p>
                </div>
            </li>
            <li class='block block-dialogue'>
                <div class='pix-group'>
                    <div class='pix-group'>
                        {% include pix-stack.html pix1='keyboard' top-left='keyboard-type' %}
                        <p>User fills title + description</p>
                    </div>
                </div>
            </li>
            <li class='block block-system'>
                <div class='pix-group'>
                    {% include pix-stack.html pix1='cube' pix2='reload' %}
                    <p>Object's title updated</p>
                </div>
            </li>
        </ul>
    </li>
    <li class='pix-step col-sm-1 col-xs-3'>
        <ul>
            <li class='block block-user'>
                <input type='text' placeholder='type here...'>
            </li>
            <li class='block block-dialogue'>
                <div class='pix-group'>
                    {% include pix-stack.html pix1='keyboard' top-left='akeyboard-tab' %}
                    <p>Moves forward with TAB</p>
                </div>
            </li>
            <li class='block block-system'>
                <div class='pix-group'>
                    {% include pix-stack.html pix1='reload' pix2='cube' %}
                    <p>Object's description updated</p>
                </div>
            </li>
        </ul>
    </li>    
    <li class='pix-step col-sm-1 col-xs-3'>
        <ul>
            <li class='block block-user'>
                <div class='pix-group'>
                    {% include pix-stack.html pix1='think' pix2='list' %}
                    <p>define task as a sequence</p>
                </div>
            </li>
            <li class='block block-dialogue'>
                <div class='pix-group'>
                    {% include pix-stack.html pix1='type' pix2='square-dashed' %}
                    <p>type PiX magic words to create icons</p>
                </div>
            </li>
            <li class='block block-system'>
                <div class='pix-group'>
                    {% include pix-stack.html pix1='type' pix2='gear' %}
                    <p>App checks concordances of magic words</p>
                </div>
            </li>
        </ul>
    </li>
    <li class='pix-step col-sm-1 col-xs-3'>
        <ul>
            <li class='block block-user'>
                <input type='text' placeholder='type here...'>
            </li>
            <li class='block block-dialogue'>
                <div class='pix-group'>
                    {% include pix-stack.html pix1='keyboard' top-left='keyboard-tab' %}
                    <p>Moves through PiX blocks with TAB</p>
                </div>
            </li>
            <li class='block block-system'>
                <div class='pix-group'>
                    {% include pix-stack.html pix1='plus' pix2='circle-dashed' %}
                    <p>When the end of the score is reached, TAB adds a new column</p>
                </div>
            </li>
        </ul>
    </li>
    <li class='pix-step col-sm-1 col-xs-3'>
        <ul>
            <li class='block block-user'>
                <div class='pix-group'>
                    <i class='pix pix-user-surprised'></i>
                    <p>The user is amazed by PiX awesomeness!</p>
                </div>
            </li>
            <li class='block block-dialogue'>
                <input type='text' placeholder='type here...'>
            </li>
            <li class='block block-system'>
                <input type='text' placeholder='type here...'>
            </li>
        </ul>
    </li>
    <li class='pix-step col-sm-1 col-xs-3'>
        <ul>
            <li class='block block-user'>
                <input type='text' placeholder='type here...'>
            </li>
            <li class='block block-dialogue'>
                <input type='text' placeholder='type here...'>
            </li>
            <li class='block block-system'>
                <input type='text' placeholder='type here...'>
            </li>
        </ul>
    </li>
    <li class='pix-step col-sm-1 col-xs-3'>
        <ul>
            <li class='block block-user'>
                <input type='text' placeholder='type here...'>
            </li>
            <li class='block block-dialogue'>
                <input type='text' placeholder='type here...'>
            </li>
            <li class='block block-system'>
                <input type='text' placeholder='type here...'>
            </li>
        </ul>
    </li>
    <li class='pix-step col-sm-1 col-xs-3'>
        <ul>
            <li class='block block-user'>
                <input type='text' placeholder='type here...'>
            </li>
            <li class='block block-dialogue'>
                <input type='text' placeholder='type here...'>
            </li>
            <li class='block block-system'>
                <div class='pix-group'>
                    <div class='pix-stack'>
                        <i class='pix pix-grid-ul'></i>
                        <i class='pix pix-grid-center stack-top-left orange'></i>
                    </div>
                    <p>This is a test for alignment purposes</p>
                </div>
            </li>
        </ul>
    </li>
</ul>
</div>

<button class='btn btn-primary'>Add other score</button>

<hr>
-->
<div class='row'>
    <div class='col-sm-6'>
        <h3>Team</h3>
        <ul class='media-list'>
            <li class='media'>
                <a class='pull-left' href='#'>
                    <img class='media-object img-circle' src='{{ site.baseurl }}/img/katherine.jpg' width='48' alt='Katherine Exss'>
                </a>
                <div class='media-body'>
                    <h4 class='media-heading'>Katherine Exss</h4>
                    <p>User Researcher & Information Architect - <a href="https://twitter.com/alikathe">@alikathe</a></p>
                </div>
            </li>
            <li class='media'>
                <a class='pull-left' href='#'>
                    <img class='media-object img-circle' src='{{ site.baseurl }}/img/herbert.jpg' width='48' alt='Herbert Spencer'>
                </a>
                <div class='media-body'>
                    <h4 class='media-heading'>Herbert Spencer</h4>
                    <p>Visual & Interaction Designer - <a href="https://twitter.com/hspencer">@hspencer</a></p>
                </div>
           </li>
            <li class='media'>
                <a class='pull-left' href='#'>
                    <img class='media-object img-circle' src='{{ site.baseurl }}/img/hugo.jpg' width='48' alt='Hugo Solar'>
                </a>
                <div class='media-body'>
                    <h4 class='media-heading'>Hugo Solar</h4>
                    <p>Lead Developer - <a href="https://twitter.com/hugosolar">@hugosolar</a></p>
                </div>
            </li>
        </ul>
    </div>
     <div class='col-sm-6'>
        <h3>Special thanks to</h3>
        <ul>
            <li>Nicole Dupre</li>
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


