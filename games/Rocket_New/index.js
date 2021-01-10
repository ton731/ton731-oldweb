$(document).ready(function() {

    var $body = $('body'),
        $stage = $('#stage'),
        $player = $('#player'),
        $bulletAmount = $('#bulletAmount'),
        enemy_fall_speed = 3,
        enemy_max_speed = 6,
        enemy_wave = 0,
        enemy_gap = 300,
        player_can_control = true,
        collide_distance = 40,
        bullet_speed = 7,
        bullet_break_distance = 40,
        init_bullet_amount = 3,
        total_bullet_amount = 0,
        weapon_amount_perwave = 2,
        can_drop_weapon,
        weapon_speed = 4,
        eat_weapon_distance = 45,
        bullet_add_amount = 2,
        score = 0,
        score_accumulate = 1,
        mySound,
        protect_radius = 60,
        in_protect = false




    // 播放背景音樂
    // soundManager.setup({
    //     // url: '/path/to/swf-files/',
    //     onready: function() {
    //         mySound = soundManager.createSound({
    //             id: 'aSound',
    //             url: 'Vindicated.mp3'
    //         })
    //         mySound.play();
    //     }

    // })



    // player初始位置
    // $player.css('left', ($stage.width() - $player.width()) / 2 + 'px')
    $player.css('left', 460)
    $player.css('top', $stage.height() - $player.height() + 'px')



    // 控制player上下左右移動
    $(document).keydown(function(event) {
        var x = parseInt($player.css('left'))
        var y = parseInt($player.css('top'))
            // console.log(x + ',' + y)
        if (player_can_control) {
            switch (event.keyCode) {
                case 37:
                    if (x > 10) {
                        $player.css('left', x - 90)
                    }
                    break
                case 38:
                    if (y > 10) {
                        $player.css('top', y - 90)
                    }
                    break
                case 39:
                    if (x < 910) {
                        $player.css('left', x + 90)
                    }
                    break
                case 40:
                    if (y < 640) {
                        $player.css('top', y + 90)
                    }
                    break
                case 32:
                    if (total_bullet_amount > 0) {
                        shoot_func()
                        remove_bullet()

                    }
                    break
                case 13:
                    if (in_protect == false) {
                        make_protect_func()
                        var check_protect = setInterval(check_protect_func, 1000 / 30)
                        in_protect = true
                        break
                    } else {
                        remove_protect_func()
                        in_protect = false
                        break
                    }



            }
        }
    })


    // 產生敵人
    function createEnemy() {
        var pos = [10, 100, 190, 280, 370, 460, 550, 640, 730, 820, 910]
        var enemy_amount = 7
        for (let i = 0; i < 50; i++) {
            var num = Math.floor(Math.random() * 11)
            temp = pos[0]
            pos[0] = pos[num]
            pos[num] = temp
        }

        // console.log(pos)

        for (let i = 0; i < enemy_amount; i++) {
            $stage.append('<div class="model enemy"></div>')
            var $enemy = $stage.find('.enemy:last')
            $enemy.css('left', pos[i])
            $enemy.data('wave', enemy_wave)
        }

        enemy_wave += 1
        can_drop_weapon = true

    }

    createEnemy()



    // 落下動畫和碰撞
    function loop_func() {
        $stage.find('.enemy').each(function() {
            var enemy_y = parseInt($(this).css('top'))

            // 讓他掉下來
            $(this).css('top', enemy_y + enemy_fall_speed)

            // 讓超出去的html element被移除
            if (enemy_y > $stage.height()) {
                // console.log('超過了!')
                $(this).remove()
            }

            // 碰撞：enemy中心跟player中心距離小於碰撞半徑的時候視為碰撞
            var px = parseInt($player.css('left')) + $player.width() / 2
            var py = parseInt($player.css('top')) + $player.height() / 2
            var ex = parseInt($(this).css('left')) + $(this).width() / 2
            var ey = parseInt($(this).css('top')) + $(this).height() / 2
            var distance_p_e = Math.sqrt(Math.pow(px - ex, 2) + Math.pow(py - ey, 2))
            if (distance_p_e < collide_distance) {
                console.log('碰到了')
                clearInterval(loop)
                clearInterval(speedup)
                player_can_control = false
                    // mySound.stop()

            }


        })

        // 生成下一波enemy
        // console.log($stage.find('.enemy:last').css('top'))
        var last_y = parseInt($stage.find('.enemy:last').css('top'))
        if (last_y > enemy_gap) {
            createEnemy()
        }


        // 生成武器
        if (last_y > enemy_gap / 2 && enemy_wave % 5 == 0 && can_drop_weapon == true) {
            var weapon_pos = [10, 100, 190, 280, 370, 460, 550, 640, 730, 820, 910]
            for (let i = 0; i < 50; i++) {
                var num = Math.floor(Math.random() * 11)
                temp = weapon_pos[0]
                weapon_pos[0] = weapon_pos[num]
                weapon_pos[num] = temp
            }
            for (let i = 0; i < weapon_amount_perwave; i++) {
                $stage.append('<div class="weapon"></div>')
                $weapon = $stage.find('.weapon:last')
                $weapon.css('left', weapon_pos[i] + 17.5)

            }
            can_drop_weapon = false
        }

        var weapon_y = parseInt($('.weapon').css('top'))
        $('.weapon').css('top', weapon_y + weapon_speed)

        // 移除超出去的武器
        if (weapon_y > $stage.height()) {
            $('.weapon').remove()
        }

        // 吃到武器
        px = parseInt($player.css('left')) + $player.width() / 2
        py = parseInt($player.css('top')) + $player.height() / 2
        var weapon_array = $('.weapon')
        for (let i = 0; i < weapon_array.length; i++) {
            var wx = parseInt($(weapon_array[i]).css('left')) + $(weapon_array[i]).width() / 2
            var wy = parseInt($(weapon_array[i]).css('top')) + $(weapon_array[i]).height() / 2
            var distance_p_w = Math.sqrt(Math.pow(px - wx, 2) + Math.pow(py - wy, 2))
            if (distance_p_w < eat_weapon_distance) {
                $(weapon_array[i]).remove()
                add_bullet()
            }

        }



    }

    var loop = setInterval(loop_func, 1000 / 120)



    // 速度加速
    function speedup_func() {
        if (enemy_fall_speed >= enemy_max_speed) {
            enemy_fall_speed = enemy_max_speed
        } else {
            enemy_fall_speed *= 1.005
        }
        // console.log(enemy_fall_speed)

        score += score_accumulate
        score = Math.floor(score)
        score_accumulate *= 1.1
        $('#score').html(score)
    }

    var speedup = setInterval(speedup_func, 1000 / 3)



    // 按空白鍵射出子彈
    function shoot_func() {
        $stage.append('<div class="bullet"></div>')
        var $bullet = $stage.find('.bullet:last')
        var current_player_x = parseInt($player.css('left'))
        var current_player_y = parseInt($player.css('top'))
            // console.log(current_player_x, current_player_y)
        $bullet.css('left', current_player_x + $player.width() / 2 - $bullet.width() / 2)
        $bullet.css('top', current_player_y - $bullet.height() / 2)

    }

    function move_check_bullet_func() {

        // 讓子彈往上射出去
        $stage.find('.bullet').each(function() {
            var bullet_y = parseInt($(this).css('top'))
                // console.log(bullet_y)
            $(this).css('top', bullet_y - bullet_speed)

            // 讓超出去的子彈被清除
            if (bullet_y < 10) {
                $(this).remove()
            }

            // 子彈碰撞enemy
            var bx = parseInt($(this).css('left')) + $(this).width() / 2
            var by = parseInt($(this).css('top')) + $(this).height() / 2
            var enemy_array = $('.enemy')
            for (let i = 0; i < enemy_array.length; i++) {
                ex = parseInt($(enemy_array[i]).css('left')) + $(enemy_array[i]).width() / 2
                ey = parseInt($(enemy_array[i]).css('top')) + $(enemy_array[i]).height() / 2
                var distance_b_e = Math.sqrt(Math.pow(bx - ex, 2) + Math.pow(by - ey, 2))
                if (distance_b_e < bullet_break_distance) {
                    $(enemy_array[i]).remove()
                }
            }
        })


        // 防護罩碰到enemy
        var enemy_array = $('.enemy')
        var protect_x = parseInt($('.protect').css('left')) + protect_radius
        var protect_y = parseInt($('.protect').css('top')) + protect_radius
        for (let i = 0; i < enemy_array.length; i++) {
            ex = parseInt($(enemy_array[i]).css('left')) + $(enemy_array[i]).width() / 2
            ey = parseInt($(enemy_array[i]).css('top')) + $(enemy_array[i]).height() / 2
            var distance_protect_e = Math.sqrt(Math.pow(protect_x - ex, 2) + Math.pow(protect_y - ey, 2))
            if (distance_protect_e < protect_radius + $(enemy_array[i]).width() / 2 + 20) {
                console.log('捧到防護罩')
                $(enemy_array[i]).remove()
            }
        }
    }

    var move_check_bullet = setInterval(move_check_bullet_func, 1000 / 120)



    // 填充子彈庫

    // 給初始子彈
    for (let i = 0; i < init_bullet_amount; i++) {
        $bulletAmount.append('<div class="bulletbar"></div>')
        total_bullet_amount++
    }

    // 移除子彈庫裡的子彈
    function remove_bullet() {
        $('.bulletbar:last').remove()
        total_bullet_amount -= 1
    }

    function add_bullet() {
        for (let i = 0; i < bullet_add_amount; i++) {
            $bulletAmount.append('<div class="bulletbar"></div>')
            total_bullet_amount++
        }
    }


    // 生出防護罩
    function make_protect_func() {
        $stage.append('<div class="protect"></div>')
    }

    function check_protect_func() {
        var x = parseInt($player.css('left')) + $player.width() / 2
        var y = parseInt($player.css('top')) + $player.height() / 2
        var $protect = $stage.find('.protect')
        $protect.css('left', x - protect_radius)
        $protect.css('top', y - protect_radius)
        $protect.css('width', 2 * protect_radius)
        $protect.css('height', 2 * protect_radius)
    }

    function remove_protect_func() {
        var $protect = $stage.find('.protect')
        $protect.remove()
    }








})