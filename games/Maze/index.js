$(document).ready(function() {

    var $place = $('.place')
    var $player = $('#player')
    var can_move_left = true
    var can_move_right = true
    var can_move_top = true
    var can_move_bottom = true
    var can_left
    var can_right
    var can_top
    var can_bottom
    var cover_radius = 100


    // 初始player位置
    $player.css('top', 312)
    $player.css('left', 2)


    $(document).keydown(function(event) {
        var x = parseInt($player.css('left'))
        var y = parseInt($player.css('top'))

        if (event.keyCode == 37) {
            if (can_move_left) {
                $player.css('left', x - 30)
            }
        } else if (event.keyCode == 38) {
            if (can_move_top) {
                $player.css('top', y - 30)
            }
        } else if (event.keyCode == 39) {
            if (can_move_right) {
                $player.css('left', x + 30)
            }

        } else if (event.keyCode == 40) {
            if (can_move_bottom) {
                $player.css('top', y + 30)
            }
        }
        // console.log(x + ',' + y)
        // switch (event.keyCode) {
        //     case 37:
        //         if (can_move_left) {
        // $player.css('left', x - 30)
        // }
        //         break
        //     case 38:
        //         if (can_move_top) {
        //             $player.css('top', y - 30)
        //         }
        //         break
        //     case 39:
        //         if (can_move_right == true) {
        //             $player.css('left', x + 30)
        //         }
        //         break
        //     case 40:
        //         if (can_move_bottom) {
        //             $player.css('top', y + 30)
        //         }
        //         break
        // }
    })



    var wall_array = $('.wall')

    function loop_func() {
        can_left = wall_array.length
        can_right = wall_array.length
        can_top = wall_array.length
        can_bottom = wall_array.length
        for (let i = 0; i < wall_array.length; i++) {
            determine_touch_wall($(wall_array[i]))
        }

        // 能否往左
        if (can_left == wall_array.length) {
            can_move_left = true
        } else {
            can_move_left = false
        }

        // 能否往右
        if (can_right == wall_array.length) {
            can_move_right = true
        } else {
            can_move_right = false
        }

        // 能否往上
        if (can_top == wall_array.length) {
            can_move_top = true
        } else {
            can_move_top = false
        }

        // 能否往下
        if (can_bottom == wall_array.length) {
            can_move_bottom = true
        } else {
            can_move_bottom = false
        }


        // 讓黑色屏幕移動
        make_cover_func()
    }

    // function loop_func() {
    //     $place.find('.wall').each(function() {
    //         determine_touch_wall($(this))
    //     })
    // }
    // 改成用for loop去跑看看每個wall?
    // 再去查一次each的用法

    var loop = setInterval(loop_func, 1000 / 30)





    // 判別玩家是否碰到牆壁
    function determine_touch_wall(wall) {
        var x = parseInt($player.css('left')) + $player.width() / 2
        var y = parseInt($player.css('top')) + $player.height() / 2
        var wall_left_border = parseInt(wall.css('left'))
        var wall_right_border = parseInt(wall.css('left')) + wall.width()
        var wall_top_border = parseInt(wall.css('top'))
        var wall_bottom_border = parseInt(wall.css('top')) + wall.height()
        var wall_center_x = (wall_left_border + wall_right_border) / 2
        var wall_center_y = (wall_top_border + wall_bottom_border) / 2
            // 判定在牆的上下左右
        if (x < wall_left_border) {
            // 在左邊
            if (Math.abs(x - wall_center_x) <= $player.width() / 2 + wall.width() / 2 + 5 && y >= wall_top_border && y <= wall_bottom_border) {
                can_right -= 1
            }
        } else if (x > wall_right_border) {
            // 在右邊
            if (Math.abs(x - wall_center_x) <= $player.width() / 2 + wall.width() / 2 + 5 && y >= wall_top_border && y <= wall_bottom_border) {
                can_left -= 1
            }
        } else if (y < wall_top_border) {
            // 在上面
            if (Math.abs(y - wall_center_y) <= $player.height() / 2 + wall.height() / 2 + 5 && x >= wall_left_border && x <= wall_right_border) {
                can_bottom -= 1
            }
        } else if (y > wall_bottom_border) {
            // 在下面
            if (Math.abs(y - wall_center_y) <= $player.height() / 2 + wall.height() / 2 + 5 && x >= wall_left_border && x <= wall_right_border) {
                can_top -= 1
            }
        }

        // 卡在邊邊縫隙的
        else if (x < wall_center_x) {
            // 在左邊
            if (Math.abs(x - wall_center_x) <= $player.width() / 2 + wall.width() / 2 && y >= wall_top_border && y <= wall_bottom_border) {
                can_right -= 1
            }
        } else if (x > wall_center_x) {
            // 在右邊
            if (Math.abs(x - wall_center_x) <= $player.width() / 2 + wall.width() / 2 && y >= wall_top_border && y <= wall_bottom_border) {
                can_left -= 1
            }
        } else if (y < wall_center_y) {
            // 在上面
            if (Math.abs(y - wall_center_y) <= $player.height() / 2 + wall.height() / 2 && x >= wall_left_border && x <= wall_right_border) {
                can_bottom -= 1
            }
        } else if (y > wall_center_y) {
            // 在下面
            if (Math.abs(y - wall_center_y) <= $player.height() / 2 + wall.height() / 2 && x >= wall_left_border && x <= wall_right_border) {
                can_top -= 1
            }
        }

    }


    // 讓黑色屏幕隨著玩家而移動
    function make_cover_func() {
        var x = parseInt($player.css('left')) + $player.width() / 2
        var y = parseInt($player.css('top')) + $player.height() / 2

        // 設定cover1
        var $cover1 = $('.cover1')
        $cover1.css('left', 0)
        $cover1.css('top', 0)
        $cover1.css('width', x - cover_radius)
        $cover1.css('height', 738)

        // 設定cover2
        var $cover2 = $('.cover2')
        $cover2.css('left', x - cover_radius)
        $cover2.css('top', 0)
        $cover2.css('width', 2 * cover_radius)
        $cover2.css('height', y - cover_radius)

        // 設定cover3
        var $cover3 = $('.cover3')
        $cover3.css('left', x - cover_radius)
        $cover3.css('top', y + cover_radius)
        $cover3.css('width', 2 * cover_radius)
        $cover3.css('height', 738 - y - cover_radius)

        // 設定cover4
        var $cover4 = $('.cover4')
        $cover4.css('left', x + cover_radius)
        $cover4.css('top', 0)
        $cover4.css('width', 738 - x - cover_radius)
        $cover4.css('height', 738)
    }
})