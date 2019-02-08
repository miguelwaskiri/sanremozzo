$(document).ready(function () {
    var navListItems = $('div.setup-panel div a'),
        allWells = $('.setup-content'),
        allNextBtn = $('.nextBtn');

    allWells.hide();

    navListItems.click(function (e) {
        e.preventDefault();
        var $target = $($(this).attr('href')),
            $item = $(this);

        if (!$item.hasClass('disabled')) {
            navListItems.removeClass('btn-primary').addClass('btn-default');
            $item.addClass('btn-primary');
            allWells.hide();
            $target.show();
            $target.find('input:eq(0)').focus();
        }
    });

    allNextBtn.click(function(){
        var curStep = $(this).closest(".setup-content"),
            curStepBtn = curStep.attr("id"),
            nextStepWizard = $('div.setup-panel div a[href="#' + curStepBtn + '"]').parent().next().children("a"),
            curInputs = curStep.find("input[type='text'],input[type='url']"),
            skipCheckbox = $("#skip-" + curStepBtn);
            isValid = true;

        $(".form-group").removeClass("has-error");
        for(var i=0; i<curInputs.length; i++){
            if (!curInputs[i].validity.valid){
                isValid = false;
                $(curInputs[i]).closest(".form-group").addClass("has-error");
            }
        }


        if ((skipCheckbox).prop('checked') == true) {
            isValid = true;
            nextStepWizard.removeAttr('disabled').trigger('click');
        } else {
            if (isValid) {
                var $this = $(this);
                $this.button('loading');
                var ajaxRequest = curStepBtn + '.php';
                var ajaxParams = {};

                switch (curStepBtn) {
                    case 'step-3':
                        ajaxParams.storeCode = $('#theme-activation-store-code').val();
                        break;
                    case 'step-4':
                        ajaxParams.storeCode = $('#demo-configuration-store-code').val();
                        ajaxParams.demoVersion = $('#demo-configuration-version').val();
                        break;
                    case 'step-5':
                        ajaxParams.storeCode = $('#theme-configuration-store-code').val();
                        ajaxParams.homePage = $('#theme-configuration-home-page').val();
                        ajaxParams.header = $('#theme-configuration-header').val();
                        ajaxParams.storeCode = $('#theme-configuration-store-code').val();
                        ajaxParams.categoryColumns = $('#theme-configuration-category-columns').val();
                        ajaxParams.productVersion = $('#theme-configuration-product-page').val();
                        ajaxParams.preFooter = $('#theme-configuration-prefooter').val();
                        ajaxParams.footer = $('#theme-configuration-footer').val();
                        break;
                    case 'step-6':
                        ajaxParams.deleteInstaller = $('#delete-installer').val();
                }

                $.ajax({
                    type: "POST",
                    url: ajaxRequest,
                    // contentType: "application/json",
                    dataType: 'json',
                    data: ajaxParams,
                    success: function(data) {
                        $this.button('reset');
                        if (!data.error) {
                            nextStepWizard.removeAttr('disabled').trigger('click');
                            $('.result-container').append("<p class='success'>" + curStepBtn.toUpperCase() + ": <br/> " + data.msg + "</p>");
                        } else {
                            $('.result-container').append("<p class='error'>" + curStepBtn.toUpperCase() + ": <br/> "  + data.msg + "</p>");
                        }
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        $('.result-container').append("<p class='error'>" + curStepBtn.toUpperCase() + ": <br/> " + " Server request error: " + errorThrown + "</p>");
                        $this.button('reset');
                    }
                });
            }
        }

    });

    $('div.setup-panel div a.btn-primary').trigger('click');

    /** preview update */
    $('.form-control').on('change', function() {
        var clickedId = $(this).attr('id'),
            clickedVal = $(this).val(),
            previewSection = '';

        switch (clickedId) {
            case 'theme-configuration-home-page':
            case 'theme-configuration-category-columns':
            case 'theme-configuration-product-page':
                previewSection = $('.page-preview');
                break;
            default:
                previewSection = $('.' + clickedId);
                break;
        }

        if (previewSection.length) {
            var imgExt = '.jpg';
            if (clickedId == 'theme-configuration-header' && clickedVal == 'v2') imgExt = '.png';
            if (clickedId == 'theme-configuration-home-page' && clickedVal == 'v6') {
                var imageSrc = [
                    'img/' + clickedId + '/' + clickedVal + '-1' + imgExt,
                    'img/' + clickedId + '/' + clickedVal + '-2' + imgExt,
                    'img/' + clickedId + '/' + clickedVal + '-3' + imgExt
                ];
            } else {
                var imageSrc = ['img/' + clickedId + '/' + clickedVal + imgExt];
            }

            var previewImg = '';
            for (var i = 0; i < imageSrc.length; i++) {
                previewImg += '<img alt="" class="' + clickedId + '-' + clickedVal + '" src="' + imageSrc[i] + '" />'
            }
            previewSection.html(previewImg);

            if (
                clickedId == 'theme-configuration-header' ||
                clickedId == 'theme-configuration-prefooter' ||
                clickedId == 'theme-configuration-footer'
            ) {
                var scrollPos = previewSection.position().top;
                setTimeout(function() {
                    $('.preview-images').animate({
                        scrollTop: scrollPos
                    }, 600);
                }, 500);
            }
        }
    });

    /** remove notification message */
    $('.btn-proc-1').on('click', function() {
       $('.notification-msg').hide();
    });
    $('.step-1-link').on('click', function() {
        $('.notification-msg').show();
    });

});
