---
layout: base
title: PiX - Interaction Notation for UX Design
active: index
---

<div class='row'>
    <div lang='en' class='col-sm-6'>
        <div class='inner left'>
            <h3>Why?</h3>
            <p>We need a design deliverable that can encapsule the flow of interaction, the quality of the experience we're proposing to the user, to our teamembers and to the business.</p>
            
            <p>Most of the documents we hand out to our colleagues and clients represent snapshots of the experience flow, and we expect them to imagine the rest, to connect the dots with their imagination. It usually requires other material explanations —such as customer journeys, video sketches with personas, scenarios and the line— to give the idea of what we really want to be happening with our design. This is mainly because our design <strong>encompasses the flow of time</strong> but we lack the language to represent it properly and across all disciplines involved in the project.</p>
        </div>
    </div>
    <div lang='es' class='col-sm-6'>
        <div class='inner right'>
            <h3>¿Por Qué?</h3>
            <p>Necesitamos un entregable que permita encapsular el flujo de interacción, la cualidad y calidad de la experiencia que proponemos al usuario, a nuestros colegas y a nuestros clientes. </p>

            <p>La gran mayoría de los documentos que entregamos son imágenes estáticas del flujo de experiencia, y esperamos que ellos lo imaginen en su cabeza. Normalmente se requeriere de otras explicaciones —videos, infografías, personas y escenarios, etc— para dar la idea de lo que realmente proponemos y queremos que ocurra. Esto se debe principalmente a que nuestro diseño <strong>incolucra el flujo del tiempo</strong> pero carecemos de un lenguaje que permita representarlo de forma adecuada y legible para todas las disciplinas involucradas en el proyecto.</p>
        </div>
    </div>
</div>

<div class='row'>
    <div lang='en' class='col-sm-6'>
        <div class='inner left'>
            <h3>How it works</h3>
            <p>The score is divided into three layers:</p>
            <ol>
                <li>The user layer</li>
                <li>The interaction layer</li>
                <li>The service layer</li>
            </ol>
        </div>
    </div>
    <div lang='es' class='col-sm-6'>
        <div class='inner right'>
            <h3>Cómo funciona</h3>
            <p>La partitura está dividida en tres capas:</p>
            <ol>
                <li>La capa del usuario</li>
                <li>La capa de la interacción</li>
                <li>La capa del servicio</li>
            </ol>
        </div>
    </div>
</div>

<h2>The Score</h2>
<div class='pix-score'>
    <ul class='pix-header col-xs-2'>
        <li class='block block-user'><div class='pix-group'><i class='pix pix-4x pix-user'></i><label>user actions</label></div></li>
        <li class='block block-dialogue'><div class='pix-group'><i class='pix pix-4x pix-interaction'></i><label>dialogues</label></div></li>
        <li class='block block-system'><div class='pix-group'><i class='pix pix-4x pix-robot'></i><label>system response</label></div></li>
    </ul>
    <ul class='pix-steps'>
        <li class='pix-step col-xs-10'>
            <ul class='pix-blocks'>
                <li class='block block-user'><p class='score-text'>This is the user layer and depicts what the user wants to do, what has meaning to him/her, it's the task, the purpose </p></li>
                <li class='block block-dialogue'><p class='score-text'>This is the interface dialogue layer that represents the concrete actions happening on the interface, the gestures, the direct manipulation or the direct onstage contact.</p></li>
                <li class='block block-system'><p class='score-text'>This is the system layer, which shows what happens under the hood, what enables the service performance; all supporting actions and processes delivered to the user</p></li>
            </ul>
        </li>
    </ul>
</div>

<input class='score-header' placeholder='Name your score'>

<div class='score'>
     <ul class='pix-header col-xs-1'>
        <li class='block block-user'><div class='pix-group'><i class='pix pix-4x pix-user'></i><label>user actions</label></div></li>
        <li class='block block-dialogue'><div class='pix-group'><i class='pix pix-4x pix-refresh'></i><label>dialogues</label></div></li>
        <li class='block block-system'><div class='pix-group'><i class='pix pix-4x pix-database'></i><label>system response</label></div></li>
    </ul>
    <ul class='step'>
        <li class='col-sm-1'>
            <ul>
                <li class='block block-user'>
                    <div class='pix-group'>
                        <i class='pix pix-think'></i>
                        <p>The user wants to do something</p>
                    </div>
                </li>
                <li class='block block-dialogue'>
                    <div class='pix-group'>
                        <i class='pix pix-touch-1'></i>
                        <p>press the button</p>
                    </div>
                </li>
                <li class='block block-system'>
                    <div class='pix-group'>
                        <i class='pix pix-reload'></i>
                        <p>The screen is updated</p>
                    </div>
                </li>
            </ul>
        </li>
        <li class='col-sm-1'>
            <ul>
                <li class='block block-user'>
                    <div class='pix-group'>
                        <div class='pix-stack'>
                            <i class='pix pix-ok'></i>
                            <i class='pix pix-think'></i>
                        </div>
                        <p>This is the same cloud with a stacked icon!</p>
                    </div>
                </li>
                <li class='block block-dialogue'>
                    <div class='pix-group'>
                        <div class='pix-stack'>
                            <i class='pix pix-touch-1'></i>
                            <i class='pix pix-click stack-upper-left'></i>
                        </div>
                        <p>This is an stacked icon!</p>
                    </div>
                </li>
                <li class='block block-system'><input type='text' tabindex='6' placeholder='type here...'></li>
            </ul>
        </li>
        <li class='col-sm-1'>
            <ul>
                <li class='block block-user'>
                    <div class='pix-group'>
                        <div class='pix-stack'>
                            <i class='pix pix-question'></i>
                            <i class='pix pix-think'></i>
                        </div>
                        <p>Yet this is another one</p>
                    </div>
                </li>
                <li class='block block-dialogue'>
                    <div class='pix-group'>
                        <div class='pix-stack'>
                            <i class='pix pix-mouse'></i>
                            <i class='pix pix-click-left'></i>
                            <i class='pix pix-arrows-move stack-upper-left'></i>
                        </div>
                        <p>This one has three stacked icons!</p>
                    </div>
                </li>
                <li class='block block-system'><input type='text' tabindex='9' placeholder='type here...'></li>
            </ul>
        </li>
        <li class='col-sm-1'>
            <ul>
                <li class='block block-user'><input type='text' tabindex='10' placeholder='type here...'></li>
                <li class='block block-dialogue'>
                    <div class='pix-group'>
                        <div class='pix-stack'>
                            <i class='pix pix-mouse'></i>
                            <i class='pix pix-click-center'></i>
                            <i class='pix pix-arrows-vertical stack-upper-left'></i>
                        </div>
                        <p>This one has three stacked icons!</p>
                    </div>
                </li>
                <li class='block block-system'><input type='text' tabindex='12' placeholder='type here...'></li>
            </ul>
        </li>    
        <li class='col-sm-1'>
            <ul>
                <li class='block block-user'><input type='text' tabindex='13' placeholder='type here...'></li>
                <li class='block block-dialogue'>
                    <div class='pix-group'>
                        <div class='pix-stack'>
                            <i class='pix pix-pinch'></i>
                            <i class='pix pix-arrow-rotate stack-upper-left'></i>
                        </div>
                        <p>rotate de picture</p>
                    </div>
                </li>
                <li class='block block-system'><input type='text' tabindex='15' placeholder='type here...'></li>
            </ul>
        </li>
        <li class='col-sm-1'>
            <ul>
                <li class='block block-user'><input type='text' tabindex='13' placeholder='type here...'></li>
                <li class='block block-dialogue'>
                    <div class='pix-group'>
                        <div class='pix-stack'>
                            <i class='pix pix-keyboard'></i>
                            <i class='pix pix-keyboard-arrows stack-upper-left'></i>
                        </div>
                        <p>use the arrow keys</p>
                    </div>
                </li>
                <li class='block block-system'><input type='text' tabindex='15' placeholder='type here...'></li>
            </ul>
        </li>
        <li class='col-sm-1'>
            <ul>
                <li class='block block-user'><input type='text' tabindex='13' placeholder='type here...'></li>
                <li class='block block-dialogue'>
                    <div class='pix-group'>
                        <div class='pix-stack'>
                            <i class='pix pix-touch-2'></i>
                            <i class='pix pix-arrow-right stack-upper-left'></i>
                        </div>
                        <p>swipe to advance</p>
                    </div>
                </li>
                <li class='block block-system'><input type='text' tabindex='15' placeholder='type here...'></li>
            </ul>
        </li>
        <li class='col-sm-1'>
            <ul>
                <li class='block block-user'><input type='text' tabindex='13' placeholder='type here...'></li>
                <li class='block block-dialogue'>
                    <div class='pix-group'>
                        <div class='pix-stack'>
                            <i class='pix pix-touch-2'></i>
                            <i class='pix pix-arrow-left stack-upper-left'></i>
                        </div>
                        <p>Oooops!</p>
                    </div>
                </li>
                <li class='block block-system'><input type='text' tabindex='15' placeholder='type here...'></li>
            </ul>
        </li>
        <li class='col-sm-1'>
            <ul>
                <li class='block block-user'><input type='text' tabindex='13' placeholder='type here...'></li>
                <li class='block block-dialogue'><input type='text' tabindex='14' placeholder='type here...'></li>
                <li class='block block-system'><input type='text' tabindex='15' placeholder='type here...'></li>
            </ul>
        </li>
        <li class='col-sm-1'>
            <ul>
                <li class='block block-user'><input type='text' tabindex='13' placeholder='type here...'></li>
                <li class='block block-dialogue'><input type='text' tabindex='14' placeholder='type here...'></li>
                <li class='block block-system'><input type='text' tabindex='15' placeholder='type here...'></li>
            </ul>
        </li>
        <li class='col-sm-1'>
            <ul>
                <li class='block block-user'><input type='text' tabindex='13' placeholder='type here...'></li>
                <li class='block block-dialogue'><input type='text' tabindex='14' placeholder='type here...'></li>
                <li class='block block-system'><input type='text' tabindex='15' placeholder='type here...'></li>
            </ul>
        </li>
    </ul>
</div>

<button class='btn btn-primary'>Add other score</button>
