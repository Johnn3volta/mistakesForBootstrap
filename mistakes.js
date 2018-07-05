(function () {
    "use strict";
    var mis,
        mistakes = {

            initialize: function () {
                this.setUpListeners()
            },
            setUpListeners: function () {

                var form = jQuery('#mistake-form');
                form.on('submit', mistakes.mistakesFormSubmit);
                document.onkeypress = mistakes.getText;
            },

            getText: function (e) {

                if (!e) e = window.event;
                if ((e.ctrlKey) && ((e.keyCode == 10) || (e.keyCode == 13))) {
                    mistakes.CtrlEnter();
                }
                return true;
            },
            CtrlEnter: function () {
                var sel = mistakes.mis_get_sel_text();
                if (sel.selected_text.length > 300) {
                    alert('Можно выделить не более 300 символов!');
                }
                else if (sel.selected_text.length == 0) {
                    alert('Выделите ошибку!');
                }
                else {
                    // Get selection context.
                    mis = mistakes.mis_get_sel_context(sel);
                    mistakes.fillForm(mis, sel);
                    jQuery('#Mistake').modal('show')

                }
            },
            mis_get_sel_text: function () {
                var w = window,
                    d = document;
                if (w.getSelection) {

                    var txt = w.getSelection(),
                        selected_text = txt.toString(),
                        full_text = txt.anchorNode.textContent,
                        selection_start = txt.anchorOffset,
                        selection_end = txt.focusOffset;
                }
                else if (d.getSelection) {
                    txt = d.getSelection();
                    selected_text = txt.toString();
                    full_text = txt.anchorNode.textContent;
                    selection_start = txt.anchorOffset;
                    selection_end = txt.focusOffset;
                }
                else if (d.selection) {
                    txt = d.selection.createRange();
                    selected_text = txt.text;
                    full_text = txt.parentElement().innerText;

                    var stored_range = txt.duplicate();
                    stored_range.moveToElementText(txt.parentElement());
                    stored_range.setEndPoint('EndToEnd', txt);
                    selection_start = stored_range.text.length - txt.text.length;
                    selection_end = selection_start + selected_text.length;
                }
                else {
                    return;
                }
                var txt = {
                    selected_text: selected_text,
                    full_text: full_text,
                    selection_start: selection_start,
                    selection_end: selection_end
                };
                return txt;
            },
            mis_get_sel_context: function (sel) {
                var selection_start = sel.selection_start,
                    selection_end = sel.selection_end;
                if (selection_start > selection_end) {
                    var tmp = selection_start;
                    selection_start = selection_end;
                    selection_end = tmp;
                }

                var context = sel.full_text;

                var context_first = context.substring(0, selection_start),
                    context_second = context.substring(selection_start, selection_end),
                    context_third = context.substring(selection_end, context.length);
                context = context_first + '<strong>' + context_second + '</strong>' + context_third;

                var context_start = selection_start - 60;
                if (context_start < 0) {
                    context_start = 0;
                }

                var context_end = selection_end + 60;
                if (context_end > context.length) {
                    context_end = context.length;
                }

                context = context.substring(context_start, context_end);

                context_start = context.indexOf(' ') + 1;

                if (selection_start + 60 < context.length) {
                    context_end = context.lastIndexOf(' ', selection_start + 60);
                }
                else {
                    context_end = context.length;
                }

                selection_start = context.indexOf('<strong>');
                if (context_start > selection_start) {
                    context_start = 0;
                }

                if (context_start) {
                    context = context.substring(context_start, context_end);
                }

                return context;
            },
            fillForm: function (txt, fulltxt) {
                var dlh = document.location.href;
                jQuery('#mistake-form #page_url').html(dlh);
                jQuery('#mistake-form #mistake_string_arrea').html(txt);
                jQuery('#mistake-form #mistake_page').val(dlh);
                jQuery('#mistake-form #mistake_string').val(txt);
                jQuery('#mistake-form #mistake_full_text').val(fulltxt.full_text);
            },
            mistakesFormSubmit: function (e) {
                e.preventDefault();
                // alert('hi i am button');
                var form = jQuery(this),
                    btnSubmit = form.find('button[type=submit]');
                btnSubmit.attr('disabled', 'disabled');
                var data = form.serialize();
                jQuery.ajax({
                    url : '/mistakes/mistakes.php',
                    type : 'POST',
                    data: data
                }).done(function (msg) {
                    form.html(msg);
                    setTimeout(function () {
                        location.href = location.href;
                    },2000);
                }).always(function () {
                    btnSubmit.removeAttr('disabled');
                })
            }
        };
    mistakes.initialize()


}());