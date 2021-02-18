library("readtext")
library("dplyr")
library("stringdist")

donnees=readtext("/Users/cedric.eyssette/Documents/GitHub/textes-philosophie/data/textes-FINAL.tsv", text_field="text", quote="", fill=TRUE)

textes=select(donnees,text,Auteur)

calcul_distance <- function(x, y){
  stringdist(as.character(x),as.character(y))
}

matrice_distances=data.frame("Row1","Row2","Distance")

combinatoire=combn(nrow(textes),2, simplify=FALSE)

# Attention, calcul très long à effectuer

for (i in 1:length(combinatoire)) {
  combinatoire_i=strsplit(as.character(combinatoire[[i]])," ")
  combinatoire_i1=as.numeric(combinatoire_i[1])
  combinatoire_i2=as.numeric(combinatoire_i[2])
  row1=slice(textes,combinatoire_i1)
  row2=slice(textes,combinatoire_i2)
  auteur1=as.character(row1[,2])
  mots_auteur1=strsplit(auteur1," ")
  auteur2=as.character(row2[,2])
  mots_auteur2=strsplit(auteur2," ")
  if (length(intersect(mots_auteur1,mots_auteur2)) > 0) {
    matrice_distances=rbind(matrice_distances,list(combinatoire_i1,combinatoire_i2,calcul_distance(row1[,1],row2[,1])))
  }
  if(i %% 500==0) {
    print(i)
  }
}

head(matrice_distances)