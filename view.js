const addCSS = css => document.head.appendChild(document.createElement("style")).innerHTML=css;

$(document).ready(function () {
    let infoDiv = document.createElement("div");
    infoDiv.id = "infoDiv";
    let infoButton = document.createElement("button");
    infoButton.id = "infoButton";

    infoButton.addEventListener("click", function(event){
        $(this).hide();
        $("#expandedInfo").show();
    }, false);

    infoButton.textContent = "File Permission Info";
    infoDiv.append(infoButton);
    document.body.append(infoDiv);
    
    addCSS("#infoDiv{margin: auto; width: auto; bottom: 0; text-align: center;}");
    addCSS("#infoButton{text-align: center; position: fixed; bottom: 0; padding: 6px;}");

   
    const expandedInfo = document.createElement("div");
    expandedInfo.style.margin = "auto";
    expandedInfo.style.position = "relative";
    expandedInfo.style.padding = "32px";
    expandedInfo.style.backgroundColor = "lightgray";
    expandedInfo.id = "expandedInfo";
    expandedInfo.style.display = "none";

    const butt = document.createElement("button");
    butt.textContent = "X";
    butt.style.position = "absolute";
    butt.style.right = "6px";
    butt.style.top = "6px";
    butt.addEventListener("click", function(event){
        $("#expandedInfo").hide();
        $("#infoButton").show();
    }, false);
    expandedInfo.appendChild(butt);


    const ol = document.createElement("ol");
    ol.style.listStyleType = "decimal";

    
    const li1 = document.createElement("li");
    const li2 = document.createElement("ul");
    li2.style.listStyleType = "lower-alpha";
    li2.style.paddingLeft = "40px";


    const a = document.createElement("li");
    const b = document.createElement("li");
    const li3 = document.createElement("li");
    
    li1.textContent = "Look at all of the direct (i.e. not inherited) permissions that are set on this file for this user OR for any groups that this user is part of (e.g. administrators).";    ;
    a.textContent = "If any of these are set to deny permission, then permission is denied.";
    b.textContent = "Otherwise, if any of these are set to allow the permission, then the action is allowed to happen";
    li3.textContent = "If (a) there were no direct permissions for this [user, action] combination, AND (b) inheritance is turned on for this file/folder, repeat the process using the permissions for the parent folder.";
    li2.appendChild(a);
    li2.appendChild(b);

    ol.appendChild(li1);
    ol.appendChild(li2);
    ol.appendChild(li3);

    expandedInfo.appendChild(ol);
    document.body.appendChild(expandedInfo);
    

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
    var epPanelInstructions = $('<h3></h3>');
    epPanelInstructions.text('Use the panel below to view file permissions for specific users. To test out, select a user and then select a file and the permissions they have will be displayed');

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

