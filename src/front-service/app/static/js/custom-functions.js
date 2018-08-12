function addPage(page_type, page_name){

    $.ajax({
        url: '/addpage/',
        type: 'POST',
        data: JSON.stringify({"type":page_type, "name":page_name}),
        contentType: 'application/json;charset=UTF-8',
        dataType: 'text json',
        statusCode: {
            200: function(xhr){
                page_content = `<div class="wrapper d-flex align-items-center py-2 border-bottom" id="`
										+xhr['id']+
										`"><img class="img-sm rounded-circle" src="`
										+xhr['image_url']+
										`" alt="profile">
										<div class="wrapper ml-3">
										<a href="`
										+xhr['url']+
										`" style="display:block;" target="_blank">
											<h6 class="ml-1 mb-1">`
										    +xhr['name']+
										    `</h6></a>
											<small class="text-muted mb-0">`
											+xhr['post_count']+` Post,   Since `+xhr['added_since']
											+`</small>
										</div>
										<div class="ml-auto">
											<button class="btn social-btn btn-danger btn-rounded btn-xs" onclick="showSwal('warning-message-and-cancel', '`
											+xhr['name']+
											`')">X</button>
										</div>
									</div>`;
				if(page_type==='fb'){
				    $('#fbAddPanel').after('<p class="text-success" id="responseMessage">'+xhr['message']+'</p>');
				}
				else if(page_type==='tw'){
				    $('#twAddPanel').after('<p class="text-success" id="responseMessage">'+xhr['message']+'</p>');
				}
				else{
				    $('#newsAddPanel').after('<p class="text-success" id="responseMessage">'+xhr['message']+'</p>');
				}

                $('#responseMessage').after(page_content);
                $('#responseMessage').delay(2000).queue(function() { $(this).remove(); });
                },
            400: function(xhr){
                res_obj = JSON.parse(xhr.responseText);
                if(page_type==='fb'){
				    $('#fbAddPanel').after('<p class="text-success" id="responseMessage">'+res_obj['message']+'</p>');
				}
				else if(page_type==='tw'){
				    $('#twAddPanel').after('<p class="text-success" id="responseMessage">'+res_obj['message']+'</p>');
				}
				else{
				    $('#newsAddPanel').after('<p class="text-success" id="responseMessage">'+res_obj['message']+'</p>');
				}
                $('#responseMessage').delay(2000).queue(function() { $(this).remove(); });
            },
            401: function(xhr){
                window.location.replace('http://localhost:5051/login/');
            }
        }
    })

}

function deletePage(page_type, page_name, page_id){
    $.ajax({
        url: '/deletepage/',
        type: 'POST',
        data: JSON.stringify({"type":page_type, "name":page_name}),
        contentType: 'application/json;charset=UTF-8',
        dataType: 'text json',
        statusCode: {
            200: function(xhr){
            console.log(xhr);
                if(page_type==='fb'){
				    $('#fbAddPanel').after('<p class="text-success" id="responseMessage">'+xhr['message']+'</p>');
				}
				else if(page_type==='tw'){
				    $('#twAddPanel').after('<p class="text-success" id="responseMessage">'+xhr['message']+'</p>');
				}
				else{
				    $('#newsAddPanel').after('<p class="text-success" id="responseMessage">'+xhr['message']+'</p>');
				}

                $('#'+page_id).remove()
                console.log('#'+page_id)
                console.log(page_type)
                $('#responseMessage').delay(2000).queue(function() { $(this).remove(); });
            },
            400:function(xhr){
                res_obj = JSON.parse(xhr.responseText);
                if(page_type==='fb'){
				    $('#fbAddPanel').after('<p class="text-success" id="responseMessage">'+res_obj['message']+'</p>');
				}
				else if(page_type==='tw'){
				    $('#twAddPanel').after('<p class="text-success" id="responseMessage">'+res_obj['message']+'</p>');
				}
				else{
				    $('#newsAddPanel').after('<p class="text-success" id="responseMessage">'+res_obj['message']+'</p>');
				}
                $('#responseMessage').delay(2000).queue(function() { $(this).remove(); });
            },
            401:function(xhr){
                window.location.replace('http://localhost:5051/login/');
            }
            }
        })
}

function dashboardFilter(fieldName){
    $.ajax({
        url: '/dropdown/',
        type: 'POST',
        data: JSON.stringify({"platform":$('#selectPlatform').find(":selected").text(), "page":$('#selectPage').find(":selected").text(),
                                "fromDate":$('#datepicker-popup').datepicker('getDate')}),
        contentType: 'application/json;charset=UTF-8',
        dataType: 'text json',
        statusCode: {
            200: function(xhr){

                if(fieldName=='platform'){
                    console.log(xhr);
                    $('#selectPage').find('option').remove();
                    $('#selectPage').append('<option value="AL">all</option>');
                    for(i=0; i<xhr['page_list'].length; i++){
                        $('#selectPage').append('<option value="AL">'+xhr['page_list'][i]+'</option>');
                    }
                    $('#datepicker-popup').datepicker('destroy');
                    $('#datepicker-popup').datepicker({
                        todayHighlight: true,
                        startDate: xhr['end_date']
                    });
                    $('#datepicker-popup-to').datepicker('destroy');
                    $('#datepicker-popup-to').datepicker({
                        todayHighlight: true,
                        startDate: xhr['from_date']
                    });
                }
                if(fieldName=='page'){
                    console.log(xhr);
                    $('#datepicker-popup').datepicker('destroy');
                    $('#datepicker-popup').datepicker({
                        todayHighlight: true,
                        startDate: xhr['end_date']
                    });
                    $('#datepicker-popup-to').datepicker('destroy');
                    $('#datepicker-popup-to').datepicker({
                        todayHighlight: true,
                        startDate: xhr['from_date']
                    });
                }
                if(fieldName=='fromDate'){
                    console.log(xhr);
                    $('#datepicker-popup-to').datepicker('remove');
                    $('#datepicker-popup-to').datepicker({
                        todayHighlight: true,
                        startDate: xhr['from_date']
                    });
                }
            },
            401: function(xhr){
                window.location.replace('http://localhost:5051/login/');
            }
            }
        })
}

function dashboardAjax(){
    $.ajax({
        url: '/dashboardajax/',
        type: 'POST',
        data: JSON.stringify({"platform":$('#selectPlatform').find(":selected").text(), "page":$('#selectPage').find(":selected").text(),
                                "date_range":[$('#datepicker-popup').datepicker('getDate'), $('#datepicker-popup-to').datepicker('getDate')]}),
        contentType: 'application/json;charset=UTF-8',
        dataType: 'text json',
        statusCode: {
            200: function(xhr){
                console.log(xhr);
                //First chart -chart count afterwards in verticle order
                $("#trendData1").text(xhr['post_trend']['allCount']);
                $("#trendData2").text(xhr['post_trend']['negPercent']);
                $("#growth-chart").text(xhr['post_trend']['neg_all_zip']);
                $("#growth-chart").sparkline('html', {
                    enableTagOptions: true,
                    type: 'bar',
                    width: '100%',
                    height: '50',
                    fillColor: 'false',
                    stackedBarColor: ['#497dc6', '#FF44A4'],
                    barWidth: 8,
                    barSpacing: 4,
                    chartRangeMin: 0
                  });
                //second chart vertically
                $("#disturbingPage1").text('Out of '+xhr['page_info']['fb']['count'].toString()+' pages,'+
                xhr['page_info']['tw']['count'].toString()+' handles and '+xhr['page_info']['news']['count'].toString()+
                ' blogs');
                var lineChartCanvas = $("#dashboard-lineChart-2-type").get(0).getContext("2d");
                var lineChart = new Chart(lineChartCanvas, {
                type: 'bar',
                data: {
                  labels: ["Fb", "Tw", "News"],
                  datasets: [{
                    data: [xhr['sentiment_dist']['fb']['neg']+xhr['sentiment_dist']['fb']['pos'],
                             xhr['sentiment_dist']['tw']['neg']+xhr['sentiment_dist']['tw']['pos'],
                             xhr['sentiment_dist']['news']['neg']+xhr['sentiment_dist']['news']['pos']],
                    pointBackgroundColor: "#fffff",
                    pointBorderWidth: 1,
                    backgroundColor: [
                      '#3B579D',
                      '#1DA1F2',
                      '#FF5722'
                    ],
                    borderColor: [
                      '#ffffff'
                    ],
                    borderWidth: 1
                  }]
                },
                options: {
                  responsive: true,
                  maintainAspectRatio: false,
                  legend: {
                    display: false,
                    position:'left'
                  },
                  tooltips: {
                    enabled: true
                  },
                  layout: {
                    padding: {
                      top: 5,
                      bottom: 5
                    }
                  }
                 }
                });
                //third chart vertically
                $('#disturbingPage2').text(xhr['audience']['allAudienceCount'].toString()+' people reached across '+
                (xhr['page_info']['fb']['count']+xhr['page_info']['tw']['count']+
                xhr['page_info']['news']['count']).toString()+' monitored accounts')
                var lineChartCanvas = $("#dashboard-lineChart-3").get(0).getContext("2d");
                var lineChart = new Chart(lineChartCanvas, {
                type: 'line',
                data: {
                  labels: xhr['post_trend']['date_array'],
                  datasets: [{
                    data: xhr['audience']['allAudience'],
                    pointBackgroundColor: "#fff",
                    pointBorderWidth: 1,
                    backgroundColor: [
                      'rgba(0,0,0,0)'
                    ],
                    borderColor: [
                      '#fff'
                    ],
                    borderWidth: 1
                  }]
                },
                options: {
                  responsive: true,
                  maintainAspectRatio: true,
                  scales: {
                    xAxes: [{
                      gridLines: {
                        drawBorder: false,
                        display: false
                      },
                      ticks: {
                        display: false,
                      }
                    }],
                    yAxes: [{
                      gridLines: {
                        drawBorder: false,
                        display: false,
                      },
                      ticks: {
                        display: false,
                      }
                    }]
                  },
                  legend: {
                    display: false
                  },
                  tooltips: {
                    enabled: true
                  },
                  layout: {
                    padding: {
                      top: 5,
                      bottom: 5
                    }
                  }
                }
                });
                //fourth chart vertically
                $('#pageImpactData').text('Out of '+xhr['page_impact']['negPostCount'].toString()+' disturbing posts reaching '+
                xhr['page_impact']['negReach'].toString()+' audience');
                $('#dashboard-donut-chart').html('');
                $(function() {
                    var total = 62;
                    var browsersChart = Morris.Donut({
                      element: 'dashboard-donut-chart',
                      data: xhr['page_impact']['impact'],
                      resize: true,
                      colors: ['#03a9f3', '#00c292', '#dddddd'],
                      formatter: function(value, data) {
                        return Math.floor(value / total * 100) + '%';
                      }
                    });

                    browsersChart.options.data.forEach(function(label, i) {
                      var legendItem = $('<span></span>').text(label['label']).prepend('<span>&nbsp;</span>');
                      legendItem.find('span')
                        .css('backgroundColor', browsersChart.options.colors[i]);
                      $('#legend').append(legendItem)
                    });
                  });

                //fifth chart vertically
                $('#pageImpact2').text(Math.floor(xhr['page_impact']['dailyGrowth']));
                $('#pageImpact3').text(Math.floor(xhr['page_impact']['growth']).toString()+'%');
                if(xhr['page_impact']['growth']>0){
                    $('#pageImpact4').text('Increased than last Week');
                }
                else{
                    $('#pageImpact4').text('Decreased than last Week');
                }
                //sixth chart
                $('#audienceDist').text(xhr['audience']['negAudienceCount'].toString()+' Out of '+xhr['audience']['allAudienceCount'].toString()+
                ' audience are disturbed');
                var lineChartCanvas = $("#dashboard-lineChart-2-page").get(0).getContext("2d");
                var lineChart = new Chart(lineChartCanvas, {
                type: 'line',
                data: {
                  labels: xhr['post_trend']['date_array'],
                  datasets: [{
                    data: xhr['audience']['distAudience'],
                    pointBackgroundColor: "#fffff",
                    pointBorderWidth: 1,
                    backgroundColor: [
                      '#ff0000'
                    ],
                    borderColor: [
                      '#ff0000'
                    ],
                    borderWidth: 1,
                    fill:false
                  }]
                },
                options: {
                  responsive: true,
                  maintainAspectRatio: true,
                  scales: {
                    xAxes: [{
                      gridLines: {
                        drawBorder: false,
                        display: true
                      },
                      ticks: {
                        display: false,
                      }
                    }],
                    yAxes: [{
                      gridLines: {
                        drawBorder: false,
                        display: true,
                      },
                      ticks: {
                        display: false,
                      }
                    }]
                  },
                  legend: {
                    display: false
                  },
                  tooltips: {
                    enabled: true
                  },
                  layout: {
                    padding: {
                      top: 5,
                      bottom: 5
                    }
                  }
                }
                });
                //Disturbing post
                $('#distPost').text(xhr['post_trend']['negPercent'].toString()+' of the total post are disturbing');
                $("#dashboard-lineChart-2x").html('');
                var lineChartCanvas = $("#dashboard-lineChart-2x").get(0).getContext("2d");
                var lineChart = new Chart(lineChartCanvas, {
                type: 'bar',
                data: {
                  labels: xhr['disturbing_posts']['label'],
                  datasets: [{
                    data: xhr['disturbing_posts']['data'],
                    pointBackgroundColor: "#fffff",
                    pointBorderWidth: 1,
                    backgroundColor: [
                      '#FF74A5',
                      '#FF74A5',
                      '#FF74A5',
                      '#FF74A5',
                      '#FF74A5',
                      '#FF74A5',
                      '#FF74A5',
                      '#FF74A5',
                      '#FF74A5',
                      '#FF74A5',
                      '#FF74A5',
                      '#FF74A5'
                    ],
                    borderColor: [
                      '#f49e42'
                    ],
                    borderWidth: 1
                  }]
                },
                options: {
                  responsive: true,
                  maintainAspectRatio: true,
                  scales: {
                    xAxes: [{
                      gridLines: {
                        drawBorder: true,
                        display: true
                      },
                      ticks: {
                        display: false,
                      }
                    }],
                    yAxes: [{
                      gridLines: {
                        drawBorder: true,
                        display: true,
                      },
                      ticks: {
                        display: true,
                      }
                    }]
                  },
                  legend: {
                    display: false
                  },
                  tooltips: {
                    enabled: true
                  },
                  layout: {
                    padding: {
                      top: 5,
                      bottom: 5
                    }
                  }
                }
                });
                //Disturbing topics
                //disturbing posts
                $('#distPostList').html('');
                $('#distPostList').append('<h6 class="card-title text-dark mb-0">Disturbing Posts</h6>');
                $('#distPostList').append('<small class="text-muted">'+xhr['alarming_posts']['disturbedPeople'].toString()+
                'People disturbed by these 10 posts</small>');
                var html = '';
                for(i=0;i<xhr['alarming_posts']['posts'].length;i++){
                    html = html+`<div class="d-lg-flex flex-row text-center text-lg-left border-bottom py-3">`;
                    if(xhr['alarming_posts']['posts'][i]['img_url']!=''){
                       html = html+`<a href="`+xhr['alarming_posts']['posts'][i]['link']+`" style="display:block;" target="_blank">`+
												`<img src="`+xhr['alarming_posts']['posts'][i]['img_url']+`" class="img-lg rounded" alt="image"/></a>`;


                    }


                    html = html+`<div class="ml-lg-3"><div class="timeline-footer d-flex align-items-center"><a href="`+
                    xhr['alarming_posts']['posts'][i]['link']+`" style="display:block;" target="_blank">`;
                    if(xhr['alarming_posts']['posts'][i]['domain']=='facebook'){
                        html = html+`<i class="fa fa-facebook-square mr-2" style="color:#4267B2;"></i><span class="h6">`+
                        xhr['alarming_posts']['posts'][i]['author']+`</span>`;
                    }

                    else if(xhr['alarming_posts']['posts'][i]['domain']=='twitter'){
                        html=html+`<i class="fa fa-twitter-square mr-2" style="color:#1DA1F2B2;"></i><span class="h6">`+
                        xhr['alarming_posts']['posts'][i]['author']+`</span>`;
                    }

                    else{
                        html=html+`<i class="fa fa-ge mr-2" style="color:#F48024;"></i><span class="h6">`+xhr['alarming_posts']['posts'][i]['author']+`</span></a>`;
                    }


                    html = html+`</a><small class="ml-auto">`+xhr['alarming_posts']['posts'][i]['created_at'].slice(5,16)+`</small></div><p class="text-muted">`;
                    html = html+xhr['alarming_posts']['posts'][i]['content']+`</p><div class="timeline-footer d-flex align-items-center">
                                                <i class="fa fa-thumbs-up mr-2" style="color:#B6B3B5;"></i>
                                                <span>`;
                    html = html+xhr['alarming_posts']['posts'][i]['shares'].toString()+`</span>
                                                <span>&nbsp;&nbsp;&nbsp;</span>
                                                <i class="icon-share mr-2" style="color:#B6B3B5;"></i>
                                                <span>`;
                    html = html+xhr['alarming_posts']['posts'][i]['comments_count'].toString()+`</span>
                                                <div class="badge badge-pill badge-outline-success ml-auto">&nbsp;&nbsp;`;
                    html = html+xhr['alarming_posts']['posts'][i]['sentiment']+`&nbsp;&nbsp;</div>
                                            </div>
                                        </div>
									</div>`;

                }
                $('#distPostList').append(html);
                //trending keywords

            }
            }
        })
}