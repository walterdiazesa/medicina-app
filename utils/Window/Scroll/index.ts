export const smoothScrollTo = function (
  endX: number,
  endY: number,
  duration: number
) {
  let startX = window.scrollX || window.pageXOffset,
    startY = window.scrollY || window.pageYOffset,
    distanceX = endX - startX,
    distanceY = endY - startY,
    startTime = new Date().getTime();

  // Easing function
  let easeInOutQuart = function (
    time: number,
    from: number,
    distance: number,
    duration: number
  ) {
    if ((time /= duration / 2) < 1)
      return (distance / 2) * time * time * time * time + from;
    return (-distance / 2) * ((time -= 2) * time * time * time - 2) + from;
  };

  let timer = window.setInterval(function () {
    let time = new Date().getTime() - startTime,
      newX = easeInOutQuart(time, startX, distanceX, duration),
      newY = easeInOutQuart(time, startY, distanceY, duration);
    if (time >= duration) {
      window.clearInterval(timer);
    }
    window.scrollTo(newX, newY);
  }, 1);
};
