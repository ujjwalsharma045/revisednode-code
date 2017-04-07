app.controller('users' , function($scope , $http , $route , $routeParams ,$location , authen, localStorageService , dateTime , Users , pageTitle){
    	   
   var storageType = localStorageService.getStorageType(); 
   
   $scope.options = {
      language: 'en',
      allowedContent: true,
      entities: false
   };   
   $scope.onReady = function () {
    
   };   
   $scope.content = "";   
   $scope.timeformat = dateTime.showTime();     
   $scope.title = pageTitle;
   
   
   if($route.current.type=="list"){
	    Users.totalUsers($scope);
		
        $scope.user = {
		  searchemail:'',
          searchusername:'',
          searchfirstname:'',
          searchlastname:'',
          limit:5,
          sortfields:'first_name',
          sortfieldtype:'desc',
          age:0,
		  options: {
            ceil: 10,
            floor: 0,
            showTicksValues: true,
          },
		  ids:[]
	    };
		
	   	$scope.selected = [];
		
        $scope.sort = {
		  first_name:'',
          last_name:'',
          email:'',
          username:'' 		  		   
	    };
		
		$scope.current_page = 1;		  
        $scope.totalpages = 0;
		$scope.pages = 0;
		
		$scope.current_page = 1;
          
        if(localStorageService.get('login')=="1"){   
			$http.get('http://127.0.0.1:8081/showusers?limit='+$scope.user.limit+'&sortfield='+$scope.user.sortfields+'&sorttype='+$scope.user.sortfieldtype).then(function(response){
		              console.log(response.data['records']);
					  $scope.users = response.data['records'];
					  $scope.pages = response.data['pages'];                      
                      $scope.totalpages = response.data['totalpages'];
		    });	   
		}	 
		else {
			$location.path("/login");
		}   
   }
    
   if($route.current.type=="view"){  
         
		 $scope.title += ' '+$routeParams.id;
		 
         if(localStorageService.get('login')=="1"){    
			$http.get('http://127.0.0.1:8081/view/'+$routeParams.id).then(function(response){	   
					$scope.user = response.data[0];   	  			
			}); 
		 }
         else {
			$location.path("/login");
		 }		 
   }
       
   $scope.remove = function(id , index){  
        var msg = "Are you sure you want to remove";
		if(window.confirm(msg)){
			if(localStorageService.get('login')=="1"){       
				$http.get('http://127.0.0.1:8081/delete/'+id).then(function(response){
					if(response.data['success']=='1'){
						$scope.users.splice(index , 1); 
						$location.path("/");					
					}						   	 
				});
			}
		}
   }
   
   if($route.current.type=="edit"){   
        
		$scope.title +=' '+$routeParams.id;
		
        if(localStorageService.get('login')=="1"){       
			$http.get('http://127.0.0.1:8081/view/'+$routeParams.id).then(function(response){
				$scope.user = response.data[0];   	  			
			});   
		}
        else {
			$location.path("/login");
		}		
   } 
   
   $scope.edituser = function(){
	   	   	   
	   if(localStorageService.get('login')=="1"){    
		   if($scope.userform.$valid){	   
			  
              var data = {
                first_name: $scope.user.first_name,
                last_name: $scope.user.last_name,
				address: $scope.user.address,
				state: $scope.user.state,
				city: $scope.user.city,
				zipcode: $scope.user.zipcode,
                userid: $routeParams.id,
				dateofbirth: $scope.user.dateofbirth                
			  };
                      
			  var req = {
			    method: 'POST',
			    url: 'http://127.0.0.1:8081/edit/'+$routeParams.id,
			    headers: {
			      'Content-Type': 'application/json'
			    },
			    data: data
			  };

              $http(req).then(function(response){
                console.log(response);
				if(response.data['success']=='1'){
						$location.path("/");
					}
			  },function(response){	      
					
			  });              			 
		   }
		   else {
			  $scope.submitted =true; 
		   } 
	   }
   }   
    
   $scope.adduser = function(){
	   	  	  
	  if(localStorageService.get('login')=="1"){     
	    if($scope.userform.$valid){	   
			
            var data = {
                first_name: $scope.user.first_name,
                last_name: $scope.user.last_name,
                email: $scope.user.email,
                username: $scope.user.username,
                password: $scope.user.password,
                dateofbirth: $scope.user.dateofbirth                
			};
                      
			var req = {
			    method: 'POST',
			    url: 'http://127.0.0.1:8081/adduser',
			    headers: {
			      'Content-Type': 'application/json'
			    },
			    data: data
			};

            $http(req).then(
			  function(response){
                console.log(response);
				if(response.data['success']=='1'){
						$location.path("/");
					}
			  },
			  function(response){	      
					
			  }
			);			
		}
		else {
		    $scope.submitted =true; 	
		} 
	  }
   }
    
   $scope.loginuser = function(){	  
	    $scope.errormessage = '';
	    if($scope.userform.$valid){	   
			
            var data = {                
                username: $scope.user.username,
                password: $scope.user.password                
			};
                      
			var req = {
			    method: 'POST',
			    url: 'http://127.0.0.1:8081/login',
			    headers: {
			      'Content-Type': 'application/json'
			    },
			    data: data
			};

            $http(req).then(
				  function(response){
					    console.log(response);
					    if(response.data['success']=='1'){
							localStorageService.set('login', '1'); 
							$location.path("/");
						}
						else {							
					       $scope.errormessage = "Either Name or salary is incorrect";
						} 
				  },
				  function(response){	      
						
				  }
			);			
		}
		else {
		    $scope.submitted =true; 	
		}	  
   } 

   if($route.current.type=="logout"){    
        $http.get('api/logout.php').then(function(response){	
			if(response.data['success']=='1'){
			    $location.path("/login");
			}
			else {			
				$location.path("/"); 	  			
			}							   	  		
		});         
   }   
   
   $scope.logout = function(){
	   localStorageService.remove('login');
	   $location.path("/login"); 	   
   }
   
   $scope.setPageNo = function(no){
	   $scope.current_page  = no+1;
   }
   
   $scope.searchUser = function(name){
       
	   var data = "";
	   
	   if($scope.user.searchemail){
		  data = data+"email="+$scope.user.searchemail; 
	   }
       
       if($scope.user.age && $scope.user.age>0){
		  if(data!="") data+="&"; 
		  data = data+"age="+$scope.user.age; 
	   }
	   
	   if($scope.user.searchusername){
		  if(data!="") data+="&"; 
		  data = data+"username="+$scope.user.searchusername; 
	   }

       if($scope.user.searchfirstname){
		  if(data!="") data+="&"; 
		  data = data+"first_name="+$scope.user.searchfirstname; 
	   }

       if($scope.user.searchlastname){
		  if(data!="") data+="&"; 
		  data = data+"last_name="+$scope.user.searchlastname; 
	   } 

       var sorttype = "";
	          
	   if(name=="first_name"){
		   if($scope.sortfirst_name=="desc"){
              $scope.sortfirst_name = "asc";			   
			  sorttype = "asc";   	
              $scope.sortReverse = false;			  
		   }
		   else {
			  $scope.sortfirst_name = "desc"; 
			  sorttype = "desc"; 
			  $scope.sortReverse = true; 
		   }
		   
		   $scope.sortfields = "first_name";
		   $scope.sortfieldtype = sorttype;
		   if(data!="") data+="&"; 		   
		   data = data+"sortfield="+name+"&sorttype="+sorttype; 
		   
		   $scope.sortType = 'sortfirstname';	   
		   
	   }
	   else if(name=="last_name"){
		   if($scope.sortlast_name=="desc"){
			  $scope.sortlast_name = "asc"; 
			  sorttype = "asc";
              $scope.sortReverse = false;			  
		   }
		   else {
			  $scope.sortlast_name = "desc"; 
			  sorttype = "desc";
              $scope.sortReverse = true;			  
		   }
		   
		   $scope.sortfields = "last_name";
		   $scope.sortfieldtype = sorttype;
		   if(data!="") data+="&"; 
		   
           data = data+"sortfield="+name+"&sorttype="+sorttype;
		   
           $scope.sortType = 'sortlastname';	   		   
	   }
	   else if(name=="email"){
		   if($scope.sortemail=="desc"){
			  $scope.sortemail = "asc"; 
			  sorttype = "asc";
              $scope.sortReverse = false; 			  
		   }
		   else {
			  $scope.sortemail = "desc"; 
			  sorttype = "desc";
              $scope.sortReverse = true;			  
		   }
		   
		   $scope.sortfields = "email";
		   $scope.sortfieldtype = sorttype;
		   if(data!="") data+="&"; 
		   
		   data = data+"sortfield="+name+"&sorttype="+sorttype;
		   
           $scope.sortType = 'sortemail';	   		   
	   }
	   else if(name=="username"){
		   if($scope.sortusername=="desc"){
			  $scope.sortusername = "asc"; 
			  sorttype = "asc";
              $scope.sortReverse = false;			  
		   }
		   else {
			  $scope.sortusername = "desc"; 
			  sorttype = "desc";
              $scope.sortReverse = true;			  
		   }
		   
		   $scope.sortfields = "username";
		   $scope.sortfieldtype = sorttype;
		   if(data!="") data+="&"; 
		   
		   data = data+"sortfield="+name+"&sorttype="+sorttype;
		   
           $scope.sortType = 'sortusername';	   		   
	   }        
	   else if(name=="dateofbirth"){
		   if($scope.sortdateofbirth=="desc"){
			  $scope.sortdateofbirth = "asc"; 
			  sorttype = "asc";
              $scope.sortReverse = false;			  
		   }
		   else {
			  $scope.sortdateofbirth = "desc"; 
			  sorttype = "desc";
              $scope.sortReverse = true;			  
		   }
		   
		   $scope.sortfields = "dateofbirth";
		   $scope.sortfieldtype = sorttype;
		   if(data!="") data+="&"; 
		   
		   data = data+"sortfield="+name+"&sorttype="+sorttype;
		   
           $scope.sortType = 'sortdateofbirth';	   		   
	   }
	   else {
		   if(data!="") data+="&"; 
		   
		   data = data+"sortfield="+$scope.sortfields+"&sorttype="+$scope.sortfieldtype;
		   
           $scope.sortType = '';	   		   
	   }	
	   
	   if($scope.current_page){
		   if(data!="") data+="&"; 
	       data = data+"page="+$scope.current_page;
	   }
	   
	   if($scope.user.limit){
		  if(data!="") data+="&"; 
		  data = data+"limit="+$scope.user.limit; 
	   }
	   
       $http.get('http://127.0.0.1:8081/showusers?'+data).then(function(response){	  
	       $scope.users = response.data['records'];   	  					   
           $scope.pages = response.data['pages'];           
           $scope.totalpages = response.data['totalpages']; 	   
	   });	
   }

   if($route.current.type=="login"){  
   
        $http.get('http://127.0.0.1:8081/checklogin').then(function(response){	
			if(response.data['authen']=='1'){
				//localStorageService.set('login' , '1');
			    //$location.path("/");
			}										   	  	
		});         
   }  

   $scope.sortlist = function(name){
	   $scope.searchUser(name);
	   /*var sorttype = "";
	   	   	   
	   if(name=="first_name"){
		   if($scope.sortfirst_name=="desc"){
              $scope.sortfirst_name = "asc";			   
			  sorttype = "asc";   			   
		   }
		   else {
			  $scope.sortfirst_name = "desc"; 
			  sorttype = "desc"; 
		   }
	   }
	   else if(name=="last_name"){
		   if($scope.sortlast_name=="desc"){
			  $scope.sortlast_name = "asc"; 
			  sorttype = "asc";   
		   }
		   else {
			  $scope.sortlast_name = "desc" 
			  sorttype = "desc"; 
		   }
	   }
	   else if(name=="email"){
		   if($scope.sortemail=="desc"){
			  $scope.sortemail = "asc" 
			  sorttype = "asc";   
		   }
		   else {
			  $scope.sortemail = "desc" 
			  sorttype = "desc"; 
		   }
	   }
	   else if(name=="username"){
		   if($scope.sortusername=="desc"){
			  $scope.sortusername = "asc" 
			  sorttype = "asc";   
		   }
		   else {
			  $scope.sortusername = "desc" 
			  sorttype = "desc"; 
		   }
	   }
	   
	   $http.get('http://127.0.0.1:8081/showusers?sortfield='+name+'&sorttype='+sorttype).then(function(response){	  
	         $scope.users = response.data;   	  			
	   });*/
   }

   /*$scope.checkAllToggle = function(){
	   //alert($scope.user.checkall);
	   console.log($scope.user.ids);
	   
	   if($scope.user.checkall){
		   $scope.user.checkall = false;
	   }
	   else {
		   $scope.user.checkall = true;		   
	   }
	   
	   angular.forEach($scope.users, function (x) {
            x.Selected = $scope.user.checkall;
			
       });
	   console.log($scope.users);
   }*/

   $scope.checkAllToggle = function(){	 
       angular.forEach($scope.users, function (x) {
            x.Selected = true;			
       });	   
   }

   $scope.uncheckAllToggle = function(){	   
	   angular.forEach($scope.users, function (x) {
            x.Selected = false;			
       });	   
   }

   $scope.removeUsers = function(){	   
       $scope.selected = [];
	   angular.forEach($scope.users, function (value , key) {
		    console.log(value.Selected);		
			if(value.Selected){
              $scope.selected[key] = value._id;
			}
       });
       console.log($scope.selected);
	   
	   var ids = $scope.selected.join();
       $http.get('http://127.0.0.1:8081/removemultiple?ids='+ids).then(function(response){	
			if(response.data['authen']=='1'){
				//localStorageService.set('login' , '1');
			    $route.reload();
			}										   	  	
	   }); 	   	  
   }   
});


