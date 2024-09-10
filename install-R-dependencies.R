# Install R dependencies

cat("** Install BiocManager\n")
install.packages("BiocManager", repos="https://cloud.r-project.org")

cat("** Install jsonlite\n")
install.packages("jsonlite", repos="https://cloud.r-project.org")

install.packages("https://cloud-project.org/src/contrib/lattice_0.22-6.tar.gz", repos=NULL)
install.packages("https://cloud.r-project.org/src/contrib/Archive/Matrix/Matrix_1.6-5.tar.gz", repos=NULL)
install.packages("https://cloud.r-project.org/src/contrib/Archive/MASS/MASS_7.3-60.0.1.tar.gz", repos=NULL)

cat("** Install utf8\n")
install.packages("https://cloud.r-project.org/src/contrib/utf8_1.2.4.tar.gz", repos=NULL)

cat("** Install fgsea\n")
BiocManager::install("fgsea", update = FALSE)

cat("** Install reactome.db\n")
BiocManager::install("reactome.db", update = FALSE)

cat("** Install vsn\n")
BiocManager::install("vsn", update = FALSE)
install.packages("https://cloud.r-project.org/src/contrib/hexbin_1.28.4.tar.gz", repos=NULL)

cat("** Install Biobase\n")
BiocManager::install("Biobase", update = FALSE)

cat("** Install MultiAssayExperiment\n")
BiocManager::install("MultiAssayExperiment", update = FALSE)