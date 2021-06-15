(function(animations) {
    animations.snake.step1 = function (animate, svg) {
        return window.requestAnimationFrame(function (timestamp) {
            if (animate.start == undefined) animate.start = timestamp;
            animate.elapsed = timestamp - animate.start;

            var percent = (animate.elapsed / (animate.duration / 2)) * 100;
            var offset = (((100 - percent) / 100) * 250).toFixed(2);
            svg.setAttribute("stroke-dashoffset", offset);

            if (animate.elapsed >= animate.duration) {
                animate.elapsed = 0;
                animate.start = undefined;
                animate.snake.step1(animate, svg);
            } else {
                animate.snake.step1(animate, svg);
            }
          });
    }
})(Loady.animations);
