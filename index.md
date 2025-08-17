---
layout: base
title: PiX - Interaction Notation for UX Design
active: index
lang: en
---

<div class='row'>
    <div class='col-sm-4 col-sm-offset-2'>
        <a class='btn btn-block btn-huge btn-app' href="{{ '/pages/app' | relative_url }}">PiX app</a>
    </div>
    <div class='col-sm-4'>
        <a class='btn btn-block btn-huge btn-toolkit'
            href="{{ '/downloads/pix-toolkit.pdf' | relative_url }}">Toolkit</a>
    </div>
</div>

<hr>

<div class='row'>
    <div class='col-sm-8 col-sm-offset-2'>
        <p><strong>PiX is a visual language, originating in Chile in 2008, specifically engineered to represent and
            model interactions and user experience within digital services. Its fundamental purpose is to
            serve as a common, pictogram-based language that integrates the multiple disciplines inherent in UX work,
            thereby streamlining creative, design, and co-creation processes.</strong></p>
        <p>A central challenge in design communication is that our design <em>>is a dialogue that unfolds in time</em> but we
            lack the language to represent it properly and across all disciplines involved in the project. PiX directly
            addresses this by offering a structured, temporal notation system. This system captures the sequential flow,
            the qualitative aspects of the experience, and the emotional journey of the user, effectively moving beyond
            static design snapshots. By providing a coherent representation of interaction over time, PiX significantly
            reduces the reliance on extensive supplementary explanations, ensuring that the proposed experience is
            clearly understood across all project stakeholders.</p>
        <p>The strength of PiX is further amplified by its capacity to foster interdisciplinary collaboration and
            co-design. Its accessible pictogram-based language renders it universally understandable, facilitating
            effective communication among designers, developers, business strategists, and end-users. This is
            particularly valuable in co-design contexts, where diverse perspectives are crucial. PiX transcends mere notation; it
            operates as a generative and inclusive framework, making it an ideal instrument for co-design workshops
            where individuals from varied backgrounds can contribute meaningfully to the design process.</p>
    </div>
</div>

<div class='row'>
    <div class='col-sm-8 col-sm-offset-2'>
        <h3>How it works</h3>
        <p>The score is divided into three layers: The user layer, the interaction layer and the service (or system) layer.</p>
        <h2>The Score</h2>
        <table class='table pix-table'>
            <tr>
                <th style='width: 20%'>
                    <i class='pix pix-person'></i><br>
                    <label>person</label>
                </th>
                <td style='width: 40%'>
                    <p>This layer depicts the persons's intent and goals through the development of his/her mental model
                        of the task at hand. It also shows the (expected) emotions involved in the overall experience.
                    </p>
                </td>
            </tr>
            <tr>
                <th style='width: 20%'>
                    <i class='pix pix-dialogue'></i><br>
                    <label>dialogue</label>
                </th>
                <td style='width: 40%'>
                    <p>This is the interface dialogue layer that represents the concrete actions happening on the
                        interface: gestures, messages, actions; all direct manipulation of elements and constructs
                        happening onstage.</p>
                </td>
            </tr>
            <tr>
                <th style='width: 20%'>
                    <i class='pix pix-system'></i><br>
                    <label>system</label>
                </th>
                <td style='width: 40%'>
                    <p>This is the system layer which shows what happens under the hood, what enables the service
                        performance; all supporting actions and processes delivered to the person.</p>
                </td>
            </tr>
        </table>
    </div>
</div>

<hr>

<h1 id="docs">Some Examples</h1>

<div class="col-sm-12">{% include example-creation-tutorial.html %}</div>
<div class="col-sm-12">{% include example-gmail-desktop.html %}</div> 

<hr>

<div class='row'>
    <div class="col-sm-offset-2 col-sm-8">
        <h3 id="docs">How to create a PiX</h3>
        <ol>
            <li>Open the <a href='{{ site.baseurl }}/pages/app'>App</a></li>
            <li>Name your PiX and add a description</li>
            <li>Type inside each PiX cell, for adding an icon, just type <code>pix-</code> plus the icon name you wish
                to insert (check the <a href='http://eadpucv.github.io/pixograms/'>complete list of icons</a>)
                <ul>
                    <li>Within the autocomplete, select with your arrow keys <code>↑</code> or <code>↓</code> and hit
                        <code>return</code> to insert it</li>
                    <li>If you ignore the autocomplete and keep typing, just press <code>space</code> to insert the icon
                    </li>
                </ul>
            </li>
            <li>Split the score with the <a href="#" class="btn btn-tools tool-split" title="split score"><img
                        src='{{ site.baseurl }}/img/tool_split.svg'></a> button to declare a different section or
                screen. You can name the new section in the textarea that appears on top</li>
            <li>For adding a new step in your score, just press <code>tab</code> and a new column (or step) will be
                added at the end, or the click on the <a href="#" class="btn btn-tools tool-add" title="add step"><img
                        src='{{ site.baseurl }}/img/tool_add.svg'></a> button for inserting a new step wherever you need
                it</li>
            <li>For removing a step, just click on the <a href="#" class="btn btn-tools tool-remove"
                    title="remove step"><img src='{{ site.baseurl }}/img/tool_remove.svg'></a> button</li>
        </ol>
    </div>
</div>

<hr>

<div class='row'>
    <div class='col-sm-8 col-sm-offset-2'>
        <h1>Resources</h1>
        <ul>
            <li><a href='https://miro.com/miroverse/pix-collab/?social=copy-link'>PiX Collab - Miro Template</a></li>
            <li><a href='https://www.figma.com/community/file/1300964617569076797/pix-partituras-de-interaccion'>PiX for Figma</a></li>
        </ul>
        <h1>Downloads</h1>
        <h2>Icons</h2>
        <p>All icons are available as a separate package in the <a href='http://eadpucv.cgithub.io/pixograms'
                title='Pixograms Reposiroty'>Pixograms repository</a>.</p>
        <ol>
            <li><a href='http://eadpucv.github.io/pixograms/download/icons.zip'>Pixograms</a> in SVG format</li>
            <li><a href='http://eadpucv.github.io/pixograms/download/pix-webfont.zip'>Pixograms Webfont</a> (All icon
                names are ligatures)</li>
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

<div class='row'>
    <div class='col-sm-8 col-sm-offset-2'>
        <h2>Features</h2>
        <ol>
            <li><strong>Streamlined Workflow for Rapid Prototyping and Documentation</strong>. Insert icons efficiently
                while typing with <code>pix-iconName</code> and <code>TAB</code> to jump or create the next slot. This
                feature is designed to accelerate your design process.</li>
            <li><strong>Save your work</strong> by storing or restoring your browser session, ensuring continuity and
                easy access to your projects.</li>
            <li><strong>Import and export</strong> your PiX in JSON format, facilitating version control and seamless
                integration with other tools.</li>
            <li><strong>PDF output</strong> for creating great design deliverables, perfect for presentations, client
                reviews, and archival purposes.</li>
            <li><strong>2 Templates</strong> you can choose from: a 3-layered PiX score for general interaction design
                or a 5-layered service blueprint score for broader service design contexts.</li>
        </ol>
    </div>
</div>

<hr>

<div class='row'>
    <div class="col-sm-offset-2 col-sm-8">
        <h3>PiX: Evolution and contributions over the uears</h3>
        <p>PiX is a visual notation developed at the School of Architecture and Design (Interaction Design program, PUCV). It began as undergraduate theses and expanded through research projects and peer-reviewed publications. Over time, it has been refined by students and academics, and applied professionally. The table below summarizes this journey with direct links to each contribution.
        </p>
        <table class="table pix-table">
      <thead>
        <tr>
          <th>Year</th>
          <th>Type</th>
          <th>Title / Link</th>
          <th>Contributors</th>
        </tr>
      </thead>
      <tbody>
        <!-- 2008 -->
        <tr>
          <td>2008</td>
          <td>Undergrad Thesis</td>
          <td><a href="https://wiki.ead.pucv.cl/Bit%C3%A1cora_Colectiva_de_Traves%C3%ADas_Amereida">Bitácora Colectiva de Travesías Amereida</a></td>
          <td>Katherine Exss, Estefanía Trisotti</td>
        </tr>
        <tr>
          <td>2008</td>
          <td>Chapter (Thesis)</td>
          <td><a href="https://wiki.ead.pucv.cl/images/7/72/Exss-partituras-de-interaccion.pdf">Interaction Scores: Toward a Unified Representation (PDF)</a></td>
          <td>Katherine Exss, Estefanía Trisotti</td>
        </tr>
        <!-- 2009 -->
        <tr>
          <td>2009</td>
          <td>Undergrad Thesis</td>
          <td><a href="https://wiki.ead.pucv.cl/AURA:_Web_Sem%C3%A1ntica_para_Archivos_Patrimoniales">AURA: Semantic Web for Heritage Archives</a></td>
          <td>Nicole Dupré, Javiera González, Esteban Saavedra</td>
        </tr>
        <!-- 2014 -->
        <tr>
          <td>2014</td>
          <td>Undergrad Thesis</td>
          <td><a href="https://wiki.ead.pucv.cl/PiXograms">PiXograms</a></td>
          <td>Melany Marín, Ingrid Céspedes</td>
        </tr>
        <tr>
          <td>2014</td>
          <td>Research Project</td>
          <td><a href="https://wiki.ead.pucv.cl/Redise%C3%B1o_de_las_Partituras_de_Interacci%C3%B3n:_Formalizaci%C3%B3n_de_un_Lenguaje_para_la_Industria_de_Dise%C3%B1o_UX">Redesign of Interaction Scores: Formalizing a Language for UX Design</a></td>
          <td>Herbert Spencer, Katherine Exss</td>
        </tr>
        <!-- 2015 -->
        <tr>
          <td>2015</td>
          <td>Research Project</td>
          <td><a href="https://wiki.ead.pucv.cl/Las_partituras_de_Interacci%C3%B3n_como_herramientas_de_dise%C3%B1o_para_la_modelaci%C3%B3n_de_valor_en_nuevos_servicios_digitales">Interaction Scores as Design Tools for Modeling Value in Digital Services</a></td>
          <td>Herbert Spencer, Katherine Exss</td>
        </tr>
        <!-- 2020 – multiple contributions -->
        <tr>
          <td>2020</td>
          <td>Undergrad Thesis</td>
          <td><a href="https://wiki.ead.pucv.cl/PiX_como_lenguaje_y_m%C3%A9todo_accesible_para_el_codise%C3%B1o">PiX as an Accessible Language & Method for Co-design</a></td>
          <td>Rosario Muñoz, Alejandra Alcavil</td>
        </tr>
        <tr>
          <td>2020</td>
          <td>Research Project</td>
          <td><a href="https://wiki.ead.pucv.cl/Partituras_de_Interacci%C3%B3n_PiX_como_lenguaje_y_m%C3%A9todo_accesible_para_el_co-dise%C3%B1o">PiX Scores: Language & Method for Co-design</a></td>
          <td>Katherine Exss</td>
        </tr>
        <tr>
          <td>2020</td>
          <td>Interdisciplinary Undergraduate Research</td>
          <td><a href="https://wiki.ead.pucv.cl/Proyecto:_PiX_como_lenguaje_y_m%C3%A9todo_accesible_para_el_codise%C3%B1o">PiX as Accessible Language & Method for Co-design</a></td>
          <td>Katherine Exss, Herbert Spencer, Vanessa Vega</td>
        </tr>
        <tr>
          <td>2020</td>
          <td>Academic Article</td>
          <td><a href="https://actoyforma.pucv.cl/index.php/ayf/article/view/103">Bad Practices in UX Design: Dark Interaction Patterns</a></td>
          <td>Katherine Exss, Catalina Pérez, Herbert Spencer</td>
        </tr>
        <!-- 2022 -->
        <tr>
          <td>2022</td>
          <td>Master’s Thesis</td>
          <td><a href="https://wiki.ead.pucv.cl/Narrativas_iconogr%C3%A1ficas%3A_un_lenguaje_para_la_facilitaci%C3%B3n_de_la_escritura_narrativa">Iconographic Narratives: A Language for Narrative Writing</a></td>
          <td>Rosario Muñoz</td>
        </tr>
        <!-- 2024 -->
        <tr>
          <td>2024</td>
          <td>Academic Article</td>
          <td><a href="https://revista180.udp.cl/index.php/revista180/article/view/1333">Toolkits for Accessible Participation: PiX as a Universal Co-design Tool</a></td>
          <td>Katherine Exss, Herbert Spencer, Vanessa Vega C., Marcela Jarpa, Izaskun Álvarez-Aguado, Rosario Muñoz, Alejandra Alcavil</td>
        </tr>
      </tbody>
    </table>

    </div>
</div>

<hr>

<div class="row">
    <div class="col-sm-8 col-sm-offset-2">
        <h3>PiXograms</h3>

        <p>The Pixograms font family is designed specially for representing the actions, processes and objects involved
            in the flow of user experience. It works as a <a href='http://eadpucv.github.io/pixograms'>separate
                repository</a> and works as a dependency for PiX so its easier to maintain and upgrade.</p>

        <h4>All Icons</h4>
        <p>This textarea uses pixograms as the base font, so you can type the icon names and they'll appear as
            ligatures. <a href="http://eadpucv.github.io/pixograms">Check the original repository</a></p>

        <textarea class='pix pix-2x pix-demo'
            rows='7'>add alert angry api archive ask attach audio autocomplete body branch button buy call camera cancel check checkbox click clock cloud collapse color comment config contact contacts copy cut database date delete desktop deviceorient devicerotate deviceshake devicevibrate dialogue dislike doubleclick doubletap down download drag drop edit email empty expand export face ff file film filter furious gallery game hand hand1 hangup happy image import input intrigued kiosk left like link list lock logo map merge message mobile move next notebook notify page password paste pause pay person pinch play position prev print process progress qr radio radioselect range rec remove resize rew right rotate route rss sad save say scroll search select send share smiling speak stack stop surprised switch system tablet tag tap tap1down tap1left tap1right tap1up tap2 tap2down tap2left tap2right tap2up tap3 tap3down tap3left tap3right tap3up tap4 tap4down tap4left tap4right tap4up tap5down tap5left tap5right tap5up text think time tv unlink unlock up update upload video view window zoom </textarea>

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
            {% include col-pix.html name='body' %}
        </div>
        <hr>

        <div class='row'>
            <div class='col-md-12'>
                <h1><i class='pix pix-4x pix-heading pull-left'>person</i> The person layer</h1>
                <p>This layer depicts the persons's intent and goals through the development of his/her mental model of
                    the task at hand. It also shows the (expected) emotions involved in the overall experience, as well
                    as high-level actions.</p>
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
                <p>This is the interface dialogue layer that represents the concrete actions happening on the interface:
                    gestures, messages, actions; all direct manipulation of elements and constructs happening onstage.
                </p>
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
                <p>This is the system layer which shows what happens under the hood, what enables the service
                    performance; all supporting actions and processes delivered to the person.</p>
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
