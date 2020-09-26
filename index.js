const $ = require('jquery');
const electron = require('electron').remote;
const dialog = electron.dialog;
const fsp = require('fs').promises;

$(document).ready(function(){
    let rows = [];

    function getDefaultCell(){
        let cell = {
            val: '',
            fontFamily: 'georgia',
            fontSize: 12,
            bold: false,
            italic: false,
            underline: false,
            bgColor: '#FFFFFF',
            textColor: '#000000',
            valign: 'middle',
            halign: 'left'
        }
        return cell;
    }

    function prepareCellDiv(cdiv, cobj){
        $(cdiv).html(cobj.val);
        $(cdiv).css('font-family', cobj.fontFamily);
        $(cdiv).css('font-size', cobj.fontSize + 'px');
        $(cdiv).css('font-weight', cobj.bold ? 'bold' : 'normal');
        $(cdiv).css('font-style', cobj.italic ? 'italic' : 'normal');
        $(cdiv).css('text-decoration', cobj.unerline ? 'underline' : 'none');
        $(cdiv).css('background-color', cobj.bgColor);
        $(cdiv).css('background-color', cobj.bgColor);
        $(cdiv).css('text-align', cobj.halign);
    }

    $('#content-container').on('scroll', function(){
        $('#first-row').css('top', $('#content-container').scrollTop());
        $('#first-col').css('left', $('#content-container').scrollLeft());
        $('#tl-cell').css('top', $('#content-container').scrollTop());
        $('#tl-cell').css('left', $('#content-container').scrollLeft());
    });

    // $(window).on('load resize', function(){
    //     let ht = parseInt($(window).outerHeight()) - 60;
    //     $('#content-container').height(ht + 'px');
    // })

    $('#new').on('click', function(){
        $('#grid').find('.row').each(function(){
            let cells = [];
            $(this).find('.cell').each(function(){
                let cell = getDefaultCell();
                cells.push(cell);
                prepareCellDiv(this, cell);
            })
            rows.push(cells);
        })
        $('#home-menu').click();
        $('#grid .cell:first').click();
    })

    $('#open').on('click', async function(){
        let dobj = await dialog.showOpenDialog();
        console.log(dobj);
        if(dobj.canceled){
            return;
        }else if(dobj.filePaths.length === 0){
            alert("Please select a file");
            return;
        }else{
            let data = await fsp.readFile(dobj.filePaths[0]);
            let rows = JSON.parse(data);

            let i = 0;
            $('#grid').find('.row').each(function(){
                let j = 0;
                $(this).find('.cell').each(function(){
                    $(this).html(rows[i][j]);
                    j++;
                })
                i++;
            })
        }
    })

    $('#save').on('click', async function(){
        let dobj = await dialog.showSaveDialog();
        await fsp.writeFile(dobj.filePath, JSON.stringify(rows));
        alert('saved Successfully');
        $('#home-menu').click();

    })

    $('#menu-bar > div').on('click', function(){
        $('#menu-bar > div').removeClass('selected');
        $(this).addClass('selected');

        let menuContainerId = $(this).attr('data-content');
        $("#menu-content-container > div").css('display', 'none');
        $('#' + menuContainerId).css('display', 'flex');
    })

    $('#bold').on('click', function(){
        $(this).toggleClass('selected');
    })

    $('#italic').on('click', function(){
        $(this).toggleClass('selected');
    })

    $('#underline').on('click', function(){
        $(this).toggleClass('selected');
    })

    $('.valign').on('click', function(){
        $('.valign').removeClass('selected');
        $(this).addClass('selected');
    })

    $('.halign').on('click', function(){
        $('.halign').removeClass('selected');
        $(this).addClass('selected');
    })

    $('#grid .cell').on('click', function(e){
        if(e.ctrlKey){
            $(this).addClass('selected');
        }else{
            $('#grid .cell').removeClass('selected');
            $(this).addClass('selected');
        }
    })

    $('#grid .cell').on('keypress', function(){
        let rid = parseInt($(this).attr('rid'));
        let cid = parseInt($(this).attr('cid'));
        let cobj = rows[rid][cid];
        cobj.val = $(this).html();
    })

    $('#new').click();
})