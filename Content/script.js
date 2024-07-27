const now = new Date();
$('#date-time').dxDateBox({
    type: 'datetime',
    value: now,
    inputAttr: { 'aria-label': 'Date Time' },
});
