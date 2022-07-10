$(document).ready(function() {

    // 物件
    var $stage = $('#stage')
    var $player = $('#player')

    // 能否控制player
    var can_control_player = true

    // 移動一格的間距
    var space = 40

    // 不同的速度
    var speed_x_array = [3, 4, 5]

    // 不同的初始高度
    var init_y_array = [180, 200, 220]

    // 不同的顏色
    // var color_array = ['pink', 'red', 'blue', 'purple', 'brown', 'orange', 'yellow', 'bisque', 'burlywood']

    // 隨機產生顏色
    var color_index = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f']

    function create_random_color() {
        // 先讓color index洗牌一下
        for (let i = 0; i < 50; i++) {
            var num = Math.floor(Math.random() * 16)
            temp = color_index[0]
            color_index[0] = color_index[num]
            color_index[num] = temp
        }
        var color_string = '#'
        for (let i = 0; i < 6; i++) {
            color_string = color_string + color_index[i]
        }
        return color_string

    }

    // 球的直徑
    var ball_diameter = 100

    // 初始球的位置
    var init_x = -(ball_diameter - 1)

    // 重力加速度
    var gravity = 0.5

    // y方向初始速度
    // var speed_y = 0

    // y方向往下還是往上
    // var moving_down = true
    // var moving_up = false

    // stage左右邊界
    var left_border = 0
    var right_border = $stage.width()


    // 球的數量
    var ball_amount = 15
    var current_ball_amount = 0

    // 球與玩家碰撞時之距離
    var collide_distance = ball_diameter / 2 + $player.height() / 2 - 3

    // 計分
    var score = 0
    var score_accumulate = 1


    // 初始玩家位置
    $player.css('left', $stage.width() / 2 - $player.width() / 2)
    $player.css('top', $stage.height() - $player.height())




    // 讓玩家左右移動
    $(document).keydown(function(event) {
        var x = parseInt($player.css('left'))
        var y = parseInt($player.css('top'))
        if (can_control_player == true) {
            switch (event.keyCode) {
                case 37:
                    if (x > space) {
                        $player.css('left', x - space)
                    }
                    break

                case 39:
                    if (x < $stage.width() - $player.width() - space) {
                        $player.css('left', x + space)
                    }
                    break
            }
        }
    })


    // 每隔一秒做一顆球，總共三顆
    function make_ball_func() {
        if (current_ball_amount < ball_amount) {
            $stage.append('<div class="ball"></div>')
            $stage.find('.ball:last').css('background', create_random_color())
            $stage.find('.ball:last').data('init', false)
            $stage.find('.ball:last').data('go_left', false)
            $stage.find('.ball:last').data('go_right', true)
            $stage.find('.ball:last').data('moving_down', true)
            $stage.find('.ball:last').data('moving_up', false)
            $stage.find('.ball:last').data('speed_y', 0)
                // $stage.find('.ball:last').data('enter_well', false)
            current_ball_amount += 1

        } else {
            clearInterval(make_ball_func)
        }
    }

    var make_ball = setInterval(make_ball_func, 1000)

    // 初始位置
    var initialize_ball = setInterval(function() {
        var ball_array = $('.ball')
        for (let i = 0; i < ball_array.length; i++) {
            if ($(ball_array[i]).data('init') == false) {
                $(ball_array[i]).removeData('init')
                $(ball_array[i]).css('left', init_x)
                $(ball_array[i]).css('top', init_y_array[i])
                    // $(ball_array[i]).data('speed_y')
                    // console.log($(ball_array[i]).data('speed_y'))
            }
            if (i == ball_amount - 1) {
                clearInterval(initialize_ball)
                    // console.log('清除')
            }
        }
    }, 1000 / 10)


    // 讓每個球動的函數
    function every_ball_func() {
        var ball_array = $('.ball')
        for (let i = 0; i < ball_array.length; i++) {
            var $ball = $(ball_array[i])
                // console.log(i, $ball)


            // var go_x = setInterval(move_x, 1000 / 60)
            // var go_y = setInterval(move_y, 1000 / 60)

            function move_x() {
                // var $ball = $('.ball')
                var ball_x = parseInt($ball.css('left'))
                if (ball_x > left_border) {
                    // $ball.data('enter_well')
                }
                // 控制向右
                if ($ball.data('go_right') == true && ball_x < right_border - ball_diameter) {
                    $ball.css('left', ball_x + 3)
                } else if ($ball.data('go_right') == true && ball_x == right_border - ball_diameter) {
                    // console.log('碰到牆壁')
                    $ball.data('go_right', false)
                    $ball.data('go_left', true)
                }
                // 控制向左
                if ($ball.data('go_left') == true && ball_x > left_border) {
                    $ball.css('left', ball_x - 3)
                } else if ($ball.data('go_left') == true && ball_x == left_border) {
                    $ball.data('go_left', false)
                    $ball.data('go_right', true)
                }

                // console.log(ball_x)

            }



            function move_y() {
                // var $ball = $('.ball')
                var ball_y = parseInt($ball.css('top'))
                if (ball_y < $stage.height() - ball_diameter && $ball.data('moving_down') == true) {
                    var temp_speed_y1 = $ball.data('speed_y') + gravity
                        // $ball.data('speed_y') += gravity
                    $ball.data('speed_y', temp_speed_y1)
                    $ball.css('top', ball_y + $ball.data('speed_y'))



                } else if (ball_y >= $stage.height() - ball_diameter && $ball.data('moving_down') == true) {
                    $ball.data('moving_down', false)
                    $ball.data('moving_up', true)
                }


                if (ball_y <= $stage.height() - ball_diameter && $ball.data('moving_up') == true) {
                    var temp_speed_y2 = $ball.data('speed_y') - gravity
                        // $ball.data('speed_y') -= gravity
                    $ball.data('speed_y', temp_speed_y2)
                    $ball.css('top', ball_y - $ball.data('speed_y'))
                }
                if ($ball.data('speed_y') == 0) {
                    $ball.data('moving_up', false)
                    $ball.data('moving_down', true)
                }
                // console.log(ball_y)

            }
            move_x()
            move_y()
        }
    }

    var every_ball = setInterval(every_ball_func, 1000 / 60)



    // 判斷球砸到player
    function player_ball_collide_func() {
        $stage.find('.ball').each(function() {
            var bx = parseInt($(this).css('left')) + $(this).width() / 2
            var by = parseInt($(this).css('top')) + $(this).height() / 2
            var px = parseInt($player.css('left')) + $player.width() / 2
            var py = parseInt($player.css('top')) + $player.height() / 2
            var distance_p_b = Math.sqrt(Math.pow(px - bx, 2) + Math.pow(py - by, 2))
            if (distance_p_b < collide_distance) {
                console.log('碰撞了')
                can_control_player = false
                clearInterval(every_ball)
                clearInterval(count_score)
            }


        })
    }
    var player_ball_collide = setInterval(player_ball_collide_func, 1000 / 30)

    // 記分板
    function count_score_func() {
        score += score_accumulate
        score = Math.floor(score)
        score_accumulate *= 1.01
        $('#score').html(score)
    }

    var count_score = setInterval(count_score_func, 1000 / 10)

})