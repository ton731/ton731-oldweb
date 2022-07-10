$(document).ready(function() {

    var $body = $('body')
    var $stage = $('#stage')
    var $player1 = $('#player1')
    var $player2 = $('#player2')
    var $enemy1 = $('#enemy1')
    var $enemy2 = $('#enemy2')
    var $enemy3 = $('#enemy3')
    var $enemy4 = $('#enemy4')
    var can_move = true
    var game_win_text


    // 設定玩家初始位置
    $player1.css('left', $stage.width() / 2 - $player1.width() / 2 - 40)
    $player1.css('top', $stage.height() / 2 - $player1.height() / 2)
    $player2.css('left', $stage.width() / 2 - $player2.width() / 2 + 40)
    $player2.css('top', $stage.height() / 2 - $player2.height() / 2)

    // 設定enemy初始位置
    $enemy1.css('left', 10)
    $enemy1.css('top', 10)
    $enemy2.css('left', $stage.width() - 10 - $enemy2.width())
    $enemy2.css('top', $stage.height() - $enemy2.height() - 10)
    $enemy3.css('left', 10)
    $enemy3.css('top', $stage.height() - $enemy2.height() - 10)
    $enemy4.css('left', $stage.width() - 10 - $enemy2.width())
    $enemy4.css('top', 10)




    // 設定上下左右移動
    $(document).keydown(function(event) {
        var x1 = parseInt($player1.css('left'))
        var y1 = parseInt($player1.css('top'))
        var x2 = parseInt($player2.css('left'))
        var y2 = parseInt($player2.css('top'))

        if (can_move) {
            switch (event.keyCode) {
                // player1
                // player1向左
                case 65:
                    if (x1 > 0) {
                        $player1.css('left', x1 - 30)
                    }

                    break

                    // player1向右
                case 68:
                    if (x1 < $stage.width() - $player1.width()) {
                        $player1.css('left', x1 + 30)
                    }
                    break

                    // player1向上移動
                case 87:
                    if (y1 > 0) {
                        $player1.css('top', y1 - 30)
                    }
                    break

                    // player1向下移動
                case 83:
                    if (y1 < $stage.height() - $player1.height()) {
                        $player1.css('top', y1 + 30)
                    }
                    break




                    // player2
                    // player2向左
                case 37:
                    if (x2 > 0) {
                        $player2.css('left', x2 - 30)
                    }

                    break

                    // player2向右
                case 39:
                    if (x2 < $stage.width() - $player2.width()) {
                        $player2.css('left', x2 + 30)
                    }
                    break

                    // player2向上移動
                case 38:
                    if (y2 > 0) {
                        $player2.css('top', y2 - 30)
                    }
                    break

                    // player2向下移動
                case 40:
                    if (y2 < $stage.height() - $player2.height()) {
                        $player2.css('top', y2 + 30)
                    }
                    break


                    // 下面註解是因為這種移動方式是平順的滑動，比較自然，缺點是需要一直按住鍵盤，但是我喜歡這種，所以先註解著備用

                    //     // player2
                    //     // player2向左
                    // case 37:
                    //     var speed = 3
                    //     var left_interval = setInterval(function() {
                    //         var px = parseInt($player2.css('left'))
                    //         if (px > 0) {
                    //             $player2.css('left', px - speed)
                    //             speed -= 0.5
                    //         }
                    //         if (speed <= 0) {
                    //             clearInterval(left_interval)
                    //         }
                    //     }, 1000 / 60)
                    //     break

                    //     // player2向右
                    // case 39:
                    //     var speed = 3
                    //     var right_interval = setInterval(function() {
                    //         var px = parseInt($player2.css('left'))
                    //         if (px + $player2.width() < $stage.width()) {
                    //             $player2.css('left', px + speed)
                    //             speed -= 0.5
                    //         }
                    //         if (speed <= 0) {
                    //             clearInterval(right_interval)
                    //         }
                    //     }, 1000 / 60)
                    //     break

                    //     // player2向上移動
                    // case 38:
                    //     var speed = 3
                    //     var up_interval = setInterval(function() {
                    //         var py = parseInt($player2.css('top'))
                    //         if (py > 0) {
                    //             $player2.css('top', py - speed)
                    //             speed -= 0.5
                    //         }
                    //         if (speed <= 0) {
                    //             clearInterval(up_interval)
                    //         }
                    //     }, 1000 / 60)
                    //     break

                    //     // player2向下移動
                    // case 40:
                    //     var speed = 3
                    //     var down_interval = setInterval(function() {
                    //         var py = parseInt($player2.css('top'))
                    //         if (py + $player2.height() < $stage.height()) {
                    //             $player2.css('top', py + speed)
                    //             speed -= 0.5
                    //         }
                    //         if (speed <= 0) {
                    //             clearInterval(down_interval)
                    //         }
                    //     }, 1000 / 60)
                    //     break


            }
        }

    })




    // 讓enemy追蹤player
    // enemy1,2追蹤player1, enemy3,4追蹤player2
    var enemy_array = $('.enemy')
    for (let i = 0; i < enemy_array.length; i++) {
        $(enemy_array[i]).data("ex", 0)
        $(enemy_array[i]).data("ey", 0)
        $(enemy_array[i]).data("x_direction", 0)
        $(enemy_array[i]).data("y_direction", 0)
        $(enemy_array[i]).data("distance", 1)
        $(enemy_array[i]).data("scale", 1)
        $(enemy_array[i]).data("count", 0)
    }

    var track = setInterval(track_func, 1500)

    function track_func() {
        var px1 = parseInt($player1.css('left')) + $player1.width() / 2
        var py1 = parseInt($player1.css('top')) + $player1.height() / 2
        var px2 = parseInt($player2.css('left')) + $player2.width() / 2
        var py2 = parseInt($player2.css('top')) + $player2.height() / 2

        // 設定enemy1,2的追蹤路線
        for (let i = 0; i < 2; i++) {
            var $enemy = $(enemy_array[i])
            $enemy.data("count", 0)
            $enemy.data("ex", parseInt($enemy.css("left") + $enemy.width() / 2))
            $enemy.data("ey", parseInt($enemy.css('top') + $enemy.height() / 2))
            $enemy.data("x_direction", px1 - $enemy.data("ex"))
            $enemy.data("y_direction", py1 - $enemy.data("ey"))
            $enemy.data("distance", Math.sqrt(Math.pow($enemy.data("x_direction"), 2) + Math.pow($enemy.data("y_direction"), 2)))
            $enemy.data("scale", $enemy.data("distance") / 200)


        }


        // 設定enemy3,4的追蹤路線
        for (let i = 2; i < enemy_array.length; i++) {
            var $enemy = $(enemy_array[i])
            $enemy.data("count", 0)
            $enemy.data("ex", parseInt($enemy.css("left") + $enemy.width() / 2))
            $enemy.data("ey", parseInt($enemy.css('top') + $enemy.height() / 2))
            $enemy.data("x_direction", px2 - $enemy.data("ex"))
            $enemy.data("y_direction", py2 - $enemy.data("ey"))
            $enemy.data("distance", Math.sqrt(Math.pow($enemy.data("x_direction"), 2) + Math.pow($enemy.data("y_direction"), 2)))
            $enemy.data("scale", $enemy.data("distance") / 200)


        }




        var move_enemy1 = setInterval(function() {
            count = $enemy1.data("count")
            $enemy1.data("count", count + 1)
            ex = parseInt($enemy1.css('left'))
            ey = parseInt($enemy1.css('top'))

            // 撞牆判斷
            if (ex + $enemy1.data("x_direction") / ($enemy1.data("scale") * 60) > 0 && ex + $enemy1.data("x_direction") / ($enemy1.data("scale") * 60) < $stage.width() - $player1.width()) {
                $enemy1.css('left', ex + $enemy1.data("x_direction") / ($enemy1.data("scale") * 60))
            }
            if (ey + $enemy1.data("y_direction") / ($enemy1.data("scale") * 60) > 0 && ey + $enemy1.data("y_direction") / ($enemy1.data("scale") * 60) < $stage.height() - $player1.height()) {
                $enemy1.css('top', ey + $enemy1.data("y_direction") / ($enemy1.data("scale") * 60))
            }

            // 每秒結束移動，重新定位player
            if ($enemy1.data("count") >= 90) {
                clearInterval(move_enemy1)
            }

        }, 1000 / 60)


        var move_enemy2 = setInterval(function() {
            count = $enemy2.data("count")
            $enemy2.data("count", count + 1)
            ex = parseInt($enemy2.css('left'))
            ey = parseInt($enemy2.css('top'))

            // 撞牆判斷
            if (ex + $enemy2.data("x_direction") / ($enemy2.data("scale") * 60) > 0 && ex + $enemy2.data("x_direction") / ($enemy2.data("scale") * 60) < $stage.width() - $player1.width()) {
                $enemy2.css('left', ex + $enemy2.data("x_direction") / ($enemy2.data("scale") * 60))
            }
            if (ey + $enemy2.data("y_direction") / ($enemy2.data("scale") * 60) > 0 && ey + $enemy2.data("y_direction") / ($enemy2.data("scale") * 60) < $stage.height() - $player1.height()) {
                $enemy2.css('top', ey + $enemy2.data("y_direction") / ($enemy2.data("scale") * 60))
            }

            // 每秒結束移動，重新定位player
            if ($enemy2.data("count") >= 90) {
                clearInterval(move_enemy2)
            }

        }, 1000 / 60)



        var move_enemy3 = setInterval(function() {
            count = $enemy3.data("count")
            $enemy3.data("count", count + 1)
            ex = parseInt($enemy3.css('left'))
            ey = parseInt($enemy3.css('top'))

            // 撞牆判斷
            if (ex + $enemy3.data("x_direction") / ($enemy3.data("scale") * 60) > 0 && ex + $enemy3.data("x_direction") / ($enemy3.data("scale") * 60) < $stage.width() - $player1.width()) {
                $enemy3.css('left', ex + $enemy3.data("x_direction") / ($enemy3.data("scale") * 60))
            }
            if (ey + $enemy3.data("y_direction") / ($enemy3.data("scale") * 60) > 0 && ey + $enemy3.data("y_direction") / ($enemy3.data("scale") * 60) < $stage.height() - $player1.height()) {
                $enemy3.css('top', ey + $enemy3.data("y_direction") / ($enemy3.data("scale") * 60))
            }

            // 每秒結束移動，重新定位player
            if ($enemy3.data("count") >= 90) {
                clearInterval(move_enemy3)
            }

        }, 1000 / 60)



        var move_enemy4 = setInterval(function() {
            count = $enemy4.data("count")
            $enemy4.data("count", count + 1)
            ex = parseInt($enemy4.css('left'))
            ey = parseInt($enemy4.css('top'))

            // 撞牆判斷
            if (ex + $enemy4.data("x_direction") / ($enemy4.data("scale") * 60) > 0 && ex + $enemy4.data("x_direction") / ($enemy4.data("scale") * 60) < $stage.width() - $player1.width()) {
                $enemy4.css('left', ex + $enemy4.data("x_direction") / ($enemy4.data("scale") * 60))
            }
            if (ey + $enemy4.data("y_direction") / ($enemy4.data("scale") * 60) > 0 && ey + $enemy4.data("y_direction") / ($enemy4.data("scale") * 60) < $stage.height() - $player1.height()) {
                $enemy4.css('top', ey + $enemy4.data("y_direction") / ($enemy4.data("scale") * 60))
            }

            // 每秒結束移動，重新定位player
            if ($enemy4.data("count") >= 90) {
                clearInterval(move_enemy4)
            }

        }, 1000 / 60)

    }


    // 判定enemy碰撞到player
    var test_player1 = setInterval(function() {
        $stage.find('.enemy').each(function() {
            ex = parseInt($(this).css('left')) + $(this).width() / 2
            ey = parseInt($(this).css('top')) + $(this).height() / 2
            px = parseInt($player1.css('left')) + $player1.width() / 2
            py = parseInt($player1.css('top')) + $player1.height() / 2
            distance = Math.sqrt(Math.pow(px - ex, 2) + Math.pow(py - ey, 2))
            if (distance < 35) {
                game_win_text = "Player2 Win!"
                game_over()
                clearInterval(test_player1)
                clearInterval(test_player2)

            }
        })
    }, 1000 / 30)


    var test_player2 = setInterval(function() {
        $stage.find('.enemy').each(function() {
            ex = parseInt($(this).css('left')) + $(this).width() / 2
            ey = parseInt($(this).css('top')) + $(this).height() / 2
            px = parseInt($player2.css('left')) + $player2.width() / 2
            py = parseInt($player2.css('top')) + $player2.height() / 2
            distance = Math.sqrt(Math.pow(px - ex, 2) + Math.pow(py - ey, 2))
            if (distance < 35) {
                game_win_text = "Player1 Win!"
                game_over()
                clearInterval(test_player2)
                clearInterval(test_player1)
            }
        })
    }, 1000 / 30)



    function game_over() {
        clearInterval(track)
        can_move = false
        console.log(game_win_text)

        var $div = $('<div>')
        $div.addClass('gameover_text')
        $div.html(game_win_text)
        $stage.append('<div class="gameover_display"></div>')
        $('.gameover_display').css('opacity', 0.95)
        $('.gameover_display').append($div)

        // 按一下重新整理
        $('.gameover_display').on('click', function() {
            location.reload()
        })


    }









})