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
        <li class='block block-user'><div class='group'><i class='icn icn-4x icn-user'></i><label>user actions</label></div></li>
        <li class='block block-dialogue'><div class='group'><i class='icn icn-4x icn-dialogue'></i><label>dialogues</label></div></li>
        <li class='block block-system'><div class='group'><i class='icn icn-4x icn-gear'></i><label>system response</label></div></li>
    </ul>
    <ul>
        <li class='step col-xs-10'>
            <ul>
                <li class='block block-user'><p>This is the user layer and depicts what the user wants to do, what has meaning to him/her, it's the task, the purpose </p></li>
                <li class='block block-dialogue'><p>This is the interface dialogue layer that represents the concrete actions happening on the interface, the gestures, the direct manipulation or the direct onstage contact.</p></li>
                <li class='block block-system'><p>This is the system layer, which shows what happens under the hood, what enables the service performance; all supporting actions and processes delivered to the user</p></li>
            </ul>
        </li>
    </ul>
</div>

<input class='score-header' placeholder='Name your score'>
<div class='score'>
    <div class='labels col-sm-1'>
        <div class='block block-user'><i class='icn icn-4x icn-user'></i><label>user actions</label></div>
        <div class='block block-dialogue'><i class='icn icn-4x icn-dialogue'></i><label>dialogues</label></div>
        <div class='block block-system'><i class='icn icn-4x icn-gear'></i><label>system response</label></div>
    </div>
    <ul>
        <li class='step col-sm-1'>
            <ul>
                <li class='block block-user'><input type='text' tabindex='1' placeholder='type here...'></li>
                <li class='block block-dialogue'><input type='text' tabindex='2' placeholder='type here...'></li>
                <li class='block block-system'><input type='text' tabindex='3' placeholder='type here...'></li>
            </ul>
        </li>
        <li class='step col-sm-1'>
            <ul>
                <li class='block block-user'><input type='text' tabindex='4' placeholder='type here...'></li>
                <li class='block block-dialogue'><input type='text' tabindex='5' placeholder='type here...'></li>
                <li class='block block-system'><input type='text' tabindex='6' placeholder='type here...'></li>
            </ul>
        </li>
        <li class='step col-sm-1'>
            <ul>
                <li class='block block-user'><input type='text' tabindex='7' placeholder='type here...'></li>
                <li class='block block-dialogue'><input type='text' tabindex='8' placeholder='type here...'></li>
                <li class='block block-system'><input type='text' tabindex='9' placeholder='type here...'></li>
            </ul>
        </li>
        <li class='step col-sm-1'>
            <ul>
                <li class='block block-user'><input type='text' tabindex='10' placeholder='type here...'></li>
                <li class='block block-dialogue'><input type='text' tabindex='11' placeholder='type here...'></li>
                <li class='block block-system'><input type='text' tabindex='12' placeholder='type here...'></li>
            </ul>
        </li>    
        <li class='step col-sm-1'>
            <ul>
                <li class='block block-user'><input type='text' tabindex='13' placeholder='type here...'></li>
                <li class='block block-dialogue'><input type='text' tabindex='14' placeholder='type here...'></li>
                <li class='block block-system'><input type='text' tabindex='15' placeholder='type here...'></li>
            </ul>
        </li>
    </ul>
</div>

<button class='btn btn-primary'>Add other score</button>
