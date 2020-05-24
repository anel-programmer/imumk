$( document ).ready(function(){
		var typeprice = 'price';
		var arrList = [];
		var vFilter = [];
		
		if ($('input[name="customSwitch"]').is(':checked') && $('input[name="customSwitch"]:checked').val()==1){
				typeprice = 'price';
		} else {
				typeprice = 'priceBonus';
		}
		
		if (arrList.length>0){
			console.log(arrList);
			showList();
     
		
		} else {
			//загрузка данных в формате json с сервера
			$.ajax({
			  type: "POST", // метод HTTP, используемый для запроса	
			  url: "https://krapipl.imumk.ru:8082/api/mobilev1/update", // строка, содержащая URL адрес, на который отправляется запрос
			  data: '',
			  success: function(result){
				  console.log(2);
					console.log(result);
				  	arrList = [];
					for (var i = 0; i < result.items.length; i++) {
						arrList[i] = result.items[i];
					}
					showList();
				},
				error: function(error){
					console.log(1);
					var data = statResult;
					console.log(data);
					arrList = [];
					for (var i = 0; i < data.length; i++) {
						arrList[i] = data[i];
					}
					showList();
				},
								
			  dataType: "json" // тип данных, который вы ожидаете получить от сервера	
			});
					
			
			
		}
		
		
		
		//вывод списка курсов на экран
		function showList(){
			$("div.courses-list").empty();
			$("div.courses-info").empty();
			 
			var showCount = 0;
			if (vFilter['subj']!="" || vFilter['genre']!="" || vFilter['grade']!="" || vFilter['searchval']!=""){
				var mess = '<p class="h4">Результаты поиска:</p><br>';
				$( mess ).appendTo( $(".courses-info")); 
			}
			for (var i = 0; i < arrList.length; i++) {
				
				var vItem = arrList[i];
				
				var re = /\s*;\s*/
				var arrGrade = vItem.grade.split(re);
				var strGrade = '';
				if (arrGrade.length == 1){
					strGrade = arrGrade[0] + " класс";
				}
				else {
					strGrade = arrGrade[0] + "-" + arrGrade[arrGrade.length-1] + " классы";
				}
								
				var vPrice = vItem.price;
				if (typeprice=="priceBonus"){
					 vPrice = vItem.priceBonus+' бонусов';
				}
				else {
					vPrice = vItem.price + ' руб.';
				}
				if (vFilter['subj']!="" && vFilter['subj']!=vItem.subject){
					continue;
				}
				if (vFilter['genre']!="" && vFilter['genre']!=vItem.genre){
					continue;
				}
				if (vFilter['grade']!="" && ($.inArray(vFilter['grade'],arrGrade)==-1)){
					continue;
				}
				if (vFilter['searchval']!="") {
					var itemStr = vItem.title.toLowerCase();
					var searchStr = vFilter['searchval'].toLowerCase();
					if (!itemStr.includes(searchStr)){
						continue;
					}
				}
				
				
				var card = ' <div class="d-flex justify-content-between mx-3">'+
							'<div class="card courses-sci">'+
							'<div class="sci-figure"><img class="card-img-top " src="images/coursecover/'+vItem.courseId+'" alt="'+vItem.title+'"></div>'+
							'<div class="card-body">'+
							'  <p class="card-title">'+vItem.subject+'</p>'+
							'  <p class="card-text">'+strGrade+'</p>'+
							'  <p class="card-text card-genre">'+vItem.genre+'</p>'+
							'	<p class="card-meta"><a href="/offer/-110">Подробнее</a></p>'+
							'</div>'+
							'<div class="card-footer">'+
								'<a href="#" onclick="_try('+vItem.courseId+', '+vItem.title+', '+vItem.status+')" class="btn btn-sm btn-block btn-primary">'+vPrice+'</a>'+
							'</div></div>'+
						  '</div>';
				
			
				 $( card ).appendTo( $(".courses-list")); 
				 showCount = showCount + 1; 
						
						
			 }
			 
			 if (showCount==0){
				  mess = '<p class="h5">Курсы не найдены.</p>';
				$( mess ).appendTo( $(".courses-info")); 
			 }
		};
		
		

		//переключение типа цены рубли или бонусы
		$('input[name="customSwitch"]').on('change',function(){
			
			var value = $('input[name="customSwitch"]:checked').val();
			if (value=='1') {
				typeprice = "price";
			}
			else {
				typeprice = "priceBonus";
			}
			showList();	
		});
		
	 
		//фильтр
	    $("#filterform").on('submit', function(e) {
  						
			vFilter['subj'] = $("#subj").val();
		
			vFilter['genre'] = $("#genre").val();
			
			vFilter['grade'] = $("#grade").val();
			
			vFilter['searchval'] = $("#searchval").val();
			
			showList();
			return false;
		});
		
		
		
		$("#subj").change(function () {
			$("#filterform").submit();
		}).change();
		
		$("#genre").change(function () {
			$("#filterform").submit();
		}).change();
		
		$("#grade").change(function () {
			$("#filterform").submit();
		}).change();
		
		$("#_search").change(function () {
			$("#filterform").submit();
		}).change();
		
		//поиск
		$("#searchform").on('submit', function(e) {
  			vFilter['subj'] = $("#subj").val();
			vFilter['genre'] = $("#genre").val();
			vFilter['grade'] = $("#grade").val();
			vFilter['searchval'] = $("#searchval").val();
			showList();
			return false;
		});
		
			  
			});
