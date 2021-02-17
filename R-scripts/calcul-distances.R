library("readtext")
library("dplyr")
library("stringdist")
library("svMisc")

donnees=readtext("/Users/cedric.eyssette/Documents/GitHub/textes-philosophie/data/textes-FINAL.tsv", text_field="text", quote="", fill=TRUE)

textes=select(donnees,text,Auteur)

calcul_distance <- function(x, y){
  stringdist(as.character(x),as.character(y))
}

matrice_distances=data.frame("Row1","Row2","Distance")


for (i in 1:nrow(textes)) {
  progress(i, progress.bar = TRUE)
  Sys.sleep(0.01)x
  row_i=slice(textes,i)
  auteur_i=as.character(row_i[,2])
  mots_auteur_i=strsplit(auteur_i," ")
  for (j in 1:nrow(textes)) {
    row_j=slice(textes,j)
    auteur_j=as.character(row_j[,2])
    mots_auteur_j=strsplit(auteur_j," ")
    if (length(intersect(mots_auteur_i,mots_auteur_j)) > 0) {
      matrice_distances=rbind(matrice_distances,list(i,j,calcul_distance(row_i[,1],row_j[,1])))    
    }
  }
}

head(matrice_distances)