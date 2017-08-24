$(document).ready(function () {

    let boxes = [
        {
            number: 1,
            top: 0,
            left: 0
    },
        {
            number: 2,
            top: 0,
            left: 100
    },
        {
            number: 3,
            top: 0,
            left: 200
    },
        {
            number: 4,
            top: 0,
            left: 300
    },
        {
            number: 5,
            top: 100,
            left: 0
    },
        {
            number: 6,
            top: 100,
            left: 100
    },
        {
            number: 7,
            top: 100,
            left: 200
    },
        {
            number: 8,
            top: 100,
            left: 300
    },
        {
            number: 9,
            top: 200,
            left: 0
    },
        {
            number: 10,
            top: 200,
            left: 100
    },
        {
            number: 11,
            top: 200,
            left: 200
    },
        {
            number: 12,
            top: 200,
            left: 300
    },
        {
            number: 13,
            top: 300,
            left: 0
    },
        {
            number: 14,
            top: 300,
            left: 100
    },
        {
            number: 15,
            top: 300,
            left: 200
    },
        {
            number: 16,
            top: 300,
            left: 300
    }
]

    let arrForSorting = boxes.map(el => Object.assign({}, el));
    let arrForRandomGame = boxes.map(el => Object.assign({}, el));
    let minutes = 0;
    let seconds;
    let clicks;
    let stopwatch;

    // sort arr random
    function shuffle(arr) {
        for (var j, x, i = arr.length; i; j = parseInt(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
        return arr;
    }

    function game() {
        $('main').html('');
        boxes.forEach(function (el) {
            if (el.number === 16) {
                $('main').append(`<div class='empty' style='top:${el.top}px; left:${el.left}px'>${el.number}</div>`)
            } else {
                $('main').append(`<div class='box${el.number}' style='top:${el.top}px; left:${el.left}px'>${el.number}</div>`)
            }

        })
    }

    // create a new arr which will be compared to the started array. In case they are the same - game is over
    function newBoxesArr() {
        let tempArr;
        let boxesAfterClick;
        let newTop;
        let newLeft;
        tempArr = $('main div').toArray();
        return boxesAfterClick = $.map(tempArr, function (el) {
            newTop = parseFloat($(el).attr('style').split(';')[0].substr(4));
            newLeft = parseFloat($(el).attr('style').split(';')[1].substr(6));
            return {
                number: parseFloat($(el).html()),
                top: newTop,
                left: newLeft
            }
        })
    }

    function checkWin(fn) {
        let checker = 0;
        fn().forEach(function (el, i) {
            if ((el.number === boxes[i].number) &&
                (el.top === boxes[i].top) &&
                (el.left === boxes[i].left)) {
                checker++;
            }
        })

        if (checker === 16) {
            $('main').append(`<div class='congratulation'>You win! Cheers!</div>`);
            $('main div').addClass('transparent');
            $('.new-game').addClass('is-hover').one('click', newGame);
            $('.win').removeClass('is-hover').off('click', win);
            clearInterval(stopwatch);
        }
    }

    function cellMove(event) {
        let $target = $(event.target);
        let $empty = $('.empty');
        let top = parseFloat($target.css('top'));
        let left = parseFloat($target.css('left'));
        let emptyTop = parseFloat($('.empty').css('top'));
        let emptyleft = parseFloat($('.empty').css('left'));

        if (((Math.abs(top - emptyTop) === 0) && (Math.abs(left - emptyleft) === 100)) ||
            ((Math.abs(top - emptyTop) === 100) && (Math.abs(left - emptyleft) === 0))) {
            $target.css({
                    'transition': '0s',
                    'border': '2px solid #2F6CB3'
                })
                .animate({
                    top: emptyTop + 'px',
                    left: emptyleft + 'px'
                }, 200, () => {
                    $target.css('border', 'none');
                });

            $empty.css({
                'top': top + 'px',
                'left': left + 'px'
            });

            $('.steps').html(clicks++);
            checkWin(newBoxesArr);
        }

    }

    function newGame() {
        let tempArr;
        let shufflerArr;
        let interval;
        minutes = 0;
        seconds = 1;
        clicks = 1;
        setTimeout(function () {
            $('.congratulation').remove();
            $('main div').removeClass('transparent');
            shufflerArr = shuffle(arrForSorting);
            tempArr = $('main div').toArray();
            tempArr.forEach(function (tempArrEl, i) {
                $(tempArrEl).attr('style', `top:${shufflerArr[i].top}px; left:${shufflerArr[i].left}px;`);
            });

            /*
                i had to use .off here, otherwise if user clicks on new game more than one time,
                div with class congratulation will be append as much times as user clicked 'New game'
            */
            $('.win').off('click', win).one('click', win).addClass('is-hover');
            $('.steps').html('0');
            $('.new-game').removeClass('is-hover');

        }, 100);
        $('.seconds').html(`00`);
        $('.minutes').html(`00`);
        stopwatch = setInterval(updateStopwatch, 1000);
    }

    function win() {
        let tempArr = $('main div').toArray();
        tempArr.forEach(function (tempArrEl, i) {
            boxes.forEach(function (boxesEl, j) {
                if (parseFloat($(tempArrEl).html()) === boxesEl.number) {
                    $(tempArrEl).attr('style', `top:${boxesEl.top}px; left:${boxesEl.left}px;`);
                }
            })

        })
        $('main').append(`<div class='congratulation'>You win! Cheers!</div>`);
        $('main div').addClass('transparent');
        $('.win').removeClass('is-hover');
        $('.new-game').addClass('is-hover').one('click', newGame);
        clearInterval(stopwatch);
    }

    function updateStopwatch() {
        if (seconds === 60) {
            minutes++;
            seconds = 0;
        }
        seconds < 10 ? $('.seconds').html(`0${seconds}`) : $('.seconds').html(seconds);
        minutes < 10 ? $('.minutes').html(`0${minutes}`) : $('.minutes').html(minutes);
        seconds++;
    }

    $('main').bind('click', cellMove);
    $('.new-game').one('click', () => {
        game();
        newGame();
    });

});
