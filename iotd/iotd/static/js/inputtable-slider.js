var inputtableSlider = {};

(function ($) {
    // Create a text input box mimicking slider value tag and overlay on it
    function add_irs_single_input() {
        var input = document.createElement('input');
        input.type = 'text';
        input.value = this.innerHTML;
        $(input).addClass('irs-single')
            .css({
                'text-align': 'center',
                'background-color': '#aaa',
                'border': 'none',
                'left': this.style.left,
                'height': $(this).css('height'),
                'width': $(this).css('width')
            });
        $(this).parent()
            .append(input)
            .find('input[type="text"]')
                .focusout(function () {
                    $(this).parent().parent().next()    // Caution: This is sensitive to the exact hierarchy of ion-range slider
                        .data('ionRangeSlider').update({ from: parseInt($(this).val().replace(/\$|,/g, '')), })
                    $('.irs-single').css('z-index', '5');
                })
                .keydown(function (event) {
                    if (event.keyCode == 13) $(this).focusout();
                })
                .focus(function() {
                    $(this).select();
                })
                .focus();
        $('.irs-single').css('z-index', '5');
    };

    // A wrapper function to initialize ion-range sliders
    inputtableSlider.init = function(slider_name, options) {
        var $slider = $(slider_name);
        // All default values are for sum assured slider
        var _options = {
            type: 'single',
            min: 0,
            max: 10000000,
            from: 1000000,
            to: 5000000,
            from_min: 200000,
            step: 50000,
            prefix: '$',
            grid: true,
            grid_num: 2,
            prettify: function (d) { return d.toLocaleString(); },
            keyboard: true,
            force_edges: true,
            inputtable: true
        };
        if (typeof options !== 'undefined') {
            for (var key in options) {
                if (key in _options) _options[key] = options[key];
            }
        }
        if ($slider.length>0) {
            // Create slider
            $slider.ionRangeSlider({
                type: _options.type,
                min: _options.min,
                max: _options.max,
                from: _options.from ,
                from_min: _options.from_min,
                to: _options.to,
                step: _options.step,
                prefix: _options.prefix,
                grid: _options.grid,
                grid_num: _options.grid_num,
                prettify: _options.prettify,
                force_edges: _options.force_edges,
                keyboard: _options.keyboard,
                onStart: function () {
                    if (_options.type === 'single' && _options.inputtable) {
                        $slider.siblings().find('.irs-single')
                            .css('cursor', 'text')
                            .dblclick(add_irs_single_input);
                    }
                },
                onChange: function () {
                    if (_options.type === 'single' && _options.inputtable) {
                        $slider.siblings().find('input').remove();
                    }
                },
                onUpdate: function () {
                    if (_options.type === 'single' && _options.inputtable) {
                        $slider.siblings().find('.irs-single')
                            .css('cursor', 'text')
                            .dblclick(add_irs_single_input);
                    }
                },
            });
            // Set default value
            $slider.prop('defaultValue', _options.type === 'double' ? _options.from + ';' + _options.to : _options.from);
            // Configure form reset
            $slider.parents('form').on('reset', function () {
                var _$slider = $(slider_name);

                if ('reset' in options) {
                    // Accept an function input to do customized reset
                    // false-like values (e.g. false, null, etc) would be converted to inaction
                    (options.reset || function(_) {})(_$slider);
                }
                // For some reasons when the slider is under display:none, the value remains "" even after .reset(). The .val() is not truely updated until it becomes display:block
                else _$slider.data('ionRangeSlider').reset();
            });
            // Remove pre-render elements
            $slider.siblings()
                .remove('.slider-loading');
        }
    };
})(jQuery)
