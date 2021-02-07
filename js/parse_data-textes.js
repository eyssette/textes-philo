var rows;
var allResults;
var title;
var content;
var tableBody;
var tableBodyStart = document.getElementsByTagName("tbody")[0].innerHTML;

var urls =  ['https://raw.githubusercontent.com/eyssette/textes-philo/main/data/textes-ce.tsv', 'https://raw.githubusercontent.com/eyssette/textes-philo/main/data/textes-gren.tsv', 'https://raw.githubusercontent.com/eyssette/textes-philo/main/data/textes-maphil.tsv', 'https://raw.githubusercontent.com/eyssette/textes-philo/main/data/textes-mater.tsv', 'https://raw.githubusercontent.com/eyssette/textes-philo/main/data/textes-collected.tsv', 'https://raw.githubusercontent.com/eyssette/textes-philo/main/data/textes-haut.tsv', 'https://raw.githubusercontent.com/eyssette/textes-philo/main/data/textes-bac.tsv']

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
  }
)
.catch(//log the error
  err=>console.warn("Something went wrong:",err)
)

var input = document.getElementById("recherche_dans_le_sujet");
input.oninput = handleInput;
let checker = (arr, target) => target.every((v) => arr.includes(v));

function handleInput(e) {
	var searchInput = input.value.toLowerCase();
	if (this.timer) {
		window.clearTimeout(this.timer);
	}
	this.timer = window.setTimeout(function() {
		if (searchInput.length>2) {
		 searchItems = searchInput.split("+");
		tableBody = "<tbody>";

		rows.forEach((element) => {
				cellules = element[0].split("\t");
				source=cellules.toString().toLowerCase();
				if (checker(source,  searchItems)) {
					scorePertinence=0;
					searchItems.forEach((search_item) => {
						nombreOccurrences = source.split(search_item).length - 1;
						scorePertinence=scorePertinence+nombreOccurrences;
					});
					texte='« '+cellules[2]+' »';
					tableBody = tableBody + "<tr>";
					auteur='<br/><b>'+cellules[0]+'</b>';
					if(cellules[1]){reference=', '+cellules[1]} else{reference=''};
					if(cellules[3]){precisions='<br/>'+cellules[3]} else{precisions=''};
						tableBody = tableBody + "<td>" +texte+auteur+reference+precisions + "</td>";
					
				tableBody = tableBody + "</tr>";
			}
		});
		tableBody = tableBody + "</tbody>";
		document.getElementsByTagName("tbody")[0].innerHTML = tableBody;
		var context = document.getElementById("content");
		var instance = new Mark(context);
		instance.mark( searchItems, options = {
			"accuracy": "complementary", "separateWordSearch": false
		});
	} else {
		document.getElementsByTagName("tbody")[0].innerHTML = tableBodyStart;
	}
	}, 300);
}