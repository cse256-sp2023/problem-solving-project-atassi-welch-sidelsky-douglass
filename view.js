
const addCSS = css => document.head.appendChild(document.createElement("style")).innerHTML=css;
let stepsIndex = 0;
let infoIndex = -1;
const maxStep = 3;
function nextButton(){
    stepsIndex ++;
    slides();

}
function addListElement(text, ol){
    let li = document.createElement("li");
    li.textContent = text;
    ol.append(li);
}
function addListElement2(text, ul){
    let li = document.createElement("li");
    li.textContent = text;
    ul.appendChild(li);
}
function slides(){
    let innerDiv = $("#innerDiv");
    let title = $("#title");
    let ol = $("#OL");
    let subTitle = $("#subTitle");
    subTitle.empty();
    ol.empty();
    $("#titleDiv").css('justifyContent', stepsIndex == 0 ? 'center' : 'flex-start');
    const delayInMilliseconds = 1000;

    $("#mturk-top-banner-arrow").css('border', 'none');
    $(".permbutton").css('border', '1px solid #c5c5c5');
    $(".permbutton").css('backgroundColor', '#f6f6f6');
    $("#sidepanel").css('border', 'none');
    $("#subb").remove();


    innerDiv.css('justifyContent', 'flex-start');


    switch(stepsIndex){
        case 0:
            title.text("Step by step instructions:"); 
            innerDiv.css('justifyContent', 'center');
            
            break;
        case 1:
            title.text("1: Check the problem instructions:   ");
            subTitle.text('(Bottom right outlined in green)');
            addListElement('Identify the file(s) or folder to be modified', ol);
            addListElement('Identify the user(s) to be affected', ol);
            addListElement('Identify what the permissions should be set to ', ol);
            $("#mturk-top-banner-arrow").css('border', '5px solid greenyellow');
            setTimeout(function() {
                if(stepsIndex == 1){
                    $("#mturk-top-banner-arrow").css('border', 'none');
                    setTimeout(function() {
                        if(stepsIndex == 1){
                            $("#mturk-top-banner-arrow").css('border', 'none');
            
                            setTimeout(function() {
                                if(stepsIndex == 1){
                                    $("#mturk-top-banner-arrow").css('border', '5px solid greenyellow');
                                    $("#mturk-top-banner-arrow").click();
                                }
                            }, delayInMilliseconds);
                        }
                    }, delayInMilliseconds);
                }
                
    
            }, delayInMilliseconds);
            

            break;
        case 2:
            title.text('2: Click the permissions button to check permissions');
            addListElement('Select a user, (if you do not see the user as an option click "add")', ol);
            let img = document.createElement('img');
            img.src = './selectUser.png';
            img.style.width = '350px';
            img.style.height = 'auto';
            ol.first().append(img);
            addListElement('Find the current permissions indicated by checkmarks', ol);
            let img2 = document.createElement('img');
            img2.src = './viewPermissions.png';
            img2.style.width = '350px';
            img2.style.height = 'auto';
            ol.children().eq(2).append(img2);
            $('.permbutton').css('border', '5px solid greenyellow');
                setTimeout(function() {

                    $(".permbutton").css('backgroundColor', 'greenyellow');

                    if(stepsIndex == 2){
                    setTimeout(function() {

                        $(".permbutton").css('backgroundColor', '#f6f6f6');
                        if(stepsIndex == 2){

                        setTimeout(function() {

                            $(".permbutton").css('backgroundColor', 'greenyellow');
                            if(stepsIndex == 2){

                                setTimeout(function() {
                                    $(".permbutton").css('backgroundColor', '#f6f6f6');
                                }, delayInMilliseconds);
                            }
                            else{
                                $(".permbutton").css('backgroundColor', '#f6f6f6');
                            }

                        }, delayInMilliseconds);
                    }

                    }, delayInMilliseconds);
                }
                else{
                    $(".permbutton").css('backgroundColor', '#f6f6f6');
                }

                }, delayInMilliseconds);
            break;
        case 3:
            title.text('3: Effective permissions panel');
            let h3 = document.createElement('h5');
            h3.id='subb';
            h3.textContent = 'Shows you the effective/ actual permissions for a user including any inherited permissions';
            titleDiv.after(h3);
            // subTitle.text('Shows you the effective/ actual permissions for a user including any inherited permissions');
            $("#sidepanel").css('border', '3px solid greenyellow');
            addListElement('Click select user and select the user you want', ol);
            addListElement('Click select a file select the file you want', ol);
            addListElement('Now the panel will show check marks for all enabled permissions', ol);
            break
        default:
            break;
    }
}
function modifyPermission(){
    let divLeft = $(`<div>
                <h3 style="margin-top: 24px"><strong>Give / allow permissions</strong></h3>
                <ol style="margin-left: 24px">
                    <li>Click the <strong>permissions button</strong> for your given File</li>
                    <li>Select your user</li>
                    <li>Click a checkbox in the <strong>allow column</strong> to allow permissions for the user</li>
                    <li>This allow permission may be <strong>overriden</strong> if the adjacent deny box is also checked</li>
                   
                </ol>
                <h3 style="margin-top: 24px"><strong>Deny/ take away permission </strong></h3>
                <ol style="margin-left: 24px">
                    <li>Click the <strong>permissions button</strong> for your given File</li>
                    <li>Select your user</li>
                    <li>Click a checkbox in the <strong>deny column</strong> to deny permissions for the user</li>
                    <li>This will <strong>override</strong> the adjacent allow permission</li>
                </ol>
        </div>`);
    let divRight = $(`<div>
        <h3 style="margin-top: 24px"><strong>Can't find the permission im looking for</strong></h3>
        <p>Specific permissions are grouped under broader categories – click <strong>“permissions system”</strong> above for more info on permission groupings</p>
        <ul style="margin-left: 24px">
            <li>Click the <strong>permissions button</strong> for your given File</li>
            <li>Click the <strong>Advanced button</strong> for your given File</li>
            <li>Under the permissions tab click <strong>Edit...</strong></li>
            <li>Click <strong>Change...</strong></li>
            <li>Select your user</li>
            <li>Now you can modify the specific permissions just like you would normally as described left</li>
        </ul>
    </div>`);
    let div = $('<div></div>');
    div.append(divLeft);
    div.append(divRight);
    div.css('display', 'flex');
    div.css('flexFlow', 'row');
    div.css('gap', '24px');
    return div;

}
function addRemoveDiv(){
    let divLeft = $(`<div>
                <h3 style="margin-top: 24px"><strong>Adding users</strong></h3>
                <ol style="margin-left: 24px">
                    <li>Click the <strong>permissions button</strong> for your given File</li>
                    <li>Click <strong>Add</strong></li>
                    <li>Select your user and click "OK" to add your user</li>
                    <li>Now you can specify the permissions of your user for the given file/folder</li>
                   
                </ol>
                
        </div>`);
    let divRight = $(`<div>
        <h3 style="margin-top: 24px"><strong>Remove user</strong></h3>
        <ol style="margin-left: 24px">
            <li>Click the <strong>permissions button</strong> for your given File</li>
            <li>Select your user</li>
            <li>Click <strong>Remove</strong> </li>
            <li>If you get a warning that you cannot remove the user because of inherited permissions:</li>
            <ol style="list-style-type: lower-alpha; margin-left: 24px"> 
                <li>Click <strong>Advanced</strong> </li>
                <li>Under the permissions tab <strong>uncheck</strong> "Include inheritance permissions from this object’s parent"  </li>
                <li>Click <strong>Add</strong> to save the inherited permissions for other users, or remove to disregard them </li>
                <li>Now you can go back to the main panel and <strong>Click Remove</strong> to remove your user</li>
            </ol>

        </ol>
    </div>`);
    let div = $('<div></div>');
    div.append(divLeft);
    div.append(divRight);
    div.css('display', 'flex');
    div.css('flexFlow', 'row');
    div.css('gap', '24px');
    return div;

}
function steps(){
    let outerDiv = document.createElement('div');
    let prev = document.createElement('button');
    prev.textContent = "Previous";
    prev.style.alignSelf = 'center';

    let next = document.createElement('button');
    next.textContent = "Next";
    next.style.alignSelf = 'center';
    let innerDiv = document.createElement('div');
    innerDiv.id = 'innerDiv';

    next.addEventListener('click', function(){
       stepsIndex ++;
       if(stepsIndex == maxStep){
        next.disabled = true;
       }
       if(stepsIndex > 0){
        prev.disabled = false;
       }
       slides();
    }, false);
    prev.addEventListener('click', function(){
        stepsIndex --;
        if(stepsIndex == 0){
         prev.disabled = true;
        }
        if(stepsIndex < maxStep){
         next.disabled = false;
        }
        slides();
     }, false);
    let title = document.createElement("h3");
    
    title.textContent = "Step by step instructions:";
    title.id = 'title';
    title.style.textAlign = 'center';
    title.style.alignSelf = 'center';
    let titleDiv = document.createElement('div');
    titleDiv.style.display = 'flex';
    titleDiv.style.gap = '6px';
    titleDiv.id = 'titleDiv';
    titleDiv.appendChild(title);
    titleDiv.style.justifyContent = 'center';
    let subTitle = document.createElement('h6');
    subTitle.id = 'subTitle';
    subTitle.style.alignSelf = 'center';
    titleDiv.appendChild(subTitle);
    innerDiv.appendChild(titleDiv);
    let ol = document.createElement('ol');
    ol.id = "OL";
    ol.style.margin = '12px';
    ol.style.paddingLeft = '24px';
    ol.style.listStyleType = 'lower-alpha';
    innerDiv.appendChild(ol);


    outerDiv.append(prev);
    outerDiv.append(innerDiv);
    outerDiv.append(next);
    outerDiv.style.display = 'flex';
    outerDiv.style.gap = '18px';
    innerDiv.style.height = '300px';
    innerDiv.style.width = '500px';
    innerDiv.style.border = '1px solid black';
    innerDiv.style.borderRadius = '24px';
    innerDiv.style.marginTop = '24px';
    innerDiv.style.display = 'flex';
    innerDiv.style.justifyContent = 'center';
    innerDiv.style.flexFlow = 'column';

    innerDiv.style.padding = '12px';
    outerDiv.style.justifyContent = 'center';
    if(stepsIndex == 0){
        prev.disabled = true;
    }
    return outerDiv;
}
function getInfo(){
    let div = document.createElement('div');
    div.style.margin = '24px';
    let h1 = document.createElement('h1');
    h1.textContent = 'Info: '
    let buttonsDiv = document.createElement('div');
    div.appendChild(buttonsDiv);
    buttonsDiv.appendChild(h1);
    buttonsDiv.style.display = 'flex';
    buttonsDiv.style.flexFlow = 'row';
    buttonsDiv.style.gap = '24px';
    let buttonsInnerDiv = document.createElement('div');
    buttonsInnerDiv.style.display = 'flex';
    buttonsInnerDiv.style.flexFlow = 'row';
    buttonsInnerDiv.style.gap = '12px';
    buttonsInnerDiv.style.alignItems = 'center';
    buttonsDiv.appendChild(buttonsInnerDiv)


    let permissionButton = document.createElement('button');
    permissionButton.textContent = "Permissions system";
    let modifyButton = document.createElement('button');
    modifyButton.textContent = "Modifying permissions";
    let basics = document.createElement('button');
    basics.textContent = 'Interface basics';
    let addRemove = document.createElement('button');
    addRemove.textContent = 'Add/ Remove users';

    buttonsInnerDiv.appendChild(basics);
    buttonsInnerDiv.appendChild(permissionButton);
    buttonsInnerDiv.appendChild(modifyButton);
    buttonsInnerDiv.appendChild(addRemove);
    let displayInfo = document.createElement('div');
    displayInfo.id = 'displayInfo';
    div.appendChild(displayInfo);
    for (const child of buttonsInnerDiv.children) {
        child.style.padding = '12px';
        child.style.borderRadius = '100px'
        child.style.backgroundColor = 'white';
        child.style.border = '3px solid black';
    }
    displayInfo.appendChild(steps());
    infoIndex = 0;
    clickButton(basics, buttonsInnerDiv);

    basics.addEventListener('click', function(){
        if(infoIndex == 0){
            infoIndex = -1;
            basics.style.backgroundColor = 'white';
            displayInfo.innerHTML = '';
            stopAnimation();

        }
        else{
            infoIndex = 0;
            clickButton(basics, buttonsInnerDiv);
            displayInfo.innerHTML = '';
            displayInfo.appendChild(steps());
        }
        
    }, false);
    permissionButton.addEventListener('click', function(){
        if(infoIndex == 1){
            infoIndex = -1;
            permissionButton.style.backgroundColor = 'white';
            displayInfo.innerHTML = '';
        }
        else{
            infoIndex = 1;
            stopAnimation();
            clickButton(permissionButton, buttonsInnerDiv);
            displayInfo.appendChild(permissionInfo());
        }
        
    }, false);
    modifyButton.addEventListener('click', function(){
        if(infoIndex == 2){
            infoIndex = -1;
            modifyButton.style.backgroundColor = 'white';
            displayInfo.innerHTML = '';
        }
        else{
            infoIndex = 2;
            stopAnimation();
            clickButton(modifyButton, buttonsInnerDiv);
            $("#displayInfo").append(modifyPermission());
        }
    }, false);
    addRemove.addEventListener('click', function(){
        if(infoIndex == 3){
            infoIndex = -1;
            addRemove.style.backgroundColor = 'white';
            displayInfo.innerHTML = '';
        }
        else{
            infoIndex = 3;
            stopAnimation();
            clickButton(addRemove, buttonsInnerDiv);
            $("#displayInfo").append(addRemoveDiv());
        }
    }, false);
    
    return div;
}

function stopAnimation(){
    $("#mturk-top-banner-arrow").css('border', 'none');
            $(".permbutton").css('border', '1px solid #c5c5c5');
            $(".permbutton").css('backgroundColor', '#f6f6f6');
            $("#sidepanel").css('border', 'none');
            stepsIndex = 0;


}
function clickButton(button, parent){
    $("#displayInfo").empty();
    for (const child of parent.children) {
        child.style.backgroundColor = 'white';
    }
    button.style.backgroundColor = 'lightBlue';
}
function permissionInfo(){
    let d = document.createElement('div');
    d.style.padding = '32px';
    d.style.display = 'flex';
    d.style.flexFlow = 'row';
    d.style.gap = '48px';
    let leftD = document.createElement('div');

    let h1 = document.createElement('h3');
    h1.textContent = 'File Permissions explanation:';
    let ul = document.createElement('ul');
    ul.style.marginLeft = '24px';
    leftD.appendChild(h1);

    leftD.appendChild(ul);
    addListElement('Deny permissions take precedence over allow', ul);
    addListElement('Permissions for users and their groups have the same priority', ul);
    addListElement('Permissions can be inherited from parent folders', ul);
    addListElement('Permissions applied directly to a file/folder take precedence over inherited permissions', ul);
    let rightD = document.createElement('div');    
    let h5 = document.createElement('h4');
    h5.textContent = 'Permission types are grouped into these 5 categories:';
    rightD.appendChild(h5);
    let permissionsImg = document.createElement('img');
    permissionsImg.src = './permissionsChart.png';
    permissionsImg.style.height = '300px';
    permissionsImg.style.width = 'auto';
    rightD.appendChild(permissionsImg);
    d.appendChild(leftD);
    d.appendChild(rightD);
    return d;

}

$(document).ready(function () {

    let info = getInfo();
    document.getElementById('mturk-top-banner').after(info);

    // let stepsDiv = steps();
    // document.getElementById('mturk-top-banner').after(stepsDiv);
    // let infoDiv = document.createElement("div");
    // infoDiv.id = "infoDiv";
    // let infoButton = document.createElement("button");
    // infoButton.id = "infoButton";

    // infoButton.addEventListener("click", function(event){
    //     $(this).hide();
    //     $("#expandedInfo").show();
    // }, false);

    // infoButton.textContent = "File Permission Info";
    // infoDiv.append(infoButton);
    // document.body.append(infoDiv);
    
    // addCSS("#infoDiv{margin: auto; width: auto; bottom: 0; text-align: center;}");
    // addCSS("#infoButton{text-align: center; position: fixed; bottom: 0; padding: 6px;}");

   
    // const expandedInfo = document.createElement("div");
    // expandedInfo.style.margin = "auto";
    // expandedInfo.style.position = "relative";
    // expandedInfo.style.padding = "32px";
    // expandedInfo.style.backgroundColor = "lightgray";
    // expandedInfo.id = "expandedInfo";
    // expandedInfo.style.display = "none";

    // const butt = document.createElement("button");
    // butt.textContent = "X";
    // butt.style.position = "absolute";
    // butt.style.right = "6px";
    // butt.style.top = "6px";
    // butt.addEventListener("click", function(event){
    //     $("#expandedInfo").hide();
    //     $("#infoButton").show();
    // }, false);
    // expandedInfo.appendChild(butt);


    // const ol = document.createElement("ol");
    // ol.style.listStyleType = "decimal";

    
    // const li1 = document.createElement("li");
    // const li2 = document.createElement("ul");
    // li2.style.listStyleType = "lower-alpha";
    // li2.style.paddingLeft = "40px";


    // const a = document.createElement("li");
    // const b = document.createElement("li");
    // const li3 = document.createElement("li");
    
    // li1.textContent = "Look at all of the direct (i.e. not inherited) permissions that are set on this file for this user OR for any groups that this user is part of (e.g. administrators).";    ;
    // a.textContent = "If any of these are set to deny permission, then permission is denied.";
    // b.textContent = "Otherwise, if any of these are set to allow the permission, then the action is allowed to happen";
    // li3.textContent = "If (a) there were no direct permissions for this [user, action] combination, AND (b) inheritance is turned on for this file/folder, repeat the process using the permissions for the parent folder.";
    // li2.appendChild(a);
    // li2.appendChild(b);

    // ol.appendChild(li1);
    // ol.appendChild(li2);
    // ol.appendChild(li3);

    // expandedInfo.appendChild(ol);
    // document.body.appendChild(expandedInfo);
    

    function generateVisibleFilesList() {
        const visibleFiles = [];
    
        $('.permbutton').each(function () {
            const filePath = $(this).attr('path');
            const fileName = extractFileName(filePath); // Use extractFileName() to get the file name from the file path
            visibleFiles.push({ filePath, fileName });
        });
    
        console.log('Visible Files:', visibleFiles);
        return visibleFiles;
    }
    

    function extractFileName(filePath) {
        const parts = filePath.split('/');
        return parts[parts.length - 1];
    }
    
    

    function updateEpPanelFilePath(filePath) {
        $('#epPanel').attr('filepath', filePath);
    }

    function createFileSelectDropdown() {
        const visibleFiles = generateVisibleFilesList();
        const fileSelect = $('<select id="fileSelect"><option value="">Select a file</option></select>');

        visibleFiles.forEach(({ filePath, fileName }) => {
            fileSelect.append(`<option value="${filePath}">${fileName}</option>`);
        });

        fileSelect.on('change', function () {
            updateEpPanelFilePath($(this).val());
        });

        return fileSelect;
    }

    var epPanel = define_new_effective_permissions("epPanel", true);
    var userSField = define_new_user_select_field("userSField", "select user", function (selected_user) {
        $('#epPanel').attr('username', selected_user);
    });

    var newDialog = define_new_dialog("newDialog", title = '');
    var epPanelInstructions = $('<div style="padding-left: 12px"><h3 style="text-align: center">Effect Permissions: </h3> <p>Use the panel below to view file permissions for specific users. To test out, select a user and then select a file and the permissions they have will be displayed</p></div>');
    $('.perm_info').click(function () {
        newDialog.dialog('open');
        var p = $(this).attr('permission_name');
        var fp = $('#epPanel').attr('filepath');
        var un = $('#epPanel').attr('username');
        var f = path_to_file[fp];
        var u = all_users[un];
        console.log("Username:" + un);
        console.log("file path:" + fp);
        console.log("permission: " + p);
        var explanation = get_explanation_text(allow_user_action(f, u, p, true));
        newDialog.text(explanation);
    });

// (recursively) makes and returns an html element (wrapped in a jquery object) for a given file object
function make_file_element(file_obj) {
    let file_hash = get_full_path(file_obj)

    if(file_obj.is_folder) {
        let folder_elem = $(`<div class='folder' id="${file_hash}_div">
            <h3 id="${file_hash}_header">
                <span class="oi oi-folder" id="${file_hash}_icon"/> ${file_obj.filename} 
                <button class="ui-button ui-widget ui-corner-all permbutton" path="${file_hash}" id="${file_hash}_permbutton"> 
                    Permissions
                    <span class="oi oi-lock-unlocked" id="${file_hash}_permicon"/> 
                </button>
            </h3>
        </div>`)

        // append children, if any:
        if( file_hash in parent_to_children) {
            let container_elem = $("<div class='folder_contents'></div>")
            folder_elem.append(container_elem)
            for(child_file of parent_to_children[file_hash]) {
                let child_elem = make_file_element(child_file)
                container_elem.append(child_elem)
            }
        }
        return folder_elem
    }
    else {
        return $(`<div class='file'  id="${file_hash}_div">
            <span class="oi oi-file" id="${file_hash}_icon"/> ${file_obj.filename}
            <button class="ui-button ui-widget ui-corner-all permbutton" path="${file_hash}" id="${file_hash}_permbutton"> 
                Permissions
                <span class="oi oi-lock-unlocked" id="${file_hash}_permicon"/> 
            </button>
        </div>`)
    }
}

for(let root_file of root_files) {
    let file_elem = make_file_element(root_file)
    $( "#filestructure" ).append( file_elem);    
}



// make folder hierarchy into an accordion structure
$('.folder').accordion({
    collapsible: true,
    heightStyle: 'content'
}) // TODO: start collapsed and check whether read permission exists before expanding?


// -- Connect File Structure lock buttons to the permission dialog --

// open permissions dialog when a permission button is clicked
$('.permbutton').click( function( e ) {
    // Set the path and open dialog:
    let path = e.currentTarget.getAttribute('path');
    perm_dialog.attr('filepath', path)
    perm_dialog.dialog('open')
    //open_permissions_dialog(path)

    // Deal with the fact that folders try to collapse/expand when you click on their permissions button:
    e.stopPropagation() // don't propagate button click to element underneath it (e.g. folder accordion)
    // Emit a click for logging purposes:
    emitter.dispatchEvent(new CustomEvent('userEvent', { detail: new ClickEntry(ActionEnum.CLICK, (e.clientX + window.pageXOffset), (e.clientY + window.pageYOffset), e.target.id,new Date().getTime()) }))
});

// ---- Assign unique ids to everything that doesn't have an ID ----
$('#html-loc').find('*').uniqueId();

$('#sidepanel').append(epPanelInstructions);
$('#sidepanel').append(epPanel);
$('#sidepanel').append(userSField);
$('#sidepanel').append(createFileSelectDropdown());
$('#epPanel').attr('filepath', '/C/presentation_documents/presentation.ppt');
});

