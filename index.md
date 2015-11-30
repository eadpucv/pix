---
layout: base
title: PiX - Interaction Notation for UX Design
active: index
lang: en
---
<!--
<div class='row'>
<div class='tcenter'>
    <a class='btn huge' href='{{ site.baseurl }}/pages/app'>
        <i class='pix'>notebook body play</i>
    </a>
</div>
</div>
-->

<hr>

<div class='row'>
    <div class='col-sm-4 col-sm-offset-2'>
        <a class='btn btn-block huge' href='{{ site.baseurl }}/pages/app'>PiX app</a>
    </div>
    <div class='col-sm-4'>
        <a class='btn btn-block huge' href='{{ site.baseurl }}/downloads/pix-toolkit.pdf'>Toolkit</a>
    </div>
</div>

<hr>

<div class='row'>
    <div class='col-sm-8 col-sm-offset-2'>
        
        <p class='xl'>PiX is a visual language specially crafted to define experience involved in the interaction flow within digital services.</p>

        <h3>Why?</h3>
        
        <p>We need a design deliverable that can encapsule the flow of interaction, the quality of the experience we're proposing to the user, to our team members and to the business.</p>
        
        <p>Most of the documents we hand out to our colleagues and clients represent snapshots of the experience flow, and we expect them to imagine the rest, to connect the dots with their imagination. It usually requires other material explanations —such as customer journeys, video sketches with personas, scenarios and the like– to give the idea of what we really want to be happening with our design. This is mainly because our design <strong>is a dialogue that unfolds in time</strong> but we lack the language to represent it properly and across all disciplines involved in the project.</p>
    </div>
</div>

<hr>

<div class='row'>
    <div class='col-sm-8 col-sm-offset-2'>
        <h3>How it works</h3>
        <p>The score is divided into three layers:</p>
        <ol>
            <li>The user layer</li>
            <li>The interaction layer</li>
            <li>The service layer</li>
        </ol>
    </div>
</div>

<div class='row'>
    <div class='col-sm-8 col-sm-offset-2'>
        <h2>The Score</h2>
        <table class='table pix-table'>
            <tr>
                <th style='width: 20%'>
                    <i class='pix pix-person'></i><br>
                    <label>person</label>
                </th>
                <td style='width: 40%'>
                    <p>This layer depicts the persons's intent and goals through the development of his/her mental model of the task at hand. It also shows the (expected) emotions involved in the overall experience.</p>
                </td>
            </tr>
            <tr>
                <th style='width: 20%'>
                    <i class='pix pix-dialogue'></i><br>
                    <label>dialogue</label>
                </th>
                <td style='width: 40%'>
                    <p>This is the interface dialogue layer that represents the concrete actions happening on the interface: gestures, messages, actions; all direct manipulation of elements and constructs happening onstage.</p>
                </td>
            </tr>
            <tr>
                <th style='width: 20%'>
                    <i class='pix pix-system'></i><br>
                    <label>system</label>
                </th>
                <td style='width: 40%'>
                    <p>This is the system layer which shows what happens under the hood, what enables the service performance; all supporting actions and processes delivered to the person.</p>
                </td>
            </tr>
        </table>
    </div>
</div>

<div class='row'>
    <div class="col-sm-offset-2 col-sm-8">
        <h3 id="docs">How to create a PiX</h3>
        <ol>
            <li>Open the <a href='{{ site.baseurl }}/pages/app'>App</a></li>
            <li>Name your PiX and add a description</li>
            <li>Type inside each PiX cell, for adding an icon, just type <code>pix-</code> plus the icon name you wish to insert (check the <a href='http://eadpucv.github.io/pixograms/'>complete list of icons</a>)
                <ul>
                    <li>Within the autocomplete, select with your arrow keys <code>↑</code> or <code>↓</code> and hit <code>return</code> to insert it</li>
                    <li>If you ignore the autocomplete and keep typing, just press <code>space</code> to insert the icon</li>
                </ul>
            </li>
            <li>Split the score with the <a href="#" class="btn btn-tools tool-split" title="split score"><img src='{{ site.baseurl }}/img/tool_split.svg'></a> button to declare a different section or screen. You can name the new section in the textarea that appears on top</li>
            <li>For adding a new step in your score, just press <code>tab</code> and a new column (or step) will be added at the end, or the click on the <a href="#" class="btn btn-tools tool-add" title="add step"><img src='{{ site.baseurl }}/img/tool_add.svg'></a> button for inserting a new step wherever you need it</li>
            <li>For removing a step, just click on the <a href="#" class="btn btn-tools tool-remove" title="remove step"><img src='{{ site.baseurl }}/img/tool_remove.svg'></a> button</li>
        </ol>
    </div>   
</div>

<div class='row'>
    <div class="col-sm-12">
        <!-- {% include pix-example.html %} -->
    </div>
</div>

<hr>

<div class='row'>
    <div class='col-sm-8 col-sm-offset-2'>
        <h1>Downloads</h1>
        
        <h2>Icons</h2>
        <p>All icons are available as a separate package in the <a href='http://eadpucv.cgithub.io/pixograms' title='Pixograms Reposiroty'>Pixograms repository</a>.</p>
        
        <ol>
            <li><a href='http://eadpucv.github.io/pixograms/download/icons.zip'>Pixograms</a> in SVG format</li>
            <li><a href='http://eadpucv.github.io/pixograms/download/pix-webfont.zip'>Pixograms Webfont</a> (All icon names are ligatures)</li>
        </ol>
        
        <h2>Templates & Stencils</h2>
        
        <h3>Illustrator</h3>
        <ol>
            <li><a href='{{ site.baseurl }}/downloads/pix-template-en.ai'>PiX Template - English</a></li>
            <li><a href='{{ site.baseurl }}/downloads/pix-template-es.ai'>PiX Template - Español</a></li>
        </ol>
        <h3>Omnigraffle</h3>
        <ol>
            <li><strong><a href='{{ site.baseurl }}/downloads/pix-score.gtemplate'>PiX Score Template</a></strong></li>
            <li><a href='{{ site.baseurl }}/downloads/actions-objects.gstencil'>Action Objects</a></li>
            <li><a href='{{ site.baseurl }}/downloads/actions.gstencil'>Actions</a></li>
            <li><a href='{{ site.baseurl }}/downloads/arrows-playback.gstencil'>Playback Controls</a></li>
            <li><a href='{{ site.baseurl }}/downloads/arrows.gstencil'>Arrows</a></li>
            <li><a href='{{ site.baseurl }}/downloads/containers.gstencil'>Containers</a></li>
            <li><a href='{{ site.baseurl }}/downloads/devices.gstencil'>Devices</a></li>
            <li><a href='{{ site.baseurl }}/downloads/objects.gstencil'>Objects</a></li>
            <li><a href='{{ site.baseurl }}/downloads/score.gstencil'>Score</a></li>
            <li><a href='{{ site.baseurl }}/downloads/system.gstencil'>System</a></li>
            <li><a href='{{ site.baseurl }}/downloads/user-face.gstencil'>Expression Faces</a></li>
            <li><a href='{{ site.baseurl }}/downloads/user-gesture.gstencil'>Gestures</a></li>
        </ol>
    </div>
</div>

<hr>

<div class="row">
    <div class="col-sm-8 col-sm-offset-2">
        <h3>PiXograms</h3>

        <p>The Pixograms font family is designed specially for representing the actions, processes and objects involved in the flow of user experience. It works as a <a href='http://eadpucv.github.io/pixograms'>separate repository</a> and works as a dependency for PiX so its easier to maintain and upgrade.</p>

        <h4>All Icons</h4>
        <p>This textarea uses pixograms as the base font, so you can type the icon names and they'll appear as ligatures. <a href="http://eadpucv.github.io/pixograms">Check the original repository</a></p>

        <textarea class='pix pix-2x pix-demo' rows='7'>add alert angry api archive ask attach audio autocomplete body branch button buy call camera cancel check checkbox click clock cloud collapse color comment config contact contacts copy cut database date delete desktop deviceorient devicerotate deviceshake devicevibrate dialogue dislike doubleclick doubletap down download drag drop edit email empty expand export face ff file film filter furious gallery game hand hand1 hangup happy image import input intrigued kiosk left like link list lock logo map merge message mobile move next notebook notify page password paste pause pay person pinch play position prev print process progress qr radio radioselect range rec remove resize rew right rotate route rss sad save say scroll search select send share smiling speak stack stop surprised switch system tablet tag tap tap1down tap1left tap1right tap1up tap2 tap2down tap2left tap2right tap2up tap3 tap3down tap3left tap3right tap3up tap4 tap4down tap4left tap4right tap4up tap5down tap5left tap5right tap5up text think time tv unlink unlock up update upload video view window zoom </textarea>

        <h2>Meta</h2>
        <p>Score headers and meta icons.</p>
        <div class='row'>
        {% include col-pix.html name='logo' %}
        {% include col-pix.html name='person' %}
        {% include col-pix.html name='dialogue' %}
        {% include col-pix.html name='system' %}
        {% include col-pix.html name='empty' %}
        </div>

        <h3>Generic</h3>
        <p>Multipurpose</p>
        <div class='row'>
        {% include col-pix.html name='up' %}
        {% include col-pix.html name='down' %}
        {% include col-pix.html name='left' %}
        {% include col-pix.html name='right' %}
        </div>

        <h3>Devices</h3>
        <p>Devices serve to specify what kind of interaction is involved. It's the key to the score:</p>
        <div class='row'>
        {% include col-pix.html name='mobile' %}
        {% include col-pix.html name='tablet' %}
        {% include col-pix.html name='notebook' %}
        {% include col-pix.html name='desktop' %}
        {% include col-pix.html name='tv' %}
        {% include col-pix.html name='kiosk' %}
        {% include col-pix.html name='game' %}
        </div>
        <hr>

        <div class='row'>
            <div class='col-md-12'>
                <h1><i class='pix pix-4x pix-heading pull-left'>person</i> The person layer</h1>
                <p>This layer depicts the persons's intent and goals through the development of his/her mental model of the task at hand. It also shows the (expected) emotions involved in the overall experience, as well as high-level actions.</p>
            </div>
        </div>

        <h2>Emotions</h2>
        <div class='row'>
        {% include col-pix.html name='furious' %}
        {% include col-pix.html name='sad' %}
        {% include col-pix.html name='face' %}
        {% include col-pix.html name='intrigued' %}
        {% include col-pix.html name='surprised' %}
        {% include col-pix.html name='smiling' %}
        {% include col-pix.html name='happy' %}
        </div>

        <h2>Intent</h2>
        <div class='row'>
        {% include col-pix.html name='think' %}
        {% include col-pix.html name='say' %}
        {% include col-pix.html name='hand' %}
        {% include col-pix.html name='hand1' %}
        </div>

        <div class='row'>
            <div class='col-md-12'>
                <h1><i class='pix pix-4x pix-heading pull-left'>dialogue</i> The dialogue layer</h1>
                <p>This is the interface dialogue layer that represents the concrete actions happening on the interface: gestures, messages, actions; all direct manipulation of elements and constructs happening onstage.</p>
            </div>
        </div>

        <div class='row'>
        {% include col-pix.html name='send' %}
        {% include col-pix.html name='share' %}
        {% include col-pix.html name='speak' %}
        {% include col-pix.html name='comment' %}
        {% include col-pix.html name='attach' %}
        {% include col-pix.html name='config' %}
        {% include col-pix.html name='buy' %}
        {% include col-pix.html name='pay' %}
        {% include col-pix.html name='call' %}
        {% include col-pix.html name='hangup' %}
        </div>

        <div class='row'>
        {% include col-pix.html name='add' %}
        {% include col-pix.html name='remove' %}
        {% include col-pix.html name='alert' %}
        {% include col-pix.html name='ask' %}
        {% include col-pix.html name='check' %}
        {% include col-pix.html name='cancel' %}
        {% include col-pix.html name='say' %}
        {% include col-pix.html name='think' %}
        </div>

        <div class='row'>
        {% include col-pix.html name='edit' %}
        {% include col-pix.html name='save' %}
        {% include col-pix.html name='copy' %}
        {% include col-pix.html name='paste' %}
        {% include col-pix.html name='delete' %}
        </div>

        <div class='row'>
        {% include col-pix.html name='like' %}
        {% include col-pix.html name='dislike' %}
        {% include col-pix.html name='link' %}
        {% include col-pix.html name='unlink' %}
        {% include col-pix.html name='branch' %}
        {% include col-pix.html name='merge' %}
        {% include col-pix.html name='print' %}
        {% include col-pix.html name='view' %}
        </div>

        <hr>

        <h2>Objects</h2>
        <div class='row'>
        {% include col-pix.html name='file' %}
        {% include col-pix.html name='email' %}
        {% include col-pix.html name='archive' %}
        {% include col-pix.html name='stack' %}
        {% include col-pix.html name='image' %}
        {% include col-pix.html name='audio' %}
        {% include col-pix.html name='video' %}
        {% include col-pix.html name='contact' %}
        {% include col-pix.html name='contacts' %}
        {% include col-pix.html name='position' %}
        {% include col-pix.html name='map' %}
        {% include col-pix.html name='rss' %}
        </div>

        <div class='row'>
        {% include col-pix.html name='camera' %}
        {% include col-pix.html name='film' %}
        {% include col-pix.html name='clock' %}
        {% include col-pix.html name='date' %}
        {% include col-pix.html name='tag' %}
        </div>

        <h3>Device</h3>
        <div class='row'>
        {% include col-pix.html name='devicerotate' %}
        {% include col-pix.html name='deviceshake' %}
        {% include col-pix.html name='deviceorient' %}
        </div>

        <hr class='divider'>

        <h2>Interface Elements</h2>
        <div class='row'>
        {% include col-pix.html name='button' %}
        {% include col-pix.html name='checkbox' %}
        {% include col-pix.html name='input' %}
        {% include col-pix.html name='time' %}
        {% include col-pix.html name='select' %}
        {% include col-pix.html name='radio' %}
        {% include col-pix.html name='radioselect' %}
        {% include col-pix.html name='range' %}
        {% include col-pix.html name='switch' %}
        {% include col-pix.html name='move' %}
        {% include col-pix.html name='resize' %}
        </div>

        <h2>User Input</h2>
        <div class='row'>
        {% include col-pix.html name='click' %}
        {% include col-pix.html name='doubleclick' %}
        {% include col-pix.html name='drag' %}
        {% include col-pix.html name='drop' %}
        </div>

        <h3>Playback Controls</h3>
        <div class='row'>
        {% include col-pix.html name='prev' %}
        {% include col-pix.html name='play' %}
        {% include col-pix.html name='pause' %}
        {% include col-pix.html name='next' %}
        {% include col-pix.html name='ff' %}
        {% include col-pix.html name='rew' %}
        {% include col-pix.html name='stop' %}
        {% include col-pix.html name='rec' %}
        </div>

        <h3>Touch Gestures</h3>
        <div class='row'>

        {% include col-pix.html name='tap' %}
        {% include col-pix.html name='doubletap' %}
        {% include col-pix.html name='tap2' %}
        {% include col-pix.html name='tap3' %}
        {% include col-pix.html name='tap4' %}
        </div>

        <div class='row'>
        {% include col-pix.html name='tap1up' %}
        {% include col-pix.html name='tap2up' %}
        {% include col-pix.html name='tap3up' %}
        {% include col-pix.html name='tap4up' %}
        {% include col-pix.html name='tap5up' %}
        {% include col-pix.html name='tap1down' %}
        {% include col-pix.html name='tap2down' %}
        {% include col-pix.html name='tap3down' %}
        {% include col-pix.html name='tap4down' %}
        {% include col-pix.html name='tap5down' %}
        </div>

        <div class='row'>
        {% include col-pix.html name='tap1left' %}
        {% include col-pix.html name='tap2left' %}
        {% include col-pix.html name='tap3left' %}
        {% include col-pix.html name='tap4left' %}
        {% include col-pix.html name='tap5left' %}
        {% include col-pix.html name='tap1right' %}
        {% include col-pix.html name='tap2right' %}
        {% include col-pix.html name='tap3right' %}
        {% include col-pix.html name='tap4right' %}
        {% include col-pix.html name='tap5right' %}
        </div>

        <div class='row'>
        {% include col-pix.html name='collapse' %}
        {% include col-pix.html name='expand' %}
        {% include col-pix.html name='scroll' %}
        {% include col-pix.html name='zoom' %}
        {% include col-pix.html name='pinch' %}
        {% include col-pix.html name='rotate' %}
        </div>

        <hr>

        <div class='row'>
            <div class='col-md-12'>
                <h1><i class='pix pix-4x pix-heading pull-left'>system</i> The system layer</h1>
                <p>This is the system layer which shows what happens under the hood, what enables the service performance; all supporting actions and processes delivered to the person.</p>
            </div>
        </div>

        <h2>System</h2>
        <div class='row'>
        {% include col-pix.html name='cloud' %}
        {% include col-pix.html name='database' %}
        {% include col-pix.html name='filter' %}
        {% include col-pix.html name='search' %}
        {% include col-pix.html name='process' %}
        {% include col-pix.html name='import' %}
        {% include col-pix.html name='export' %}
        {% include col-pix.html name='upload' %}
        {% include col-pix.html name='download' %}
        {% include col-pix.html name='api' %}

        </div>

        <h3>System Feedback</h3>
        <div class='row'>
        {% include col-pix.html name='window' %}
        {% include col-pix.html name='page' %}
        {% include col-pix.html name='gallery' %}
        {% include col-pix.html name='list' %}
        {% include col-pix.html name='text' %}
        {% include col-pix.html name='progress' %}
        </div>
        <div class='row'>
        {% include col-pix.html name='update' %}
        {% include col-pix.html name='notify' %}
        {% include col-pix.html name='message' %}
        {% include col-pix.html name='lock' %}
        {% include col-pix.html name='unlock' %}
        </div>
    </div>
</div> 


