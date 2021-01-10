function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}



$(document).ready(function() {

    var $body = $('body')
    var $stage = $('#stage')
    var $player = $('#player')
    var $score = $('#score')
    var enemy_fall_speed = 3
    var enemy_fall_max_speed = 15
    var enemy_wave = 0
    var enemy_wave_gap = 300
    var hit_test_r = 30
    var can_control_player = true
    var score = 0
    var score_add = 1
    var loop
    var speedup


    // player初始位置
    // $player.css('left', ($stage.width() - $player.width()) / 2 + 'px')
    // $player.css('top', $stage.height() - $player.height() + 'px')

    // score初始位置
    // $score.css('left', ($stage.width() - $score.width()) - 5 + 'px')
    // $score.css('top', '5px')




    // 左鍵點擊
    $body.click(function() {
        if (can_control_player == true) {
            var x = parseInt($player.css('left'))
            if (x > 10) {
                $player.css('left', x - 100 + 'px')
                    // console.log(x)
            }
        }

    })

    // 右鍵點擊
    $body.contextmenu(function(e) {
        e.preventDefault()
        if (can_control_player == true) {
            var x = parseInt($player.css('left'))
            if (x < 210) {
                $player.css('left', x + 100 + 'px')
                    // console.log(x)
            }

        }

    })


    // 重新開始
    function initGame() {
        enemy_fall_speed = 3
        enemy_wave = 0
        can_control_player = true
        score = 0
        score_add = 1
        $player.css('left', ($stage.width() - $player.width()) / 2 + 'px')
        $player.css('top', $stage.height() - $player.height() + 'px')

        $score.css('left', ($stage.width() - $score.width()) - 5 + 'px')
        $score.css('top', '5px')

        createEnemy()

        loop = setInterval(loop_func, 1000 / 120)
        speedup = setInterval(speedup_func, 1000)

    }

    initGame()



    // 生成障礙物
    function createEnemy() {
        var enemy_pos = [10, 110, 210]
        for (let i = 0; i < 2; i++) {
            $stage.append('<div class="sprite enemy"</div>')
            var $enemy = $stage.find('.enemy:last')
            $enemy.data('wave', enemy_wave)
            var rand_index = getRandomInt(0, enemy_pos.length - 1)
            var enemy_x = enemy_pos.splice(rand_index, 1)[0] //障礙物起始位置
            $enemy.css('left', enemy_x + 'px')
            $enemy.css('top', -($enemy.height()) + 'px')
        }
    }




    // 遊戲結束
    function endGame() {
        clearInterval(loop)
        clearInterval(speedup)

        can_control_player = false
            // 跳出結束畫面
        $stage.append("<div id = 'gameover'>RETRY</div>")
        $gameover = $('#gameover')
        $gameover.css({
            'background': 'black',
            'opacity': '0.7',
            'width': '100%',
            'height': '100%',
            'position': 'relative',
            'color': 'white',
            'line-height': '500px',
            'text-align': 'center',
            'font-size': '35px',
        })
        $gameover.click(function() {
            // $gameover.unbind('click')

            // 清空enemy
            $stage.find('.enemy').remove()

            // 清除retry頁面
            $gameover.remove()

            initGame()
        })
    }



    // 計時器(處理落下動畫和碰撞機制)
    function loop_func() {
        $stage.find('.enemy').each(function() {
            var enemy_y = parseInt($(this).css('top'))

            if (enemy_y > enemy_wave_gap && $(this).data('wave') == enemy_wave) {
                enemy_wave++
                createEnemy()
            }

            var px = parseInt($player.css('left')) + $player.width() / 2
            var py = parseInt($player.css('top')) + $player.height() / 2
            var ex = parseInt($(this).css('left')) + $(this).width() / 2
            var ey = parseInt($(this).css('top')) + $(this).height() / 2
            var p_e_dist = Math.sqrt(Math.pow(px - ex, 2) + Math.pow(py - ey, 2))
            if (hit_test_r * 2 > p_e_dist) {
                endGame()
            }


            if (enemy_y > $stage.height()) {
                $(this).remove()
                return
            }
            $(this).css('top', enemy_y + enemy_fall_speed + 'px')

            $score.html(score)
            score += score_add
            score = parseInt(score)

        })
    }

    // var loop = setInterval(loop_func, 1000 / 60)



    // 每秒增加落下速度
    function speedup_func() {
        console.log(enemy_fall_speed)
        if (enemy_fall_speed >= enemy_fall_max_speed) {
            enemy_fall_speed = 15

        }
        enemy_fall_speed += 0.1
        score_add *= 1.1

    }
    // var speedup = setInterval(speedup_func(), 1000)


    // var speedup = setInterval(function() {
    //     console.log(enemy_fall_speed)
    //     if (enemy_fall_speed >= enemy_fall_max_speed) {
    //         enemy_fall_speed = 15
    //         clearInterval(speedup)
    //     }
    //     enemy_fall_speed += 0.3
    //     score_add *= 1.1

    // }, 1000)

})