# Import libraries
library(MultiAssayExperiment)

# Constants
OMICS <- c('Transcriptomics', 'Proteomics', 'Metabolomics')

# Parse command arguments
args <- commandArgs(trailingOnly = TRUE)
basepath <- args[1]
#basepath <- "S:\\U_Proteomica\\UNIDAD\\Softwares\\MacrosRafa\\data\\Metabolomics\\PESA_Integromics\\TestServer\\SummarizedExperiment\\Extraction"

cat("** Start ExtractMultiAssayExperiment.R\n")

# Read MAE object
cat("** Reading MultiAssayExperiment.rds\n")
mae <- readRDS(file.path(basepath, 'MultiAssayExperiment.rds'))

if (class(mae) != "MultiAssayExperiment") {
  cat("** Uploaded object was not MultiAssayExperiment\n")
  quit(1)
}

# Write metadata
cat("** Writing metadata\n")
mdata <- colData(mae)
if(ncol(mdata) != 0 && nrow(mdata) != 0) {
  write.table(mdata, file=file.path(basepath, 'mdata.tsv'),quote=F, sep='\t')
}

# Loop omics and write quantifications and metadata
for (omic in names(experiments(mae))){
  
  if (!(omic %in% OMICS)) { next }
  
  cat("** Extracting", omic, "\n")
  
  se <- experiments(mae)[[omic]]
  
  cat("** Writing quantifications for", omic, "\n")
  write.table(assay(se), file=file.path(basepath, paste0('x',omic,'.tsv')),quote=F, sep='\t')
  
  if (ncol(rowData(se))>0) {
    cat("** Witing metadata for", omic, "\n")
    write.table(rowData(se), file=file.path(basepath, paste0(omic,'2i.tsv')),quote=F, sep='\t')
  }
}

cat("** End script\n")