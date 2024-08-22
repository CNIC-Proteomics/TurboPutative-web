#
# myVSN.R 
#

cat("** Start myVSN.R\n")

# Import libraries
cat("** Loading libraries\n")
library(vsn)
library(Biobase)

# Get command line arguments
cat("** Reading arguments\n")
args <- commandArgs(trailingOnly = TRUE)
infile <- args[1]
outfile <- args[2]
outpng <- args[3]

# Read input table
cat("** Reading input table\n")
df <- read.csv(infile, sep = '\t', row.names = 1)
eset <- new("ExpressionSet", exprs=as.matrix(df))

# Apply VSN
cat("** Apply VSN\n")
dfnorm <- justvsn(eset)

# Generate control figure
cat("** Save meanSdPlot\n")
png(filename=outpng)
meanSdPlot(dfnorm)
dev.off()

cat("** Writing normalized table\n")
xnorm <- as.data.frame(dfnorm@assayData$exprs)
write.table(xnorm[rownames(df), colnames(df)], outfile, sep='\t', row.names=FALSE)

cat("** End script\n")