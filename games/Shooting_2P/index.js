$(document).ready(function() {

    // 物件
    var $body = $('body')
    var $stage = $('#stage')
    var $player1 = $('#player1')
    var $player2 = $('#player2')
    var $bullet_life_box1 = $('.bullet_life_box1')
    var $bullet_life_box2 = $('.bullet_life_box2')
    var $timer = $('.timer')
    var timing

    // 左右移動一格距離
    var space = 30

    // 重力加速度
    var gravity = 0.5

    // 開始的設定
    var go

    // 選擇遊戲模式
    gamestart()

    function gamestart() {
        var $div = $('<div>')
        $div.addClass('gamestart_display')
        var $game1 = $('<div>')
        $game1.addClass('game1')
        $game1.html('速殺模式')
        var $game2 = $('<div>')
        $game2.addClass('game2')
        $game2.html('無限死鬥')
        $div.append($game1)
        $div.append($game2)
        $stage.append($div)

        // 典籍進入速殺模式
        $('.game1').on('click', function() {
            go = initialize1()
            $('.gamestart_display').remove()
        })

        // 典籍進入第二個遊戲
        $('.game2').on('click', function() {
            go = initialize2()
            $('.gamestart_display').remove()
        })


        // 初始化一些兩個模式都要用的常數
        // 初始玩家位置
        $player1.css('left', $stage.width() / 5)
        $player1.css('top', $stage.height() - $player1.height())
        $player2.css('left', $stage.width() * 4 / 5)
        $player2.css('top', $stage.height() - $player2.height())

        // 玩家可以跳
        $player1.data('can_jump', true)
        $player2.data('can_jump', true)
        $player1.data('can_left', true)
        $player2.data('can_left', true)
        $player1.data('can_right', true)
        $player2.data('can_right', true)
            // 玩家正在往上?
        $player1.data('moving_up', false)
        $player2.data('moving_up', false)

        // 玩家在平台上?
        $player1.data('on_plat', true)
        $player2.data('on_plat', true)

        // 玩家y方向速度初始為零
        $player1.data('vy', 0)
        $player2.data('vy', 0)

        // 玩家是否面向右邊
        $player1.data('face_right', true)
        $player2.data('face_right', false)

        // 設定player1,2的重力場
        var drop1 = setInterval(drop1_func, 1000 / 60)
        var drop2 = setInterval(drop2_func, 1000 / 60)

        // 清理跑到外界的子彈
        var clean_bullet = setInterval(clean_bullet_func, 1000 / 10)

        // 隨機選platform模式
        // 兩種模式都需要 所以放外面
        random_choose_platform()



    }



    // 初始化：把第一個模式所有一開始的設定丟在這裡
    // 有些是屬於速殺模式的 有些速殺跟死鬥都通用的 之後把它拿出來獨立放
    function initialize1() {
        // player初始5顆子彈
        $player1.data('bullet_amount', 5)
        $player2.data('bullet_amount', 5)

        // 上方子彈庫1 子彈庫2
        // $stage.append('<div class="bulletbox1"></div>')
        // $stage.append('<div class="bulletbox2"></div>')

        // 給初始子彈
        for (let i = 0; i < $player1.data('bullet_amount'); i++) {
            $bullet_life_box1.append('<div class="bulletbar1"></div>')
        }
        for (let i = 0; i < $player2.data('bullet_amount'); i++) {
            $bullet_life_box2.append('<div class="bulletbar2"></div>')
        }

        // 判斷子彈打到敵人
        var get_hit = setInterval(get_hit_func_mode1, 1000 / 60)

        // 設timer
        $timer.html(60)
        timing = setInterval(timing_func, 1000)


        // 設定玩家移動
        $(document).keydown(function(event) {
            var x1 = parseInt($player1.css('left'))
            var y1 = parseInt($player1.css('top'))
            var x2 = parseInt($player2.css('left'))
            var y2 = parseInt($player2.css('top'))

            switch (event.keyCode) {
                // player1向左 A
                case 65:
                    if ($player1.data('can_left') == true) {
                        move_left($player1)
                    }
                    break

                    // player1向右 D
                case 68:
                    if ($player1.data('can_right') == true) {
                        move_right($player1)
                    }
                    break

                    // player1向上跳 W
                case 87:
                    if ($player1.data('can_jump') == true) {
                        jump($player1)
                    }
                    break

                    // player1射擊 空白健
                case 32:
                    if ($player1.data('bullet_amount') > 0) {
                        shoot1()
                    }
                    break


                    // player2向左
                case 37:
                    if ($player2.data('can_left') == true) {
                        move_left($player2)
                    }
                    break

                    // player2向右
                case 39:
                    if ($player2.data('can_right') == true) {
                        move_right($player2)
                    }
                    break

                    // player2向上跳
                case 38:
                    if ($player2.data('can_jump') == true) {
                        jump($player2)
                    }
                    break

                    // player2射子彈 Enter
                case 13:
                    if ($player2.data('bullet_amount') > 0) {
                        shoot2()
                    }
                    break


            }

        })

    }



    function initialize2() {
        // player初始5條命
        $player1.data('life_amount', 5)
        $player2.data('life_amount', 5)

        // 上方血條1 血條2
        // 給初始子彈
        for (let i = 0; i < $player1.data('life_amount'); i++) {
            $bullet_life_box1.append('<div class="lifebar"></div>')
        }
        for (let i = 0; i < $player2.data('life_amount'); i++) {
            $bullet_life_box2.append('<div class="lifebar"></div>')
        }

        // 判斷子彈打到敵人
        var get_hit = setInterval(get_hit_func_mode2, 1000 / 60)



        // 設定玩家移動2
        $(document).keydown(function(event) {
            var x1 = parseInt($player1.css('left'))
            var y1 = parseInt($player1.css('top'))
            var x2 = parseInt($player2.css('left'))
            var y2 = parseInt($player2.css('top'))

            switch (event.keyCode) {
                // player1向左 A
                case 65:
                    if ($player1.data('can_left') == true) {
                        move_left($player1)
                    }
                    break

                    // player1向右 D
                case 68:
                    if ($player1.data('can_right') == true) {
                        move_right($player1)
                    }
                    break

                    // player1向上跳 W
                case 87:
                    if ($player1.data('can_jump') == true) {
                        jump($player1)
                    }
                    break

                    // player1射擊 空白健
                case 32:
                    shoot1_mode2()
                    break


                    // player2向左
                case 37:
                    if ($player2.data('can_left') == true) {
                        move_left($player2)
                    }
                    break

                    // player2向右
                case 39:
                    if ($player2.data('can_right') == true) {
                        move_right($player2)
                    }
                    break

                    // player2向上跳
                case 38:
                    if ($player2.data('can_jump') == true) {
                        jump($player2)
                    }
                    break

                    // player2射子彈 Enter
                case 13:
                    shoot2_mode2()
                    break


            }

        })

    }




    // 隨機製造platform
    function random_choose_platform() {
        var lucky = Math.random() * 10
        if (lucky >= 5) {
            make_odd_platform_func()
        } else {
            make_even_platform_func()
        }
    }

    // 隨機設定platform位置  從上往下 2 1 2 1
    function make_odd_platform_func() {
        var plat_array = $('.platform')
        var delete_number = plat_array.length - 1
        delete plat_array[delete_number]
        var x1, x2, x3, x4, x5, x6

        x1 = Math.floor(Math.random() * 700)
        $(plat_array[0]).css('top', 560)
        $(plat_array[0]).css('left', x1)

        x2 = Math.floor(Math.random() * 700)
        $(plat_array[1]).css('top', 420)
        $(plat_array[1]).css('left', x2)


        x3 = x2 + 50
        while (x3 > x2 - 300 && x3 < x2 + 300) {
            x3 = Math.floor(Math.random() * 700)
            $(plat_array[2]).css('top', 420)
            $(plat_array[2]).css('left', x3)
        }

        x4 = Math.floor(Math.random() * 700)
        $(plat_array[3]).css('top', 280)
        $(plat_array[3]).css('left', x4)


        x5 = Math.floor(Math.random() * 700)
        $(plat_array[4]).css('top', 140)
        $(plat_array[4]).css('left', x5)


        x6 = x5 + 50
        while (x6 > x5 - 300 && x6 < x5 + 300) {
            x6 = Math.floor(Math.random() * 700)
            $(plat_array[5]).css('top', 140)
            $(plat_array[5]).css('left', x6)
        }

    }



    // 隨機設定platform位置  從上往下 1 2 1 2
    function make_even_platform_func() {
        var plat_array = $('.platform')
        var delete_number = plat_array.length - 1
        delete plat_array[delete_number]
        var x1, x2, x3, x4, x5, x6

        x1 = Math.floor(Math.random() * 700)
        $(plat_array[0]).css('top', 560)
        $(plat_array[0]).css('left', x1)

        x2 = x1 + 50
        while (x2 > x1 - 300 && x2 < x1 + 300) {
            x2 = Math.floor(Math.random() * 700)
            $(plat_array[1]).css('top', 560)
            $(plat_array[1]).css('left', x2)
        }

        x3 = Math.floor(Math.random() * 700)
        $(plat_array[2]).css('top', 420)
        $(plat_array[2]).css('left', x3)

        x4 = Math.floor(Math.random() * 700)
        $(plat_array[3]).css('top', 280)
        $(plat_array[3]).css('left', x4)

        x5 = x4 + 50
        while (x5 > x4 - 300 && x5 < x4 + 300) {
            x5 = Math.floor(Math.random() * 700)
            $(plat_array[4]).css('top', 280)
            $(plat_array[4]).css('left', x5)
        }

        x6 = Math.floor(Math.random() * 700)
        $(plat_array[5]).css('top', 140)
        $(plat_array[5]).css('left', x5)
    }





    // 讓player向左
    function move_left($player) {
        $player.data('can_left', false)
        $player.data('face_right', false)
        var left_time = 0

        function one_left_func() {
            left_time += 1
            if (left_time > 60) {
                $player.data('can_left', true)
                clearInterval(one_left)
            }
            var px = parseInt($player.css('left'))
            if (px <= 0) {
                px = 0
            } else {
                $player.css('left', px - 2)
            }
        }
        var one_left = setInterval(one_left_func, 50 / 60)

    }



    // 讓player向右
    function move_right($player) {
        $player.data('can_right', false)
        $player.data('face_right', true)
        var right_time = 0

        function one_right_func() {
            right_time += 1
            if (right_time > 60) {
                $player.data('can_right', true)
                clearInterval(one_right)
            }
            var px = parseInt($player.css('left'))
            if (px >= $stage.width() - $player.width()) {
                px = $stage.width() - $player.width()
            } else {
                $player.css('left', px + 2)
            }
        }
        var one_right = setInterval(one_right_func, 50 / 60)
    }



    // 讓player往上跳
    function jump($player) {
        $player.data('can_jump', false)
        $player.data('moving_up', true)
            // var go_down = false
        var speed_y = 20

        function up_func() {
            var py = parseInt($player.css('top'))
            if (speed_y > 0 && $player.data('moving_up') == true) {
                $player.css('top', py - speed_y)
                speed_y -= 1
            } else if (speed_y <= 0 && $player.data('moving_up') == true) {

                clearInterval(up)
                $player.data('moving_up', false)
            }


        }
        var up = setInterval(up_func, 1000 / 60)
    }


    //    normalize 讓他往下掉 掉到平台上可以站  new!!!!!each 不向loop 試著用loop然後用n計數
    function drop1_func() {
        px = parseInt($player1.css('left')) + $player1.width() / 2
        py = parseInt($player1.css('top'))
        var plat_array = $('.platform')
        var n = 0
        var index
        for (let i = 0; i < plat_array.length; i++) {
            var $platform = $(plat_array[i])
            plat_left_border = parseInt($platform.css('left'))
            plat_right_border = parseInt($platform.css('left')) + $platform.width()
            plat_y = parseInt($platform.css('top'))
            dist_p_plat = Math.abs(py - plat_y)
            if (py < plat_y && dist_p_plat <= $player1.height() && $player1.data('moving_up') == false && px >= plat_left_border - 10 && px <= plat_right_border + 10) {
                n += 1
                index = i
                    // console.log('碰到')
            }
        }
        if (n == 1) {
            $player1.data('on_plat', true)
            $player1.data('can_jump', true)
            $player1.data('vy', 0)
            $player1.css('top', parseInt($(plat_array[index]).css('top')) - $player1.height())
                // console.log('1')
        } else {
            $player1.data('on_plat', false)
                // console.log('2')
        }


        if ($player1.data('moving_up') == false && $player1.data('on_plat') == false) {
            // console.log('dd')
            var vy = $player1.data('vy')
            $player1.css('top', py + vy)
            $player1.data('vy', vy + 0.5)
        }


    }



    function drop2_func() {
        px = parseInt($player2.css('left')) + $player2.width() / 2
        py = parseInt($player2.css('top'))
        var plat_array = $('.platform')
        var n = 0
        var index
        for (let i = 0; i < plat_array.length; i++) {
            var $platform = $(plat_array[i])
            plat_left_border = parseInt($platform.css('left'))
            plat_right_border = parseInt($platform.css('left')) + $platform.width()
            plat_y = parseInt($platform.css('top'))
            dist_p_plat = Math.abs(py - plat_y)
            if (py < plat_y && dist_p_plat <= $player2.height() && $player2.data('moving_up') == false && px >= plat_left_border - 10 && px <= plat_right_border + 10) {
                n += 1
                index = i
                    // console.log('碰到')
            }
        }
        if (n == 1) {
            $player2.data('on_plat', true)
            $player2.data('can_jump', true)
            $player2.data('vy', 0)
            $player2.css('top', parseInt($(plat_array[index]).css('top')) - $player2.height())
                // console.log('1')
        } else {
            $player2.data('on_plat', false)
                // console.log('2')
        }


        if ($player2.data('moving_up') == false && $player2.data('on_plat') == false) {
            // console.log('dd')
            var vy = $player2.data('vy')
            $player2.css('top', py + vy)
            $player2.data('vy', vy + 0.5)
        }


    }


    // player1的射擊
    function shoot1() {
        var bullet_amount = $player1.data('bullet_amount')
        $player1.data('bullet_amount', bullet_amount - 1)
        remove_bar1()
        px = parseInt($player1.css('left'))
        py = parseInt($player1.css('top'))
        $stage.append('<div class="bullet bullet1"></div>')
        var $bullet = $stage.find('.bullet1:last')
            // 面相左邊的射擊
        if ($player1.data('face_right') == false) {
            $bullet.css('left', px - $bullet.width())
            $bullet.css('top', py + $player1.height() / 2 - $bullet.height() / 2)

            // 讓子彈動起來
            bullet_go_left = setInterval(bullet_go_left_func, 1000 / 60)

            function bullet_go_left_func() {
                bx = parseInt($bullet.css('left'))
                $bullet.css('left', bx - 8)
            }
        }
        // 面相右邊的射擊
        else {
            $bullet.css('left', px + $player1.width())
            $bullet.css('top', py + $player1.height() / 2 - $bullet.height() / 2)
                // 讓子彈動起來
            bullet_go_right = setInterval(bullet_go_right_func, 1000 / 60)

            function bullet_go_right_func() {
                bx = parseInt($bullet.css('left'))
                $bullet.css('left', bx + 8)
            }
        }

    }




    // player2的射擊
    function shoot2() {
        var bullet_amount = $player2.data('bullet_amount')
        $player2.data('bullet_amount', bullet_amount - 1)
        remove_bar2()
        px = parseInt($player2.css('left'))
        py = parseInt($player2.css('top'))
        $stage.append('<div class="bullet bullet2"></div>')
        var $bullet = $stage.find('.bullet2:last')
            // 面相左邊的射擊
        if ($player2.data('face_right') == false) {
            $bullet.css('left', px - $bullet.width())
            $bullet.css('top', py + $player2.height() / 2 - $bullet.height() / 2)

            // 讓子彈動起來
            bullet_go_left = setInterval(bullet_go_left_func, 1000 / 60)

            function bullet_go_left_func() {
                bx = parseInt($bullet.css('left'))
                $bullet.css('left', bx - 8)
            }
        }
        // 面相右邊的射擊
        else {
            $bullet.css('left', px + $player2.width())
            $bullet.css('top', py + $player2.height() / 2 - $bullet.height() / 2)
                // 讓子彈動起來
            bullet_go_right = setInterval(bullet_go_right_func, 1000 / 60)

            function bullet_go_right_func() {
                bx = parseInt($bullet.css('left'))
                $bullet.css('left', bx + 8)
            }
        }

    }

    // 隨時清理掉跑到邊界外的子彈
    function clean_bullet_func() {
        $stage.find('.bullet').each(function() {
            var bx = parseInt($(this).css('left'))
            if (bx <= -$(this).width() || bx >= $stage.width()) {
                $(this).remove()
            }
        })
    }





    // 判斷子彈打到敵人
    function get_hit_func_mode1() {
        // player1有沒有被bullet2打
        $stage.find('.bullet2').each(function() {
            px = parseInt($player1.css('left')) + $player1.width() / 2
            py = parseInt($player1.css('top')) + $player1.height() / 2
            bx = parseInt($(this).css('left')) + $(this).width() / 2
            by = parseInt($(this).css('top')) + $(this).height() / 2
            if (Math.abs(px - bx) <= $player1.width() / 2 && by >= py - $player1.width() / 2 - $(this).height() / 2 && by <= py + $player1.height() / 2 - $(this).height() / 2) {
                $(this).remove()
                var fade_player1 = setInterval(function() {
                    var opa = $player1.css('opacity')
                    $player1.css('opacity', opa - 0.1)
                    if (opa == 0.1) {
                        $player1.remove()
                        clearInterval(fade_player1)
                        game_over()
                    }
                }, 1000 / 10)


            }
        })

        // player2有沒有被bullet1打
        $stage.find('.bullet1').each(function() {
            px = parseInt($player2.css('left')) + $player2.width() / 2
            py = parseInt($player2.css('top')) + $player2.height() / 2
            bx = parseInt($(this).css('left')) + $(this).width() / 2
            by = parseInt($(this).css('top')) + $(this).height() / 2
            if (Math.abs(px - bx) <= $player2.width() / 2 && by >= py - $player2.width() / 2 - $(this).height() / 2 && by <= py + $player2.height() / 2 - $(this).height() / 2) {
                $(this).remove()
                var fade_player2 = setInterval(function() {
                    var opa = $player2.css('opacity')
                    $player2.css('opacity', opa - 0.1)
                    if (opa == 0.1) {
                        $player2.remove()
                        clearInterval(fade_player2)
                        game_over()
                    }
                }, 1000 / 10)
            }
        })
    }



    // 移除子彈褲子彈
    function remove_bar1() {
        $bullet_life_box1.find('.bulletbar1:last').remove()
    }

    function remove_bar2() {
        $bullet_life_box2.find('.bulletbar2:last').remove()
    }




    // 計時器啟動


    function timing_func() {
        var time = parseInt($timer.html())
        if (time == 0) {
            game_over()
        } else {
            $timer.html(time - 1)
        }
    }


    // 遊戲結束(跳出結束畫面、按一下重新開始遊戲)
    function game_over() {
        clearTimeout(go)
        clearInterval(timing)
        var $div = $('<div>')
        $div.addClass('gameover_text')
        $div.html('Game Over')
        $stage.append('<div class="gameover_display"></div>')
        $('.gameover_display').css('opacity', 0.95)
        $('.gameover_display').append($div)
        $player1.data('can_jump', false)
        $player2.data('can_jump', false)
        $player1.data('can_left', false)
        $player2.data('can_left', false)
        $player1.data('can_right', false)
        $player2.data('can_right', false)
            // 之所以還能跳是因為有個on_plat的函數還在持續把can_jump設成true
            // $('.gameover_display').on('click', function() {
            //     initialize()
            // })

        // 按一下重新整理
        $('.gameover_display').on('click', function() {
            location.reload()
        })


    }






    // 做另外一種遊戲模式
    // 第一種：速殺模式：時間限制 子彈限制 一條命
    // 第二種：無限死鬥：時間不限 子彈有限 三條命 會掉武器


    // 第二個模式的shoot
    // player1的射擊
    function shoot1_mode2() {
        px = parseInt($player1.css('left'))
        py = parseInt($player1.css('top'))
        $stage.append('<div class="bullet bullet1"></div>')
        var $bullet = $stage.find('.bullet1:last')
        $bullet.data('can_hurt', true)
            // 面相左邊的射擊
        if ($player1.data('face_right') == false) {
            $bullet.css('left', px - $bullet.width())
            $bullet.css('top', py + $player1.height() / 2 - $bullet.height() / 2)

            // 讓子彈動起來
            bullet_go_left = setInterval(bullet_go_left_func, 1000 / 60)

            function bullet_go_left_func() {
                bx = parseInt($bullet.css('left'))
                $bullet.css('left', bx - 8)
            }
        }
        // 面相右邊的射擊
        else {
            $bullet.css('left', px + $player1.width())
            $bullet.css('top', py + $player1.height() / 2 - $bullet.height() / 2)
                // 讓子彈動起來
            bullet_go_right = setInterval(bullet_go_right_func, 1000 / 60)

            function bullet_go_right_func() {
                bx = parseInt($bullet.css('left'))
                $bullet.css('left', bx + 8)
            }
        }

    }




    // player2的射擊
    function shoot2_mode2() {
        px = parseInt($player2.css('left'))
        py = parseInt($player2.css('top'))
        $stage.append('<div class="bullet bullet2"></div>')
        var $bullet = $stage.find('.bullet2:last')
        $bullet.data('can_hurt', true)
            // 面相左邊的射擊
        if ($player2.data('face_right') == false) {
            $bullet.css('left', px - $bullet.width())
            $bullet.css('top', py + $player2.height() / 2 - $bullet.height() / 2)

            // 讓子彈動起來
            bullet_go_left = setInterval(bullet_go_left_func, 1000 / 60)

            function bullet_go_left_func() {
                bx = parseInt($bullet.css('left'))
                $bullet.css('left', bx - 8)
            }
        }
        // 面相右邊的射擊
        else {
            $bullet.css('left', px + $player2.width())
            $bullet.css('top', py + $player2.height() / 2 - $bullet.height() / 2)
                // 讓子彈動起來
            bullet_go_right = setInterval(bullet_go_right_func, 1000 / 60)

            function bullet_go_right_func() {
                bx = parseInt($bullet.css('left'))
                $bullet.css('left', bx + 8)
            }
        }

    }



    // 第二個模式的判斷子彈打到敵人
    function get_hit_func_mode2() {
        // player1有沒有被bullet2打
        $stage.find('.bullet2').each(function() {
            px = parseInt($player1.css('left')) + $player1.width() / 2
            py = parseInt($player1.css('top')) + $player1.height() / 2
            bx = parseInt($(this).css('left')) + $(this).width() / 2
            by = parseInt($(this).css('top')) + $(this).height() / 2
            if (Math.abs(px - bx) <= $player1.width() / 2 && by >= py - $player1.width() / 2 - $(this).height() / 2 && by <= py + $player1.height() / 2 - $(this).height() / 2 && $(this).data('can_hurt') == true) {
                $(this).data('can_hurt', false)
                $(this).remove()
                life = $player1.data('life_amount') - 1
                $player1.data('life_amount', life)
                remove_life1()
            }

            if ($player1.data('life_amount') == 0) {
                var fade_player1 = setInterval(function() {
                    var opa = $player1.css('opacity')
                    $player1.css('opacity', opa - 0.1)
                    if (opa == 0.1) {
                        $player1.remove()
                        clearInterval(fade_player1)
                        game_over()
                    }
                }, 1000 / 10)
            }
        })

        // player2有沒有被bullet1打
        $stage.find('.bullet1').each(function() {
            px = parseInt($player2.css('left')) + $player2.width() / 2
            py = parseInt($player2.css('top')) + $player2.height() / 2
            bx = parseInt($(this).css('left')) + $(this).width() / 2
            by = parseInt($(this).css('top')) + $(this).height() / 2
            if (Math.abs(px - bx) <= $player2.width() / 2 && by >= py - $player2.width() / 2 - $(this).height() / 2 && by <= py + $player2.height() / 2 - $(this).height() / 2 && $(this).data('can_hurt') == true) {
                $(this).data('can_hurt', false)
                $(this).remove()
                life = $player2.data('life_amount') - 1
                $player2.data('life_amount', life)
                remove_life2()
            }

            if ($player2.data('life_amount') == 0) {
                var fade_player2 = setInterval(function() {
                    var opa = $player2.css('opacity')
                    $player2.css('opacity', opa - 0.1)
                    if (opa == 0.1) {
                        $player2.remove()
                        clearInterval(fade_player2)
                        game_over()
                    }
                }, 1000 / 10)
            }
        })
    }


    // 被射到時移除生命
    function remove_life1() {
        console.log('ccc')
        $bullet_life_box1.find('.lifebar:last').remove()
    }

    function remove_life2() {
        $bullet_life_box2.find('.lifebar:last').remove()
    }



})