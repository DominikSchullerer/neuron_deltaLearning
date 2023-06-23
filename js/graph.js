var x_grid_size = 80;
var y_grid_size = 80;
var x_axis_distance_grid_lines = 6;
var y_axis_distance_grid_lines = 1;
var x_axis_starting_point = { number: 1, suffix: '' };
var y_axis_starting_point = { number: 1, suffix: '' };
var x_axis_scalar = 1
var y_axis_scalar = 1

var canvas = document.getElementById("plotCanvas");
var ctx = canvas.getContext("2d");

var canvas_width = canvas.width;
var canvas_height = canvas.height;

var num_lines_x = Math.floor(canvas_height / y_grid_size);
var num_lines_y = Math.floor(canvas_width / x_grid_size);


function prepare_canvas() {

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines along X-axis
    for (var i = 0; i <= num_lines_x; i++) {
        ctx.beginPath();
        ctx.lineWidth = 1;

        // If line represents X-axis draw in different color
        if (i == x_axis_distance_grid_lines)
            ctx.strokeStyle = "#000000";
        else
            ctx.strokeStyle = "#e9e9e9";

        if (i == num_lines_x) {
            ctx.moveTo(0, y_grid_size * i);
            ctx.lineTo(canvas_width, y_grid_size * i);
        }
        else {
            ctx.moveTo(0, y_grid_size * i + 0.5);
            ctx.lineTo(canvas_width, y_grid_size * i + 0.5);
        }
        ctx.stroke();
    }

    // Draw grid lines along Y-axis
    for (i = 0; i <= num_lines_y; i++) {
        ctx.beginPath();
        ctx.lineWidth = 1;

        // If line represents X-axis draw in different color
        if (i == y_axis_distance_grid_lines)
            ctx.strokeStyle = "#000000";
        else
            ctx.strokeStyle = "#e9e9e9";

        if (i == num_lines_y) {
            ctx.moveTo(x_grid_size * i, 0);
            ctx.lineTo(x_grid_size * i, canvas_height);
        }
        else {
            ctx.moveTo(x_grid_size * i + 0.5, 0);
            ctx.lineTo(x_grid_size * i + 0.5, canvas_height);
        }
        ctx.stroke();
    }

    // Translate to the new origin. Now Y-axis of the canvas is opposite to the Y-axis of the graph. So the y-coordinate of each element will be negative of the actual
    ctx.translate(y_axis_distance_grid_lines * x_grid_size, x_axis_distance_grid_lines * y_grid_size);

    // Ticks marks along the positive X-axis
    for (i = 1; i < (num_lines_y - y_axis_distance_grid_lines+1); i++) {
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#000000";

        // Draw a tick mark 6px long (-3 to 3)
        ctx.moveTo(x_grid_size * i + 0.5, -3);
        ctx.lineTo(x_grid_size * i + 0.5, 3);
        ctx.stroke();

        // Text value at that point
        ctx.font = '12px Arial';
        ctx.textAlign = 'start';
        ctx.fillText(x_axis_starting_point.number * i * x_axis_scalar + x_axis_starting_point.suffix, x_grid_size * i - 2, 15);
    }

    // Ticks marks along the negative X-axis
    for (i = 1; i < y_axis_distance_grid_lines; i++) {
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#000000";

        // Draw a tick mark 6px long (-3 to 3)
        ctx.moveTo(-x_grid_size * i + 0.5, -3);
        ctx.lineTo(-x_grid_size * i + 0.5, 3);
        ctx.stroke();

        // Text value at that point
        ctx.font = '12px Arial';
        ctx.textAlign = 'end';
        ctx.fillText(-x_axis_starting_point.number * i * x_axis_scalar + x_axis_starting_point.suffix, -x_grid_size * i + 3, 15);
    }

    // Ticks marks along the positive Y-axis
    // Positive Y-axis of graph is negative Y-axis of the canvas
    for (i = 1; i < (num_lines_x - x_axis_distance_grid_lines); i++) {
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#000000";

        // Draw a tick mark 6px long (-3 to 3)
        ctx.moveTo(-3, y_grid_size * i + 0.5);
        ctx.lineTo(3, y_grid_size * i + 0.5);
        ctx.stroke();

        // Text value at that point
        ctx.font = '12px Arial';
        ctx.textAlign = 'start';
        ctx.fillText(-y_axis_starting_point.number * i * y_axis_scalar + y_axis_starting_point.suffix, 8, y_grid_size * i + 3);
    }

    // Ticks marks along the negative Y-axis
    // Negative Y-axis of graph is positive Y-axis of the canvas
    for (i = 1; i < x_axis_distance_grid_lines; i++) {
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#000000";

        // Draw a tick mark 6px long (-3 to 3)
        ctx.moveTo(-3, -y_grid_size * i + 0.5);
        ctx.lineTo(3, -y_grid_size * i + 0.5);
        ctx.stroke();

        // Text value at that point
        ctx.font = '12px Arial';
        ctx.textAlign = 'start';
        ctx.fillText(y_axis_starting_point.number * i * y_axis_scalar + y_axis_starting_point.suffix, 8, -y_grid_size * i + 3);
    }
}

function draw_x_line(x_min, x_max, y) {
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "blue";

    ctx.moveTo(x_min * x_grid_size / x_axis_scalar, -y * y_grid_size / y_axis_scalar);
    ctx.lineTo(x_max * x_grid_size / x_axis_scalar, -y * y_grid_size / y_axis_scalar);
    ctx.stroke();
}

function draw_point(x, y, color = "#add8e6") {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x * x_grid_size / x_axis_scalar, -y * y_grid_size / y_axis_scalar, 2, 0, 2 * Math.PI)
    ctx.fill()
    ctx.fillStyle = "#000000";
}

function drawLine(x_start, y_start, x_end, y_end, color = "blue") {
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = color;

    ctx.moveTo(x_start * x_grid_size / x_axis_scalar, -y_start * y_grid_size / y_axis_scalar);
    ctx.lineTo(x_end * x_grid_size / x_axis_scalar, -y_end * y_grid_size / y_axis_scalar);
    ctx.stroke();
}