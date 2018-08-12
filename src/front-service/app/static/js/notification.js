var source = new EventSource('/notification');
source.onmessage = function (event) {
     alert(event.data);
};