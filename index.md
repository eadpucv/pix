---
layout: base
title: PiX - Interaction Notation for UX Design
active: index
---

<h3>Why?</h3>

<p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. Donec non enim in turpis pulvinar facilisis. Ut felis. Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus</p>

<h3>How it Works</h3>

<p>The score is divided into three main layers:</p>

<div class='score'>
    <ul class='labels col-xs-2'>
        <li class='block block-user'><div class='pix-group'><i class='pix pix-4x pix-user'></i><label>user actions</label></div></li>
        <li class='block block-dialogue'><div class='pix-group'><i class='pix pix-4x pix-dialogue'></i><label>dialogues</label></div></li>
        <li class='block block-system'><div class='pix-group'><i class='pix pix-4x pix-gear'></i><label>system response</label></div></li>
    </ul>
    <ul class='step'>
        <li class='col-xs-10'>
            <ul>
                <li class='block block-user'><p class='center-vertical'>This is the user layer and depicts what the user wants to do, what has meaning to him/her, it's the task, the purpose </p></li>
                <li class='block block-dialogue'><p class='center-vertical'>This is the interface dialogue layer that represents the concrete actions happening on the interface, the gestures, the direct manipulation or the direct onstage contact.</p></li>
                <li class='block block-system'><p class='center-vertical'>This is the system layer, which shows what happens under the hood, what enables the service performance; all supporting actions and processes delivered to the user</p></li>
            </ul>
        </li>
    </ul>
</div>

<input class='score-header' placeholder='Name your score'>

<div class='score'>
     <ul class='labels col-xs-1'>
        <li class='block block-user'><div class='pix-group'><i class='pix pix-4x pix-user'></i><label>user actions</label></div></li>
        <li class='block block-dialogue'><div class='pix-group'><i class='pix pix-4x pix-dialogue'></i><label>dialogues</label></div></li>
        <li class='block block-system'><div class='pix-group'><i class='pix pix-4x pix-gear'></i><label>system response</label></div></li>
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
                            <i class='pix pix-ok pix-stack-1x'></i>
                            <i class='pix pix-think pix-stack-1x'></i>
                        </div>
                        <p>This is the same cloud with a stacked icon!</p>
                    </div>
                </li>
                <li class='block block-dialogue'>
                    <div class='pix-group'>
                        <div class='pix-stack'>
                            <i class='pix pix-touch-1 pix-stack-1x'></i>
                            <i class='pix pix-click pix-stack-1x'></i>
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
                            <i class='pix pix-question pix-stack-1x'></i>
                            <i class='pix pix-think pix-stack-1x'></i>
                        </div>
                        <p>Yet this is another one</p>
                    </div>
                </li>
                <li class='block block-dialogue'>
                    <div class='pix-group'>
                        <div class='pix-stack'>
                            <i class='pix pix-mouse pix-stack-1x'></i>
                            <i class='pix pix-mouse-left pix-stack-1x'></i>
                            <i class='pix pix-arrows-all pix-stack-1x'></i>
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
                            <i class='pix pix-mouse pix-stack-1x'></i>
                            <i class='pix pix-mouse-center pix-stack-1x'></i>
                            <i class='pix pix-arrows-vertical pix-stack-1x'></i>
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
                            <i class='pix pix-touch-pinch pix-stack-1x'></i>
                            <i class='pix pix-arrow-rotate pix-stack-1x'></i>
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
                            <i class='pix pix-keyboard pix-stack-1x'></i>
                            <i class='pix pix-arrows-keyboard pix-stack-1x'></i>
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
                            <i class='pix pix-touch-2 pix-stack-1x'></i>
                            <i class='pix pix-arrow-right pix-stack-1x'></i>
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
                            <i class='pix pix-touch-2 pix-stack-1x'></i>
                            <i class='pix pix-arrow-left pix-stack-1x'></i>
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
