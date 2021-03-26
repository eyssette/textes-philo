var rows;
var allResults;
var title;
var content;
var tableBody;
var tableBodyStart = document.getElementsByTagName("tbody")[0].innerHTML;

var urls =  ['https://raw.githubusercontent.com/eyssette/textes-philo/main/data/textes-FINAL.tsv', 'https://raw.githubusercontent.com/eyssette/textes-philo/main/data/textes-new.tsv']

Promise.all(
  urls
  .map(
    url=>
      new Promise(
        (resolve,reject)=>
          Papa.parse(
            url,
            {
			  download: true,
			  header: false,
			  delimiter: "    ",
              complete:resolve,
              error:reject
            }
          )
      )
  )
)
.then(
  function (results) {
		rows=results[0].data;	
		for (let i = 1; i < urls.length; i++) {
			rows = rows.concat(results[i].data);
		};
		rows = rows.splice(1, rows.length);
  }
)
.catch(//log the error
  err=>console.warn("Something went wrong:",err)
)

var input = document.getElementById("recherche_dans_le_sujet");
var boutonRecherche = document.getElementById("rechercher");
boutonRecherche.onclick = handleInput;
  input.addEventListener("keyup", function(event) {
    if (event.code === 'Enter') {
		boutonRecherche.click();
    }
});


let checker = (arr, target) => target.every((v) => arr.includes(v));

function handleInput(e) {
	document.getElementsByTagName("tbody")[0].innerHTML = '<td></td><td><span class="loader"></span></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>';
	var searchInput = input.value.toLowerCase();
	/*if (this.timer) {
		window.clearTimeout(this.timer);
	}
	this.timer = window.setTimeout(function() {*/
		if (searchInput.length>2) {
		searchItems = searchInput.split("+");
		tableBody = "<tbody>";

		rows.forEach((element) => {
				cellules = element[0].split("\t");
				source=cellules.toString().toLowerCase();
				if (checker(source,  searchItems)) {
					scorePertinence=0;
					searchItems.forEach((search_item) => {
						regex = new RegExp('\\b'+search_item+'\\b|\\b'+search_item+'s\\b','gi');
						
						nombreOccurrencesTexte = cellules[2].toLowerCase().split(search_item).length - 1
						nombreOccurrencesTextePerfectMatch = ((cellules[2].toLowerCase().match(regex) || []).length)*2
						scorePertinence=scorePertinence+((nombreOccurrencesTexte+nombreOccurrencesTextePerfectMatch)*2);
						
						nombreOccurrencesAuteur = cellules[0].toLowerCase().split(search_item).length - 1;
						nombreOccurrencesAuteurPerfectMatch = ((cellules[0].toLowerCase().match(regex) || []).length)*2
						scorePertinence=scorePertinence+((nombreOccurrencesAuteur+nombreOccurrencesAuteurPerfectMatch)*4);
						
						if(cellules[3]){
							nombreOccurrencesPrecisions = cellules[3].toLowerCase().split(search_item).length - 1;
							scorePertinence=scorePertinence+nombreOccurrencesPrecisions;
						}
						
						if(cellules[1]) {
							nombreOccurrencesReference = cellules[1].toLowerCase().split(search_item).length - 1;
							scorePertinence=scorePertinence+nombreOccurrencesReference;
						}
					});
					texte='« '+cellules[2]+' »';
					tableBody = tableBody + "<tr>";
					auteur='<br/><b>'+cellules[0]+'</b>';
					if(cellules[1]){reference=', '+cellules[1]} else{reference=''};
					if(cellules[3]){precisions='<br/>'+cellules[3]} else{precisions=''};
					if(cellules[4]){c1='<td><span class="tooltip">'+cellules[4]+'<span class="tooltiptext">Éthique et philosophie morale</span></span>'+'</td>'} else {c1='<td></td>'};
					if(cellules[5]){c2='<td><span class="tooltip">'+cellules[5]+'<span class="tooltiptext">Philosophie de l\'esprit</span></span>'+'</td>'} else {c2='<td></td>'};
					if(cellules[6]){c3='<td><span class="tooltip">'+cellules[6]+'<span class="tooltiptext">Philosophie de la culture</span></span>'+'</td>'} else {c3='<td></td>'};
					if(cellules[7]){c4='<td><span class="tooltip">'+cellules[7]+'<span class="tooltiptext">Philosophie sociale et politique</span></span>'+'</td>'} else {c4='<td></td>'};
					if(cellules[8]){c5='<td><span class="tooltip">'+cellules[8]+'<span class="tooltiptext">Épistémologie et métaphysique</span></span>'+'</td>'} else {c5='<td></td>'};
					if(cellules[9]){c6='<td><span class="tooltip">'+cellules[9]+'<span class="tooltiptext">Philosophie du langage</span></span>'+'</td>'} else {c6='<td></td>'};
						tableBody = tableBody + "<td>"+auteur+"</td>"+"<td>" +texte+auteur+reference+precisions+ "</td>"+"<td>"+scorePertinence+"</td>"+c1+c2+c3+c4+c5+c6;
					
				tableBody = tableBody + "</tr>";
			}
		});
		tableBody = tableBody + "</tbody>";
		document.getElementsByTagName("tbody")[0].innerHTML = tableBody;
		var context = document.getElementById("content");
		i_search=1;
		searchItems.forEach((search_item) => {
			var instance = new Mark(context);
			instance.mark( search_item, options = {
			"element": "span", "className":"match"+i_search, "accuracy": "complementary", "separateWordSearch": false
			});
			i_search=i_search+1;
		});

		fdTableSort.init("textes");
		fdTableSort.jsWrapper("textes", [2,0]);
	} else {
		document.getElementsByTagName("tbody")[0].innerHTML = tableBodyStart;
	}
	/*}, 350);*/
}