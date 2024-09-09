# Install R dependencies

cat("** Install BiocManager")
install.packages("BiocManager")

cat("** Install jsonlite")
install.packages("jsonlite")

cat("** Install utf8")
install.packages("https://cran.r-project.org/src/contrib/utf8_1.2.4.tar.gz", repos=NULL)

cat("** Install fgsea")
BiocManager::install("fgsea", , update = FALSE)

cat("** Install reactome.db")
BiocManager::install("reactome.db", , update = FALSE)

cat("** Install vsn")
BiocManager::install("vsn", , update = FALSE)
install.packages("https://cran.r-project.org/src/contrib/hexbin_1.28.4.tar.gz", repos=NULL)

cat("** Install Biobase")
BiocManager::install("Biobase", , update = FALSE)

cat("** Install MultiAssayExperiment")
BiocManager::install("MultiAssayExperiment", update = FALSE)