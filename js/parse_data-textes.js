var rows;
var allResults;
var title;
var content;
var table_body;
var table_body_start = document.getElementsByTagName("tbody")[0].innerHTML;

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
		rows=results[0].data.concat(results[1].data).concat(results[2].data).concat(results[3].data).concat(results[4].data);
		table_body = "<tbody>";
		rows.forEach((element) => {
			recherche = document.getElementById("recherche_dans_le_sujet").value;
			table_body = table_body + "<tr>";
			cellules = element[0].split("\t");
			cellules.forEach((cell) => {
				table_body = table_body + "<td>" + cell + "</td>";
			});
			table_body = table_body + "</tr>";
		});
		table_body = table_body + "</tbody>";
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
		if (searchInput) {
		search_items = searchInput.split("+");

		table_body = "<tbody>";
		rows.forEach((element) => {
				cellules = element[0].split("\t");
				texte='« '+cellules[2]+' »';
				if (checker(cellules.toString().toLowerCase(), search_items)) {
					table_body = table_body + "<tr>";
					auteur='<br/><b>'+cellules[0]+'</b>';
					if(cellules[1]){reference=', '+cellules[1]} else{reference=''};
					if(cellules[3]){precisions='<br/>'+cellules[3]} else{precisions=''};
						table_body = table_body + "<td>" +texte+auteur+reference+precisions + "</td>";
					
				table_body = table_body + "</tr>";
			}
		});
		table_body = table_body + "</tbody>";
		document.getElementsByTagName("tbody")[0].innerHTML = table_body;
		var context = document.getElementById("content");
		var instance = new Mark(context);
		instance.mark(search_items, options = {
			"accuracy": "complementary", "separateWordSearch": false
		});
	} else {
		document.getElementsByTagName("tbody")[0].innerHTML = table_body_start;
	}
	}, 300);
}