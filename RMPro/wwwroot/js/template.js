$(document).ready(function () {
    // Toggle close class on hamburger-menu click
    $('.hamburger-menu').click(function () {
        $('aside').toggleClass('close');
        // Loop through all DataTable instances and redraw them
        $.fn.dataTable.tables().forEach(function (table) {
            $(table).DataTable().draw();
        });

      //  $('.dataTables_scrollHeadInner').css('width', '100%');
      //  $('.cell-border').css('width', '100%');
     
    });

    // Toggle active class and slide menu dropdown on menu click
    $('.menu').click(function () {

        $(this).siblings('.menu').removeClass('active');
        $(this).addClass('active');
        $(this).next().siblings('.menu-dropdown').children('.sub-menu').slideUp();
        $(this).next('.menu-dropdown').children('.sub-menu').slideToggle();
        $(this).next().siblings('.menu-dropdown').children('.sub-menu').children('.menu').removeClass('active');
    });
});