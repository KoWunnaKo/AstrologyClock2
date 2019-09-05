window.addEventListener('load', function load() {
    window.removeEventListener('load', load, false);

    var canvas = document.createElement('canvas'),
        ctx    = canvas.getContext('2d'),
        signs  = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'],
        colors = {
            blue   : '#0061ea',
            green  : '#009c54',
            red    : '#ff2424',
            yellow : '#fbbc05'
        }, radius, date, day, sign;

    document.body.appendChild(canvas);
    window.addEventListener('resize', resize);
    resize();

    (function drawFrame() {
        requestAnimationFrame(drawFrame);
        date = new Date();
        getSign();
        drawFace();
        drawNumerals();
        drawTime();
    })();

    function resize() {
        radius = getCircleRadius(20);
        ctx.canvas.width  = window.innerWidth;
        ctx.canvas.height = window.innerHeight;
        ctx.translate(canvas.width / 2, canvas.height / 2);
    }

    function getCircleRadius(padding) {
        if (window.innerWidth < window.innerHeight) {
            return Math.round((window.innerWidth / 2) - padding);
        } else {
            return Math.round((window.innerHeight / 2) - padding);
        }
    }

    function drawFace() {
        let angle;
        // Clear canvas
        ctx.fillStyle = '#fff';
        ctx.fillRect(-canvas.width, -canvas.height, canvas.width * 2, canvas.height * 2);
        // Stellated dodecahedron inner rings; Eye of the Sahara
        ctx.lineWidth   = radius * .01;
        ctx.strokeStyle = colors.yellow;
        ctx.beginPath();
        ctx.arc(0, 0, radius * .14, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.strokeStyle = colors.red;
        ctx.beginPath();
        ctx.arc(0, 0, radius * .1, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.strokeStyle = colors.blue;
        ctx.beginPath();
        ctx.arc(0, 0, radius * .06, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.strokeStyle = colors.green;
        ctx.beginPath();
        ctx.arc(0, 0, radius * .022, 0, 2 * Math.PI);
        ctx.stroke();
        // Stellated dodecahedron
        ctx.lineWidth = radius * .01;
        for (let i = 0; i < 12; i++) {
            if (i == 0 || i == 4 || i == 8) {
                ctx.strokeStyle = colors.yellow;
            } else if (i == 1 || i == 5 || i == 9) {
                ctx.strokeStyle = colors.blue;
            } else if (i == 2 || i == 6 || i == 10) {
                ctx.strokeStyle = colors.red;
            } else {
                ctx.strokeStyle = colors.green;
            }
            ctx.beginPath();
            ctx.rotate(i * Math.PI / 6);
            ctx.moveTo(radius * .36, 0);
            ctx.rotate(1.0471975511965976);
            ctx.lineTo(-radius * .36, 0);
            ctx.stroke();
            ctx.rotate(-(i * Math.PI / 6));
            ctx.rotate(-1.0471975511965976);
        }
        // Indices for signs
        ctx.strokeStyle = '#eee';

        for (let i = 0; i < 12; i++) {
            ctx.beginPath();
            angle = (i + .5) * Math.PI / 6;
            ctx.rotate(angle);
            ctx.moveTo(radius * .4, 0);
            ctx.lineTo(radius * .7, 0);
            ctx.stroke();
            ctx.rotate(-angle);
        }
        // Indices for hours
        for (let i = 0; i < 24; i++) {
            ctx.beginPath();
            angle = (i + .5) * Math.PI / 12;
            ctx.rotate(angle);
            ctx.moveTo(radius * .7, 0);
            ctx.lineTo(radius * .9, 0);
            ctx.stroke();
            ctx.rotate(-angle);
        }
        // Indices for minutes / seconds
        for (let i = 0; i < 60; i++) {
            ctx.beginPath();
            angle = (i + .5) * Math.PI / 30;
            ctx.rotate(angle);
            ctx.moveTo(radius * .9, 0);
            ctx.lineTo(radius, 0);
            ctx.stroke();
            ctx.rotate(-angle);
        }
        // Rings
        ctx.lineWidth   = radius * .01;
        ctx.strokeStyle = colors.blue;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.strokeStyle = colors.yellow;
        ctx.beginPath();
        ctx.arc(0, 0, radius * .4, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.strokeStyle = colors.red;
        ctx.beginPath();
        ctx.arc(0, 0, radius * .7, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.strokeStyle = colors.green;
        ctx.beginPath();
        ctx.arc(0, 0, radius * .9, 0, 2 * Math.PI);
        ctx.stroke();
    }

    function drawNumerals() {
        let hour        = date.getHours(),
            minute      = date.getMinutes(),
            angle;
        ctx.textBaseline = 'middle';
        ctx.textAlign    = 'center';
        // 12 signs
        ctx.font = radius * 0.12 + 'px Astro';
        ctx.beginPath();
        for (let i = 1; i < 13; i++) {
            angle = i * Math.PI / 6;
            if (i == 1 || i == 5 || i == 9) {
                ctx.fillStyle = colors.red;
            } else if (i == 2 || i == 6 || i == 10) {
                ctx.fillStyle = colors.green;
            } else if (i == 3 || i == 7 || i == 11) {
                ctx.fillStyle = colors.yellow;
            } else {
                ctx.fillStyle = colors.blue;
            }
            if (i == currentSign) {
                // ctx.fillStyle = colors.yellow;
                ctx.globalAlpha = 1;
            } else if (currentSign % 2 == i % 2) {
                // ctx.fillStyle = '#aaa';
                ctx.globalAlpha = 0.7;
            } else {
                // ctx.fillStyle = '#ddd';
                ctx.globalAlpha = 1;
                ctx.fillStyle   = '#ddd';
            }
            ctx.rotate(angle);
            ctx.translate(0, -radius * 0.55);
            ctx.rotate(-angle);
            ctx.fillText(signs[i - 1], 0, 0);
            ctx.rotate(angle);
            ctx.translate(0, radius * 0.55);
            ctx.rotate(-angle);
        }
        // 24 hours
        ctx.globalAlpha = 1;
        ctx.font        = radius * 0.06 + 'px arial';
        ctx.fillStyle   = '#ddd';
        ctx.beginPath();
        for (let i = 1; i < 25; i++) {
            angle = i * Math.PI / 12;
            ctx.fillStyle = (i === ((hour === 0) ? 24 : hour)) ? colors.red : '#ddd';
            ctx.rotate(angle);
            ctx.translate(0, -radius * 0.8);
            ctx.rotate(-angle);
            ctx.fillText(i, 0, 0);
            ctx.rotate(angle);
            ctx.translate(0, radius * 0.8);
            ctx.rotate(-angle);
        }
        // 60 minutes / seconds
        ctx.font = radius * 0.04 + 'px arial';
        ctx.beginPath();
        for (let i = 1; i < 61; i++) {
            angle = i * Math.PI / 30;
            ctx.fillStyle = (i === ((minute === 0) ? 60 : minute)) ? colors.green : '#ddd';
            ctx.rotate(angle);
            ctx.translate(0, -radius * 0.95);
            ctx.rotate(-angle);
            ctx.fillText((i < 10) ? '0' + i : i, 0, 0);
            ctx.rotate(angle);
            ctx.translate(0, radius * 0.95);
            ctx.rotate(-angle);
        }
    }

    function drawTime() {
        let hour     = date.getHours(),
            minute   = date.getMinutes(),
            second   = date.getSeconds(),
            millisec = date.getMilliseconds(),
            drawSign;
        // Draw sign hand
        drawSign = ((sign - .5) * Math.PI / 6);
        ctx.strokeStyle = colors.yellow;
        drawHand(ctx, drawSign, radius * 0.4, radius * 0.43, radius * 0.01);
        // Draw hour hand
        hour = ((hour - 0.5) * Math.PI / 12) +
               (minute * Math.PI / (12 * 60)) +
               (second * Math.PI / (720 * 60));
        ctx.strokeStyle = colors.red;
        drawHand(ctx, hour, radius * 0.7, radius * 0.72, radius * 0.01);
        // Draw minute hand
        minute = ((minute - 0.5) * Math.PI / 30) +
                 (second * Math.PI / (30 * 60)) +
                 (millisec * Math.PI / (30 * 60000));
        ctx.strokeStyle = colors.green;
        drawHand(ctx, minute, radius * 0.9, radius * 0.915, radius * 0.01);
        // Draw second hand
        second = ((second - 0.5) * Math.PI / 30) + (millisec * Math.PI / (30 * 1000));
        ctx.strokeStyle = colors.blue;
        drawHand(ctx, second, radius * 0.99, radius, radius * 0.01);
    }

    function drawHand(ctx, pos, start, end, width) {
        ctx.lineWidth = width;
        ctx.lineCap   = 'round';
        ctx.beginPath();
        ctx.rotate(pos);
        ctx.moveTo(0, -start);
        ctx.lineTo(0, -end);
        ctx.stroke();
        ctx.rotate(-pos);
    }

    function getSign() {
        if (day != date.getDate()) {
            day       = date.getDate();
            let month = date.getMonth();
            switch (month) {
                case 0: // January
                    if (day <= 19) {
                        // Capricon
                        // Dec 22 - Jan 19
                        // 9 (Dec) + 19 (Jan) = 28
                        sign = 10 + ((day + 8) / 28);
                    } else {
                        // Aquarius
                        // Jan 20 - Feb 18
                        // 11 (Jan) + 18 (Feb) = 29
                        sign = 11 + ((day - 20) / 29);
                    }
                    break;
                case 1: // February
                    if (day <= 18) {
                        // Aquarius
                        // Jan 20 - Feb 18
                        // 11 (Jan) + 18 (Feb) = 29
                        sign = 11 + ((day + 10) / 29);
                    } else {
                        // Pisces
                        // Feb 19 - Mar 20
                        // 9/10 (Feb) + 20 (Mar) = 29/30
                        sign = 12 + ((day - 19) / (isLeapYear(date.getYear()) ? 29 : 30));
                    }
                    break;
                case 2:  // March
                    if (day <= 20) {
                        // Pisces
                        // Feb 19 - Mar 20
                        // 9/10 (Feb) + 20 (Mar) = 29/30
                        let leapYear = isLeapYear(date.getYear());
                        sign = 12 + ((day + (leapYear ? 8 : 9)) / (leapYear ? 29 : 30));
                    } else {
                        // Aries
                        // Mar 21 - Apr 19
                        // 10 (Mar) + 19 (Apr) = 29
                        sign = 1 + ((day - 21) / 29);
                    }
                    break;
                case 3: // April
                    if (day <= 19) {
                        // Aries
                        // Mar 21 - Apr 19
                        // 10 (Mar) + 19 (Apr) = 29
                        sign = 1 + ((day + 9) / 29);
                    } else {
                        // Taurus
                        // Apr 20 - May 20
                        // 10 (Apr) + 20 (May) = 30
                        sign = 2 + ((day - 20) / 30);
                    }
                    break;
                case 4: // May
                    if (day <= 20) {
                        // Taurus
                        // Apr 20 - May 20
                        // 10 (Apr) + 20 (May) = 30
                        sign = 2 + ((day + 9) / 30);
                    } else {
                        // Gemini
                        // May 21 - Jun 20
                        // 10 (May) + 20 (Jun) = 30
                        sign = 3 + ((day - 21) / 30);
                    }
                    break;
                case 5: // June
                    if (day <= 20) {
                        // Gemini
                        // May 21 - Jun 20
                        // 10 (May) + 20 (Jun) = 30
                        sign = 3 + ((day + 9) / 30);
                    } else {
                        // Cancer
                        // Jun 21 - Jul 22
                        // 9 (Jun) + 22 (Jul) = 31
                        sign = 4 + ((day - 21) / 31);
                    }
                    break;
                case 6: // July
                    if (day <= 22) {
                        // Cancer
                        // Jun 21 - Jul 22
                        // 9 (Jun) + 22 (Jul) = 31
                        sign = 4 + ((day + 8) / 31);
                    } else {
                        // Leo
                        // Jul 23 - Aug 22
                        // 7 (Jul) + 22 (Aug) = 29
                        sign = 5 + ((day - 23) / 29);
                    }
                    break;
                case 7:  // August
                    if (day <= 22) {
                        // Leo
                        // Jul 23 - Aug 22
                        // 7 (Jul) + 22 (Aug) = 29
                        sign = 5 + ((day + 6) / 29);
                    } else {
                        // Virgo
                        // Aug 23 - Sep 22
                        // 8 (Aug) + 22 (Sep) = 30
                        sign = 6 + ((day - 23) / 30);
                    }
                    break;
                case 8: // September
                    if (day <= 22) {
                        // Virgo
                        // Aug 23 - Sep 22
                        // 8 (Aug) + 22 (Sep) = 30
                        sign = 6 + ((day + 7) / 30);
                    } else {
                        // Libra
                        // Sep 23 - Oct 22
                        // 8 (Sep) + 22 (Oct) = 30
                        sign = 7 + ((day - 23) / 30);
                    }
                    break;
                case 9: // October
                    if (day <= 22) {
                        // Libra
                        // Sep 23 - Oct 22
                        // 8 (Sep) + 22 (Oct) = 30
                        sign = 7 + ((day + 7) / 30);
                    } else {
                        // Scorpio
                        // Oct 23 - Nov 21
                        // 8 (Oct) + 21 (Nov) = 29
                        sign = 8 + ((day - 23) / 29);
                    }
                    break;
                case 10: // November
                    if (day <= 21) {
                        // Scorpio
                        // Oct 23 - Nov 21
                        // 8 (Oct) + 21 (Nov) = 29
                        sign = 8 + ((day + 7) / 29);
                    } else {
                        // Sagittarius
                        // Nov 22 - Dec 21
                        // 8 (Nov) + 21 (Dec) = 29
                        sign = 9 + ((day - 22) / 29);
                    }
                    break;
                case 11: // December
                    if (day <= 21) {
                        // Sagittarius
                        // Nov 22 - Dec 21
                        // 8 (Nov) + 21 (Dec) = 29
                        sign = 9 + ((day + 7) / 29);
                    } else {
                        // Capicorn
                        // Dec 22 - Jan 19
                        // 9 (Dec) + 19 (Jan) = 28
                        sign = 10 + ((day - 22) / 28);
                    }
            }
            currentSign = Math.floor(sign);
        }
    }

    function isLeapYear(year) {
        return (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) ? true : false;
    }

}, true);
