function Vertex(x,y){
	this.x_cor = x;
	this.y_cor =y;
};

graph = new Graph();
let dragObject;

function MouseEvents(){
	this.onMouseOver = function(mode, event, obj){
		let className = obj.getAttribute("class");
		let classes = document.getElementsByClassName(className);
		classes[0].setAttributeNS(null,"fill","#FF5400");
		classes[1].setAttributeNS(null,"stroke","black");
	}

	this.onMouseMove = function(mode, event, obj){
		let bodyRect = document.body.getBoundingClientRect();
		let Rect = document.getElementById("graph").getBoundingClientRect();
		let diff  = Rect.top - bodyRect.top;
		switch(mode){
			case 1:{
				let el = document.getElementById("Moving Edge");
				if(el != null){
					let x2, y2;
					if(el.getAttribute(null, "x1") > event.pageX)	x2 = event.pageX + 10;
					else											x2 = event.pageX - 5;
					if(el.getAttribute(null, "y1") < event.pageY)	y2 = event.pageY + 10 - diff;
					else											x2 = event.pageY - 5 - diff;
					el.setAttributeNS(null, "x2", x2);
					el.setAttributeNS(null, "y2", y2);
				}
			}
			default:{
				if(dragObject == null){
					return;
				}
				let className = dragObject.getAttribute("class");
				className  = parseInt(className.replace("node",""));

				if(event.pageX >= Rect.right || event.pageY <= Rect.top){
					return;
				}
				graph.updateNode(event.pageX, event.pageY - diff, className);
			}
		}
	}
	
	this.onMouseDown = function(mode, event, obj){
		dragObject = obj;

		graphSheet = document.getElementById("graph");
		graphSheet.addEventListener("mouseleave", (event) => {this.onMouseLeave(mode, event, graphSheet)}, false);
		graphSheet.addEventListener('mousemove', (event) => {this.onMouseMove(mode, event, graphSheet)}, false);
	}

	this.onMouseUp = function(mode, event, obj){
		dragObject = null;

		graphSheet = document.getElementById("graph");
		graphSheet.removeEventListener("mouseleave", (event) => {this.onMouseLeave(mode, event, graphSheet)}, false);
		graphSheet.removeEventListener('mousemove', (event) => {this.onMouseMove(mode, event, graphSheet)}, false);
	}

	this.onClick = function(mode, event, obj){
		let className = obj.getAttribute("class");
		className = className.replace("node" ,"");
		classname = parseInt(className);
		switch(mode){
			case 1:{
				graphSheet = document.getElementById("graph");
				graphSheet.addEventListener("mouseleave", (event) => {this.onMouseLeave(mode, event, graphSheet)}, false);
				graphSheet.addEventListener('mousemove', (event) => {this.onMouseMove(mode, event, graphSheet)}, false);
				graph.drawEdge(className);
				break;
			}
			case 2:{
				console.log(className);
				graph.show();
				graph.bfs(className);
				break;
			}
			case 3:{
				console.log(className);
				className = parseInt(className);
				graph.show();
				graph.dfs(className);
				break;
			}
		}
	}
	this.onMouseOut = function(mode, event, obj){
		let className = obj.getAttribute("class");
		let classes = document.getElementsByClassName(className);
		classes[0].setAttributeNS(null,"fill","black");
		classes[1].setAttributeNS(null,"stroke","white");
	}
	this.onMouseLeave = function(mode, event, obj){
		dragObject = null;
	}
}
function Graph(){
	let orderofbfs = [];
	let orderofdfs = [];
	let vertices = [];
	let noOfVertice = 0;
	let mode =0;
	let temp_edge;
	let adjacencyList = [];
	// let update = 0;
	let mouseEvent = new MouseEvents;
	this.setVertices  = function(n){
		noOfVertice = n;
		for(let i = 0; i < n; i++){
			adjacencyList.push([]);
		}
		createNodes();
	}
	let cnt1=0,cnt2=0,cnt3=0;
	this.setMode = function(m){
		mode = m;
		switch(mode){
			case 1:{
				if(cnt1 == 0){
					alert("You have entered edit mode! Click on the node you want to move and then move it.");
				}
				cnt1++;
				break;
			}
			case 2:{
				if(cnt2==0){
					alert("Click on the node you want to start BFS on!");
				}
				cnt2++;
				break;
			}
			case 3:{
				if(cnt3==0){
					alert("click on the node you want to start dfs on!");
				}
				cnt3++;
				break;
			}
		}
	}

	this.addVertices = function(a){
		a = parseInt(a);
		for(let i = 0; i < a; i++){
			adjacencyList.push([]);
			v = new Vertex(avgx(), avgy());
			vertices.push(v);
		}
		noOfVertice += a;
		this.show();
	}

	this.drawEdge = function(vertex){
		let movingEdge = document.getElementById("Moving Edge");
		let el = document.getElementById("graph");
		if(movingEdge == null){
			const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
			line.setAttributeNS(null,"x1", vertices[vertex].x_cor);
			line.setAttributeNS(null,"y1", vertices[vertex].y_cor);
			line.setAttributeNS(null,"x2", vertices[vertex].x_cor);
			line.setAttributeNS(null,"y2", vertices[vertex].y_cor);
			line.setAttributeNS(null,"style","stroke:white;stroke-width:2");
			line.setAttribute("id", "Moving Edge");
			temp_edge = vertex;
			el.appendChild(line);
		}else{
			graphSheet = document.getElementById("graph");
			graphSheet.removeEventListener("mouseleave", (event) => {this.onMouseLeave(mode, event, graphSheet)}, false);
			graphSheet.removeEventListener('mousemove', (event) => {this.onMouseMove(mode, event, graphSheet)}, false);
			this.addEdge(temp_edge, vertex);
			el.removeChild(movingEdge);
			this.show();
		}
	}

	function createNodes(){
		center_x  = screen.width*0.4;
		center_y = screen.height*0.3;
		angle = 2*Math.PI/noOfVertice;
		newvertices = [];
		for(let i = 1; i <= noOfVertice; i++){
			let v;
			xcor = center_x + noOfVertice*15*Math.sin(i*angle);
			ycor = center_y + noOfVertice*15*Math.cos(i*angle);
			v = new Vertex(xcor,ycor);
			newvertices.push(v);
		}
		vertices = newvertices;
	}

	function avgx(){
		if(noOfVertice == 0)	return screen.width*0.4;
		let sum = 0;
		for(let i = 0; i < noOfVertice; i++){
			sum += vertices[i].x_cor;
		}
		return sum/noOfVertice;
	}

	function avgy(){
		if(noOfVertice == 0)	return screen.height*0.3;
		let sum = 0;
		for(let i = 0; i < noOfVertice; i++){
			sum += vertices[i].y_cor;
		}
		return sum/noOfVertice;
	}

	this.addEdge = function(a,b){
		a = parseInt(a);
		b = parseInt(b);
		if(a == b)	return;
		for(let i = 0; i < adjacencyList[a].lenght; i++){
			if(adjacencyList[a][i] == b)	return;
		}
		adjacencyList[a].push(b);
		adjacencyList[b].push(a);
		edges++;
	}
	this.deleteEdge = function(a,b){
		a =parseInt(a);
		b= parseInt(b); 
		let newList = [];
		for(let i = 0; i < adjacencyList[a].length; i++){
			if(adjacencyList[a][i] == b)	continue;
			newList.push(adjacencyList[a][i]);
		} 
		adjacencyList[a] = newList;
		newList = [];
		for(let i = 0; i < adjacencyList[b].length; i++){
			if(adjacencyList[b][i] == a)	continue;
			newList.push(adjacencyList[b][i]);
		}
		adjacencyList[b] = newList;
		edges--;
	}
	this.updateNode = function(x,y,pos){
		vertices[pos].x_cor = x;
		vertices[pos].y_cor = y;
		this.show();
	}
	this.show = function(){
		document.getElementById("graph").innerHTML = "";
		let err=0; 
		for(let i =0;i < adjacencyList.length; i++){
			for(let j = 0; j < adjacencyList[i].length; j++){
				let x = i;
				let y = adjacencyList[i][j];
				if(x > noOfVertice-1 || y > noOfVertice-1 || x < 0 || y < 0){
				   err =1;
				   continue;
				}
				if(y > x)	continue;
				let x1 = vertices[x].x_cor;
				let y1 = vertices[x].y_cor;
				let x2 = vertices[y].x_cor;
				let y2 = vertices[y].y_cor;
				const el = document.getElementById("graph");
				const line = document.createElementNS('http://www.w3.org/2000/svg',"line");
				line.setAttributeNS(null,"x1",x1);
				line.setAttributeNS(null,"x2",x2);
				line.setAttributeNS(null,"y1",y1);
				line.setAttributeNS(null,"y2",y2);
				// line.setAttributeNS(null,"style","z-index : -1;")
				line.setAttributeNS(null,"style","stroke:white;stroke-width:2");
				el.appendChild(line);
			}
		}
		if(err)
		alert("Some Edges were out of bounds! ");
		for(let i = 0; i < noOfVertice; i++){
			const el = document.getElementById("graph");	
			const ver = document.createElementNS('http://www.w3.org/2000/svg',"circle");
			const txt = document.createElementNS('http://www.w3.org/2000/svg',"text");
			txt.innerHTML  =  i+1;

			x_ver  = vertices[i].x_cor;   
			y_ver  = vertices[i].y_cor;
			x_text = x_ver-3;
			y_text = y_ver+6;
			id_cir = "cir" +i;
			id_text = "txt" + i;
			className = "node"+i;

			ver.setAttributeNS(null,"stroke","black");
			ver.setAttributeNS(null,"stroke-width","2");
			ver.setAttributeNS(null,"fill","black");
			ver.setAttributeNS(null,"cx",x_ver);
			ver.setAttributeNS(null,"cy",y_ver);
			txt.style["font-size"]="16";
			txt.setAttributeNS(null,"x",x_text);
			txt.setAttributeNS(null,"y",y_text);
			txt.setAttributeNS(null,"stroke","white");
			ver.setAttributeNS(null,"r","15");
			ver.setAttributeNS(null,"id",id_cir);
			txt.setAttributeNS(null,"id",id_text);
			ver.setAttributeNS(null,"class",className);
			txt.setAttributeNS(null,"class",className);
			ver.setAttribute("style","z-index:10;");
			txt.setAttribute("style","z-index:10;");

			ver.addEventListener('mousedown', (event) => {mouseEvent.onMouseDown(mode, event, ver)}, false);
			txt.addEventListener('mousedown', (event) => {mouseEvent.onMouseDown(mode, event, txt)}, false);

			ver.addEventListener('mouseup', (event) => {mouseEvent.onMouseUp(mode, event, ver)}, false);
			txt.addEventListener('mouseup', (event) => {mouseEvent.onMouseUp(mode, event, txt)}, false);

			ver.addEventListener('click', (event) => {mouseEvent.onClick(mode, event, ver)}, false)
			txt.addEventListener('click', (event) => {mouseEvent.onClick(mode, event, txt)},false)

			ver.addEventListener('mouseover', (event) => {mouseEvent.onMouseOver(mode, event, ver)}, false);
			txt.addEventListener('mouseover', (event) => {mouseEvent.onMouseOver(mode, event, txt)}, false);
			
			ver.addEventListener('mouseout', (event) => {mouseEvent.onMouseOut(mode, event, ver)}, false);
			txt.addEventListener('mouseout', (event) => {mouseEvent.onMouseOut(mode, event, txt)}, false);

			el.appendChild(ver);
			el.append(txt);
		}      
	}
	function color(arr,index){
		className = "node"+arr[index];
		let classes = document.getElementsByClassName(className);
		classes[0].setAttributeNS(null,"fill","#FF5400");  
		classes[1].setAttributeNS(null,"stroke","white");
	}

	this.bfs = function(x){
		orderofbfs = [];
		orderofbfs.push(parseInt(x));
		let cur = 0;
		let visit = [];     
		for(let i=0;i<noOfVertice;i++){
			visit.push(0);
		}

		start = setInterval(function(){
			color(orderofbfs, 0);
			clearInterval(start);
		}, 1000);

		Iterator = setInterval(function(){
			if(cur == orderofbfs.length){
				reset = setInterval(function(){
					for(let i = 0; i < noOfVertice; i++){
						document.getElementsByClassName("node"+i)[0].setAttribute("fill", "black");
						clearInterval(reset);
					}
				}, 1000);
				clearInterval(Iterator);
				return;
			}
			let u  = parseInt(orderofbfs[cur]);
			let prev = orderofbfs.length - 1;
			document.getElementsByClassName("node"+orderofbfs[cur])[0].setAttributeNS(null, "stroke", "black");
			visit[u] = 1;
			for(let i = 0; i < adjacencyList[u].length; i++){
				v = parseInt(adjacencyList[u][i]);
				if(visit[v] == 0){
					orderofbfs.push(v);  
					visit[v] = 1;
				}
			}
			cur++;
			for(let i = prev + 1; i < orderofbfs.length; i++){
				color(orderofbfs,i);
			}
			document.getElementsByClassName("node"+orderofbfs[cur])[0].setAttributeNS(null, "stroke", "white");
		},1000);
		console.log(orderofbfs);
	}

	this.dfs  = function(x){
		orderofdfs = [];
		algoReady();
		let visit  = [];
		for(let i=0;i<noOfVertice;i++){
			visit.push(0);
		}
		doDfs(visit,x);
		index =0;
		myInterval = setInterval(function(){color(orderofdfs,index);index++;if(index==orderofdfs.length){
		clearInterval(myInterval);
	   return;}},1000);
		console.log(orderofdfs);
	}
	function doDfs(visit,x){
		console.log("yes");
		if(visit[x]==0){
			visit[x]=1;
			orderofdfs.push(x);
			for(let i =0;i<adjacencyList[x].length;i++){
				if(visit[adjacencyList[x][i]]==0)
					doDfs(visit,adjacencyList[x][i]);
			}
		}
	}
}

// setInterval(graph.show(),100);
function Input(){
	let n,m;
	n = parseInt(document.getElementById('vertices').value);
	m = document.getElementById('edges').value;
	graph.setVertices(n);
	m = m.replaceAll(" ","");
	m = m.replaceAll("\n","");

	for(let i=0;i<m.length;i+=2){
		graph.addEdge(m[i] - 1,m[i+1] - 1);
		graph.addEdge(m[i+1] - 1, m[i] - 1);
	}
	graph.show();
	// setInterval(graph.show(),100);
}

function setMode(mode){
	graph.setMode(mode);
}
function newEdge(){
	m  = document.getElementById('newEdge').value;
	m = m.replace(" ","");
	m = m.replaceAll("\n","");
	for(let i=0;i<m.length;i+=2){
		graph.addEdge(m[i] - 1,m[i+1] - 1);
	}
	graph.show();
}

function deleteEdge(){
	m  = document.getElementById('deleteEdge').value;
	m = m.replace(" ","");
	m = m.replaceAll("\n","");
	for(let i=0;i<m.length;i+=2){
		graph.deleteEdge(m[i] - 1,m[i+1] - 1);
	}
	graph.show();
}